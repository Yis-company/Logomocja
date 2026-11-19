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

test("legacy run links open evidence, screenshots load on demand, and Polish mobile layout fits", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#/benchmark?lang=pl");
  const results = page.getByRole("region", { name: "Próby benchmarku" });
  await results.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => results.evaluate((region) => region.scrollLeft)).toBeGreaterThan(0);
  await page.goto(`./#/benchmark?lang=pl&run=${fable}`);
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  await expect(
    page.getByRole("heading", { name: "Szczegóły próby" }),
  ).toBeFocused();
  await expect(page.getByRole("img", { name: /^Wzorzec/ })).toHaveCount(0);
  const build = await page
    .getByRole("link", { name: "Otwórz aplikację" })
    .getAttribute("href");
  expect(build).toContain(`/builds/${fable}/`);
  expect((await request.get(build ?? "")).ok()).toBe(true);
  await page.getByRole("button", { name: "Wczytaj zrzuty ekranu" }).click();
  const reference = page.getByRole("img", { name: /^Wzorzec/ }).first();
  await reference.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      reference.evaluate(
        (image) =>
          image instanceof HTMLImageElement &&
          image.complete &&
          image.naturalWidth > 0,
      ),
    )
    .toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page
    .getByRole("link", { name: "Otwórz pracownię", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/studio$/);
  await expect(
    page.getByRole("textbox", { name: "Kod programu Logo" }),
  ).toBeVisible();
});
