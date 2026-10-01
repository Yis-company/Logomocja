import { expect, test } from "@playwright/test";
import packageJson from "../package.json" with { type: "json" };
const { version } = packageJson;
const editor = (page: import("@playwright/test").Page) =>
  page.getByRole("textbox", { name: "Kod programu Logo" });
test("real routes, history, legacy hash and package version", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText(`v${version}`, { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Przykłady", exact: true }).click();
  await expect(page).toHaveURL(/\/examples$/);
  await expect(
    page.getByRole("heading", { name: "Przykłady", exact: true }),
  ).toBeFocused();
  await expect(editor(page)).toHaveCount(0);
  await page.getByRole("link", { name: "Polecenia", exact: true }).click();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Przykłady", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Przykłady", exact: true }),
  ).toBeVisible();
  await page.goto("/#examples");
  await expect(page).toHaveURL(/\/examples$/);
  await page.goto("/missing");
  await expect(
    page.getByRole("heading", { name: "Nie znaleziono strony" }),
  ).toBeVisible();
});
test("navigation pauses runtime, source and output survive return", async ({
  page,
}) => {
  await page.goto("/");
  await editor(page).fill("repeat 1000 [fd 2]");
  await page.getByRole("button", { name: "Uruchom", exact: true }).click();
  await expect
    .poll(async () =>
      Number(await page.locator(".stage").getAttribute("data-segments")),
    )
    .toBeGreaterThan(0);
  await page.getByRole("link", { name: "Polecenia", exact: true }).click();
  await page.waitForTimeout(300);
  await page.getByRole("link", { name: "Pracownia", exact: true }).click();
  const count = await page.locator(".stage").getAttribute("data-segments");
  await expect(editor(page)).toHaveValue("repeat 1000 [fd 2]");
  await expect(
    page.getByRole("button", { name: "Wznów", exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(300);
  await expect(page.locator(".stage")).toHaveAttribute(
    "data-segments",
    count ?? "",
  );
});
test("example protects inactive destination draft", async ({ page }) => {
  await page.goto("/");
  await editor(page).fill("fd 73");
  await page.getByRole("tab", { name: /3D Przestrzeń/ }).click();
  await page.getByRole("link", { name: "Przykłady", exact: true }).click();
  const square = page.locator("[data-slot=frame]").filter({
    has: page.getByRole("heading", { name: "Kwadrat", exact: true }),
  });
  await square.getByRole("button", { name: "Otwórz w pracowni" }).click();
  await expect(page.getByRole("alertdialog")).toContainText("2D");
  await page.getByRole("button", { name: "Anuluj", exact: true }).click();
  await page.getByRole("link", { name: "Pracownia", exact: true }).click();
  await page.getByRole("tab", { name: /2D Płaszczyzna/ }).click();
  await expect(editor(page)).toHaveValue("fd 73");
});
test("themes follow system until manual choice, persist and preserve 2D view", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await editor(page).fill("fd 50");
  await page.getByRole("button", { name: "Uruchom", exact: true }).click();
  await expect(page.locator(".stage")).toHaveAttribute("data-segments", "1");
  await page.getByRole("button", { name: "Powiększ rysunek" }).click();
  await expect(page.locator(".view-controls")).toContainText("125%");
  await page.getByRole("button", { name: "Włącz ciemny motyw" }).click();
  await expect(page.locator(".view-controls")).toContainText("125%");
  await expect(page.locator(".stage")).toHaveAttribute("data-segments", "1");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(editor(page)).toHaveValue("fd 50");
  await expect(page.locator(".stage")).toHaveAttribute("data-segments", "0");
});
test("denied theme storage still permits a session choice", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("denied");
    };
    Storage.prototype.setItem = () => {
      throw new Error("denied");
    };
  });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: "Włącz ciemny motyw" }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveClass(/dark/);
});
test("mobile Sheet navigation and focus return", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Otwórz nawigację" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("link", { name: "Wyzwania", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Wyzwania", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("mode tabs use manual activation and theme changes retain running 3D canvas", async ({
  page,
}) => {
  await page.goto("/");
  await editor(page).fill("fd 77");
  await page.getByRole("tab", { name: /2D Płaszczyzna/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /3D Przestrzeń/ })).toBeFocused();
  await expect(editor(page)).toHaveValue("fd 77");
  await page.keyboard.press("Enter");
  await editor(page).fill("repeat 100 [gora 90 fd 1 dol 90]");
  await expect(page.locator(".three-host canvas")).toBeVisible();
  const canvas = await page.locator(".three-host canvas").elementHandle();
  await page.getByRole("button", { name: "Uruchom", exact: true }).click();
  await expect
    .poll(async () =>
      Number(await page.locator(".stage").getAttribute("data-segments")),
    )
    .toBeGreaterThan(0);
  await page
    .getByRole("button", { name: /Włącz (ciemny|jasny) motyw/ })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Żółw rysuje" }),
  ).toBeVisible();
  if (!canvas) throw Error("Missing canvas");
  expect(
    await canvas.evaluate(
      (element) => element === document.querySelector(".three-host canvas"),
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Pauza", exact: true }).click();
});

test("parameters and nested procedures execute in the studio", async ({
  page,
}) => {
  await page.goto("/");
  await editor(page).fill(
    "oto kwadrat :bok\n powtorz 4 [np :bok lw 90]\njuż\npowtorz 8 [kwadrat 90 lw 45]",
  );
  await page.getByRole("slider").focus();
  await page.keyboard.press("End");
  await page.getByRole("button", { name: "Uruchom", exact: true }).click();
  await expect(page.locator(".stage")).toHaveAttribute("data-segments", "32");
  await expect(
    page.getByRole("status").filter({ hasText: "Program zakończony" }),
  ).toBeVisible();
});
