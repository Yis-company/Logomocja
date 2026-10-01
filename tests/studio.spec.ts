import { test, expect, type Page } from "@playwright/test";

const editor = (page: Page) =>
  page.getByRole("textbox", { name: "Kod programu Logo" });
const stage = (page: Page) => page.locator(".stage");
const run = (page: Page) =>
  page.getByRole("button", { name: "Uruchom", exact: true });
const mode3D = (page: Page) => page.getByRole("tab", { name: /3D Przestrzeń/ });
const mode2D = (page: Page) =>
  page.getByRole("tab", { name: /2D Płaszczyzna/ });
async function complete(page: Page) {
  await run(page).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Program zakończony" }),
  ).toBeVisible();
}

test("runs real 2D output with working defaults", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(stage(page)).toHaveAttribute("data-segments", "0");
  await complete(page);
  await expect(stage(page)).toHaveAttribute("data-segments", "48");
  const ink = await page.locator("canvas").evaluate((canvas) => {
    const ctx = (canvas as HTMLCanvasElement).getContext("2d");
    if (!ctx) throw new Error("No canvas context");
    const { data } = ctx.getImageData(
      0,
      0,
      (canvas as HTMLCanvasElement).width,
      (canvas as HTMLCanvasElement).height,
    );
    let pixels = 0;
    for (let i = 0; i < data.length; i += 4)
      if (
        data[i] < 70 &&
        data[i + 1] > 80 &&
        data[i + 2] < 130 &&
        data[i + 3] > 200
      )
        pixels++;
    return pixels;
  });
  expect(ink).toBeGreaterThan(2000);
  await page.screenshot({
    path: "output/playwright/studio-2d.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("pause, single step, resume and reset preserve their contracts", async ({
  page,
}) => {
  await page.goto("/");
  await editor(page).fill("repeat 6 [fd 10]");
  await page.getByRole("slider").focus();
  await page.keyboard.press("Home");
  await run(page).click();
  await expect
    .poll(async () => Number(await stage(page).getAttribute("data-segments")))
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Pauza", exact: true }).click();
  const paused = Number(await stage(page).getAttribute("data-segments"));
  await page.waitForTimeout(300);
  await expect(stage(page)).toHaveAttribute("data-segments", String(paused));
  await page.getByRole("button", { name: "Krok", exact: true }).click();
  await expect(stage(page)).toHaveAttribute(
    "data-segments",
    String(paused + 1),
  );
  await page.getByRole("button", { name: "Wznów", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Program zakończony" }),
  ).toBeVisible();
  await expect(stage(page)).toHaveAttribute("data-segments", "6");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(stage(page)).toHaveAttribute("data-segments", "0");
  await expect(editor(page)).toHaveValue("repeat 6 [fd 10]");
});

test("invalid source preserves prior drawing and gives line and column", async ({
  page,
}) => {
  await page.goto("/");
  await editor(page).fill("fd 50");
  await complete(page);
  await editor(page).fill("; comment\nfd 20\n  xyz 30");
  await run(page).click();
  await expect(page.getByRole("alert")).toContainText("Wiersz 3, kolumna 3");
  await expect(stage(page)).toHaveAttribute("data-segments", "1");
  await editor(page).fill("fd 10");
  await complete(page);
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("executes actual 3D paths, orbit controls and camera presets", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await mode3D(page).click();
  await expect(page.locator(".three-host canvas")).toBeVisible();
  await complete(page);
  await expect(stage(page)).toHaveAttribute("data-segments", "12");
  await expect(stage(page)).toHaveAttribute("data-z", "120");
  await page.screenshot({
    path: "output/playwright/studio-3d.png",
    fullPage: true,
  });
  const canvas = page.locator(".three-host canvas");
  const before = await canvas.screenshot();
  const box = await canvas.boundingBox();
  if (!box) throw new Error("No 3D canvas");
  await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.55, {
    steps: 12,
  });
  await page.mouse.up();
  await page.waitForTimeout(300);
  expect(before.equals(await canvas.screenshot())).toBe(false);
  await expect(stage(page)).toHaveAttribute("data-z", "120");
  const top = page.getByRole("button", { name: "Z góry", exact: true });
  await top.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Z przodu", exact: true }).click();
  await page.getByRole("button", { name: "Reset widoku", exact: true }).click();
  await page.getByRole("button", { name: "Powiększ rysunek" }).click();
  await page.getByRole("button", { name: "Pomniejsz rysunek" }).click();
  for (let i = 0; i < 3; i++) {
    await mode2D(page).click();
    await mode3D(page).click();
    await expect(canvas).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(canvas).toBeVisible();
  await complete(page);
  await page.screenshot({
    path: "output/playwright/studio-3d-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("restores separate mode drafts without executing on reload", async ({
  page,
}) => {
  await page.goto("/");
  await editor(page).fill("fd 43");
  await mode3D(page).click();
  await editor(page).fill("pitchup 90 fd 29");
  await mode2D(page).click();
  await expect(editor(page)).toHaveValue("fd 43");
  await mode3D(page).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("logomocja.drafts.v1") ?? "{}")
            .sources?.["3d"],
      ),
    )
    .toBe("pitchup 90 fd 29");
  await page.reload();
  await expect(editor(page)).toHaveValue("pitchup 90 fd 29");
  await expect(stage(page)).toHaveAttribute("data-segments", "0");
  await mode2D(page).click();
  await expect(editor(page)).toHaveValue("fd 43");
});

