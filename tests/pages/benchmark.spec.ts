import { existsSync, readdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

const fable = "v2-e5-claude-claude-fable-5-2-20261110-215004Z";
const neon = "gemini-4-medium/neon-base";
const hydrogen = "gemini-4-medium/hydrogen-base";

test("hosted homepage combines attempts and keeps explorer state in the URL", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page).toHaveURL(/#\/benchmark$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const table = page.getByRole("table", { name: "Benchmark attempts" });
  await expect(table).toContainText("gemini-4-neon");
  await expect(table).toContainText("claude-fable-5-2");
  await expect(page.getByRole("status")).toContainText(/1–25 of \d+ attempts/);
  await expect(
    page.getByRole("button", { name: "Interpreter conformance" }),
  ).toBeDisabled();
  await expect(page.getByRole("img", { name: /^Reference/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByRole("status")).toContainText(/26–50 of \d+ attempts/);

  await page
    .getByRole("combobox", { name: "Source" })
    .selectOption("antigravity");
  await expect(page.getByRole("status")).toHaveText("1–7 of 7 attempts");
  await page.getByRole("button", { name: "Interpreter conformance" }).click();
  await expect(table.getByRole("row").nth(1)).toContainText("618/618");
  await expect(table.getByRole("row").last()).toContainText("Setup blocked");
  await page.getByRole("searchbox").fill("hydrogen");
  await page.getByRole("button", { name: "Polski" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  await expect(page.getByRole("combobox", { name: "Źródło" })).toHaveValue(
    "antigravity",
  );
  await expect(page.getByRole("searchbox")).toHaveValue("hydrogen");
  await expect(page.getByRole("status")).toHaveText("1–3 z 3 prób");
  await expect(
    page.getByRole("columnheader", { name: "Zgodność interpretera" }),
  ).toHaveAttribute("aria-sort", "descending");
  await page.getByRole("button", { name: "Wyczyść filtry" }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
});

test("compares two compatible runs and rejects a mixed-protocol share link", async ({
  page,
}) => {
  await page.goto("./#/benchmark");
  await page.getByRole("checkbox", { name: `Compare run ${neon}` }).check();
  await expect(
    page.getByRole("checkbox", { name: `Compare run ${fable}` }),
  ).toBeDisabled();
  await page.getByRole("checkbox", { name: `Compare run ${hydrogen}` }).check();
  await page.reload();
  const comparison = page.getByRole("region", { name: "Compare runs" });
  await expect(comparison).toContainText("618/618");
  await expect(comparison).toContainText("601/618");
  await expect(comparison).toContainText("Unavailable");
  await expect(comparison).toContainText("CLI versions differed");

  const invalid = new URLSearchParams([
    ["compare", neon],
    ["compare", fable],
  ]);
  await page.goto(`./#/benchmark?${invalid}`);
  await expect(comparison).toContainText(
    "The selected runs need the same protocol",
  );
  await expect(comparison.getByRole("table")).toHaveCount(0);
});

test("mobile results fit and deep-linked screenshots support original size", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#/benchmark?lang=pl");
  const table = page.getByRole("table", { name: "Próby benchmarku" });
  await expect(table).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Sortuj według" }),
  ).toBeVisible();
  await expect(page.getByRole("row").first()).toContainText(
    "Wynik interpretera",
  );
  expect(await table.evaluate((element) => element.scrollWidth)).toBeLessThan(
    390,
  );
  await expect(
    table.getByRole("link", { name: "Wypróbuj aplikację" }).first(),
  ).toBeInViewport({ ratio: 1 });

  await page.goto(`./#/benchmark?lang=pl&run=${fable}`);
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  const details = page.getByRole("region", { name: "claude-fable-5-2" });
  await expect(details.getByRole("heading", { level: 2 })).toBeFocused();
  await expect(
    details.getByRole("link", { name: "Wypróbuj aplikację" }),
  ).toHaveAttribute("href", `/Logomocja/builds/${fable}/`);

  const generated = details.getByRole("img", {
    name: /^Wygenerowana aplikacja/,
  });
  const reference = details.getByRole("img", { name: /^Wzorzec/ });
  await expect(generated).toBeVisible();
  await expect(reference).toBeHidden();
  await details.getByRole("button", { name: "Wzorzec", exact: true }).click();
  await expect(reference).toBeVisible();
  await expect(generated).toBeHidden();

  await details
    .getByRole("combobox", { name: "Rozmiar zrzutu" })
    .selectOption("mobile");
  await expect(reference).toHaveAccessibleName(/Telefon/);
  const original = details.getByRole("link", { name: /^Otwórz oryginał/ });
  const originalUrl = await original.getAttribute("href");
  expect(originalUrl).toBeTruthy();
  const capture = await request.get(originalUrl ?? "");
  expect(capture.ok()).toBe(true);
  expect(capture.headers()["content-type"]).toMatch(/^image\/(webp|png)$/);

  const enlarge = details.getByRole("button", { name: /^Powiększ/ });
  await enlarge.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Rozmiar oryginalny" }).click();
  await expect
    .poll(() =>
      dialog
        .getByRole("img")
        .evaluate((image: HTMLImageElement) => [
          image.complete,
          image.naturalWidth,
          image.clientWidth,
        ]),
    )
    .toEqual([true, 390, 390]);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(enlarge).toBeFocused();
  await page.getByRole("button", { name: "Włącz ciemny motyw" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page
    .getByRole("link", { name: "Pracownia wzorcowa", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/studio$/);
  await expect(
    page.getByRole("textbox", { name: "Kod programu Logo" }),
  ).toBeVisible();
});

test("desktop evidence requests only the selected pair and restores focus", async ({
  page,
}) => {
  const images: string[] = [];
  page.on("request", (request) => {
    if (/\.(png|webp)$/.test(request.url())) images.push(request.url());
  });
  await page.goto("./#/benchmark");
  const evidence = page.getByRole("button", {
    name: new RegExp(`View evidence:.*${neon}`),
  });
  await expect(evidence).toBeVisible();
  expect(images).toHaveLength(0);
  await evidence.click();
  const gallery = page.getByRole("region", {
    name: "Standard program screenshots",
  });
  await expect(
    gallery.getByRole("img", { name: /^Reference · Tree · Desktop/ }),
  ).toBeVisible();
  await expect(
    gallery.getByRole("img", { name: /^Generated app · Tree · Desktop/ }),
  ).toBeVisible();
  await expect.poll(() => images.length).toBe(2);
  await gallery
    .getByRole("combobox", { name: "Program" })
    .selectOption("kwadrat");
  await expect(
    gallery.getByRole("img", { name: /^Generated app · Square · Desktop/ }),
  ).toBeVisible();
  await expect.poll(() => images.length).toBe(4);
  await page.getByRole("button", { name: "Close details" }).click();
  await expect(evidence).toBeFocused();
});

test("every published build link resolves with its entry assets", async ({
  page,
  request,
}) => {
  await page.goto("./#/benchmark");
  const hrefs = new Set<string>();
  const next = page.getByRole("button", { name: "Next page" });
  const table = page.getByRole("table", { name: "Benchmark attempts" });
  await expect(table).toBeVisible();
  for (;;) {
    const links = await table
      .getByRole("link", { name: "Try app" })
      .evaluateAll((items) =>
        items.map((link) => (link as HTMLAnchorElement).href),
      );
    for (const href of links) hrefs.add(href);
    if (await next.isDisabled()) break;
    const previous = page.url();
    await next.click();
    await expect(page).not.toHaveURL(previous);
  }
  const buildIds = readdirSync("dist/builds").filter((id) =>
    existsSync(`dist/builds/${id}/index.html`),
  );
  expect([...hrefs].map((href) => new URL(href).pathname).sort()).toEqual(
    buildIds.map((id) => `/Logomocja/builds/${id}/`).sort(),
  );
  for (const href of hrefs) {
    const entry = await request.get(href);
    expect(entry.ok(), href).toBe(true);
    const html = await entry.text();
    const assets = html.matchAll(
      /(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g,
    );
    for (const [, asset] of assets) {
      const url = new URL(asset, href);
      if (url.origin === new URL(href).origin) {
        const response = await request.get(url.href);
        expect(response.ok(), url.href).toBe(true);
      }
    }
  }
});

for (const [run, build] of [
  [neon, "gemini-4-medium-neon-base"],
  ["gemini-4-medium/neon-impeccable", "gemini-4-medium-neon-impeccable"],
  [hydrogen, "gemini-4-medium-hydrogen-base"],
  [
    "gemini-4-medium/hydrogen-impeccable",
    "gemini-4-medium-hydrogen-impeccable",
  ],
  [fable, fable],
]) {
  test(`Try app opens ${build} and executes a drawing`, async ({ page }) => {
    await page.goto("./#/benchmark");
    await page.getByRole("searchbox").fill(run);
    const row = page.getByRole("row").filter({
      has: page.getByRole("checkbox", {
        name: `Compare run ${run}`,
        exact: true,
      }),
    });
    const launch = row.getByRole("link", { name: "Try app" });
    await expect(launch).toHaveAttribute("href", `/Logomocja/builds/${build}/`);
    const [app] = await Promise.all([
      page.waitForEvent("popup"),
      launch.click(),
    ]);
    await expect(app).toHaveURL(`/Logomocja/builds/${build}/`);
    await expect(
      app.getByRole("button", { name: /uruchom/i }).first(),
    ).toBeVisible();
    await app.waitForFunction(
      () => typeof window.logomocja?.open === "function",
    );
    const result = await app.evaluate(() =>
      window.logomocja?.open("np 30", "2d"),
    );
    expect(result?.segments).toHaveLength(1);
    expect(result?.error).toBeNull();
    await expect(page).toHaveURL(/#\/benchmark\?q=/);
    await app.close();
  });
}

test("run details show the lint score or why it is missing", async ({
  page,
}) => {
  await page.goto(`./#/benchmark?run=${fable}`);
  const scored = page.getByRole("region", { name: "claude-fable-5-2" });
  await expect(
    scored.getByText(/^\d+ \(complexity \d+, defects \d+\)$/),
  ).toBeVisible();

  await page.goto(
    "./#/benchmark?run=v2-e2-tdd-v1-codex-gpt-6.1-sol-20261103-153405Z",
  );
  const missing = page.getByRole("region", { name: "gpt-6.1-sol" });
  await expect(missing.getByText("No source code")).toBeVisible();
});