test("protects modified code when loading an example", async ({ page }) => {
  await page.goto("/");
  await editor(page).fill("fd 73");
  await page.goto("/examples");
  await page
    .locator("[data-slot=frame]")
    .filter({
      has: page.getByRole("heading", { name: "Kwadrat", exact: true }),
    })
    .getByRole("button", { name: "Otwórz w pracowni" })
    .click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "Anuluj", exact: true }).click();
  await expect(page).toHaveURL(/examples$/);
  await page
    .locator("[data-slot=frame]")
    .filter({
      has: page.getByRole("heading", { name: "Kwadrat", exact: true }),
    })
    .getByRole("button", { name: "Otwórz w pracowni" })
    .click();
  await page
    .getByRole("button", { name: "Wczytaj przykład", exact: true })
    .click();
  await complete(page);
  await expect(stage(page)).toHaveAttribute("data-segments", "4");
});

test("storage failures leave the editor usable and show unsaved state", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Denied", "SecurityError");
    };
  });
  await page.goto("/");
  await expect(page.getByText(/Nie udało się zapisać szkicu/)).toBeVisible();
  await editor(page).fill("fd 40");
  await complete(page);
  await expect(stage(page)).toHaveAttribute("data-segments", "1");
});

test("WebGL2 failure is explicit and 2D remains usable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      context: string,
      ...args: unknown[]
    ) {
      if (
        context === "webgl2" ||
        context === "webgl" ||
        context === "experimental-webgl"
      )
        return null;
      return Reflect.apply(original, this, [context, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await mode3D(page).click();
  await expect(page.getByRole("alert")).toContainText(
    "Tryb 3D jest niedostępny",
  );
  await mode2D(page).click();
  await editor(page).fill("fd 30");
  await complete(page);
  await expect(stage(page)).toHaveAttribute("data-segments", "1");
});

for (const width of [1440, 390]) {
  test(`responsive and keyboard use at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await editor(page).fill("np 60 pw 90 np 60");
    await editor(page).focus();
    await page.keyboard.press("Tab");
    await expect(editor(page)).not.toBeFocused();
    await run(page).focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("status").filter({ hasText: "Program zakończony" }),
    ).toBeVisible();
    const buttons = await page.locator(".execution-actions button").all();
    const boxes = await Promise.all(
      buttons.map((button) => button.boundingBox()),
    );
    for (let i = 1; i < boxes.length; i++) {
      const previous = boxes[i - 1],
        current = boxes[i];
      if (previous && current && Math.abs(previous.y - current.y) < 2)
        expect(current.x).toBeGreaterThanOrEqual(previous.x + previous.width);
    }
    if (width === 390)
      await page.screenshot({
        path: "output/playwright/studio-2d-mobile.png",
        fullPage: true,
      });
  });
}

test("editing and mode switching cancel playback", async ({ page }) => {
  await page.goto("/");
  await editor(page).fill("repeat 100 [fd 1]");
  await run(page).click();
  await expect
    .poll(async () => Number(await stage(page).getAttribute("data-segments")))
    .toBeGreaterThan(0);
  await editor(page).fill("fd 70");
  const segments = await stage(page).getAttribute("data-segments");
  await page.waitForTimeout(250);
  await expect(stage(page)).toHaveAttribute("data-segments", segments ?? "");
  await complete(page);
  await expect(stage(page)).toHaveAttribute("data-segments", "1");
  await editor(page).fill("repeat 100 [fd 1]");
  await run(page).click();
  await mode3D(page).click();
  await page.waitForTimeout(250);
  await expect(stage(page)).toHaveAttribute("data-segments", "0");
});

test("closing the page flushes a draft before the debounce delay", async ({
  page,
}) => {
  await page.goto("/");
  await editor(page).fill("fd 91");
  await page.reload();
  await expect(editor(page)).toHaveValue("fd 91");
  await expect(stage(page)).toHaveAttribute("data-segments", "0");
});

test("nested empty loops hit a bounded error and allow recovery", async ({
  page,
}) => {
  await page.goto("/");
  await editor(page).fill("repeat 10000 [repeat 10000 []]");
  await run(page).click();
  await expect(page.getByRole("alert")).toContainText("10 000 operacji");
  await editor(page).fill("fd 32");
  await complete(page);
  await expect(stage(page)).toHaveAttribute("data-segments", "1");
});
