import { expect, test } from "@playwright/test";

const editor = (page: import("@playwright/test").Page) =>
  page.getByRole("textbox", { name: "Kod programu Logo" });

test("fresh challenge starters use Polish comma-separated signatures", async ({ page }) => {
  for (const [id, params] of [
    ["kwadrat", "bok"],
    ["gwiazda", "bok"],
    ["schody", "n, bok"],
    ["rzad", "n, bok"],
    ["rozeta", "bok"],
    ["schody3d", "n, dlugosc, wysokosc"],
  ]) {
    await page.goto(`/challenges/${id}`);
    await expect(editor(page)).toHaveValue(`; Napisz procedurę ${id}.\noto ${id} ma: ${params}\n  ; Twój kod tutaj\njuż`);
  }
});

test("catalog filters by mode, difficulty and completion", async ({ page }) => {
  await page.goto("/challenges");
  await expect(page.locator(".challenge-grid [data-slot=frame]")).toHaveCount(
    6,
  );
  await page.getByRole("combobox", { name: "Filtr trybu" }).selectOption("3d");
  await expect(page.locator(".challenge-grid [data-slot=frame]")).toHaveCount(
    1,
  );
  await expect(page.getByRole("heading", { name: "Schody 3D" })).toBeVisible();
  await page
    .getByRole("combobox", { name: "Filtr poziomu" })
    .selectOption("Łatwe");
  await expect(
    page.getByText("Brak wyzwań dla wybranych filtrów."),
  ).toBeVisible();
  await page.getByRole("combobox", { name: "Filtr trybu" }).selectOption("all");
  await expect(page.locator(".challenge-grid [data-slot=frame]")).toHaveCount(
    3,
  );
});

test("solve, preserve historical completion and isolate drafts", async ({
  page,
}) => {
  await page.goto("/");
  await editor(page).fill("fd 73");
  await page.goto("/challenges/kwadrat");
  const solution = "oto kwadrat ma: dlugosc\npowtorz 4 [np dlugosc pw 90]\njuż";
  await editor(page).fill(solution);
  await page.getByRole("button", { name: "Sprawdź rozwiązanie" }).click();
  await expect(page.getByText("6/6 przypadków poprawnych")).toBeVisible();
  await expect(page.getByText("Ukończono wcześniej")).toBeVisible();
  await page.reload();
  await expect(editor(page)).toHaveValue(solution);
  await expect(page.getByText("Ukończono wcześniej")).toBeVisible();
  const legacyDraft = "; zachowaj szkic\nOTO kwadrat :Bok\n  np :bok  ; starsza składnia\njuż\n";
  await editor(page).fill(legacyDraft);
  await expect(
    page.getByRole("heading", { name: "Wyniki sprawdzania" }),
  ).toHaveCount(0);
  await expect(page.getByText("Ukończono wcześniej")).toBeVisible();
  await page.getByRole("link", { name: "Wszystkie wyzwania" }).click();
  await page
    .getByRole("combobox", { name: "Filtr postępu" })
    .selectOption("completed");
  await expect(page.locator(".challenge-grid [data-slot=frame]")).toHaveCount(
    1,
  );
  await page
    .getByRole("combobox", { name: "Filtr postępu" })
    .selectOption("all");
  await page
    .locator("[data-slot=frame]")
    .filter({
      has: page.getByRole("heading", { name: "Gwiazda", exact: true }),
    })
    .getByRole("link", { name: "Otwórz wyzwanie" })
    .click();
  await expect(editor(page)).toContainText("oto gwiazda ma: bok");
  await page.reload();
  await expect(editor(page)).toContainText("oto gwiazda ma: bok");
  await page.goto("/challenges/kwadrat");
  await expect(editor(page)).toHaveValue(legacyDraft);
  await page.reload();
  await expect(editor(page)).toHaveValue(legacyDraft);
  await page.goto("/");
  await expect(editor(page)).toHaveValue("fd 73");
});

test("run selected sample, protect reset and keep mobile theme usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/challenges/kwadrat");
  await expect(page.locator(".challenge-art")).toBeVisible();
  await expect(page.locator(".expected-preview h2")).toHaveText(
    "Oczekiwany rysunek · bok=60",
  );
  await page
    .getByRole("combobox", { name: "Wybierz przykład" })
    .selectOption("1");
  await expect(page.locator(".expected-preview h2")).toHaveText(
    "Oczekiwany rysunek · bok=10",
  );
  await editor(page).fill("oto kwadrat :bok\npowtorz 4 [np :bok pw 90]\njuż");
  await page.getByRole("button", { name: "Uruchom przykład" }).click();
  await expect(page.locator(".stage").first()).toHaveAttribute(
    "data-segments",
    "4",
  );
  await expect(page.getByText("1/1 przypadków poprawnych")).toBeVisible();
  await page.getByRole("button", { name: "Resetuj kod" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "Anuluj", exact: true }).click();
  await expect(editor(page)).toContainText("powtorz 4");
  await page.getByRole("button", { name: "Otwórz nawigację" }).click();
  await page.getByRole("button", { name: "Włącz ciemny motyw" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("3D stairs solve at mobile size in dark theme with renamed parameters", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/challenges/schody3d");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.locator(".challenge-art")).toBeVisible();
  await editor(page).fill(
    "oto schody3d :ile :droga :wzrost\npowtorz :ile [np :droga gora 90 np :wzrost dol 90]\njuż",
  );
  await page.getByRole("button", { name: "Sprawdź rozwiązanie" }).click();
  await expect(page.getByText("6/6 przypadków poprawnych")).toBeVisible();
  await expect(page.locator(".stage").first()).toHaveAttribute(
    "data-segments",
    "8",
  );
  await expect(page.locator(".challenge-art")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("editing or leaving a task cancels an active multi-case check", async ({
  page,
}) => {
  await page.goto("/challenges/kwadrat");
  const slowSolution =
    "oto kwadrat :bok\npowtorz 4500 [pw 0]\npowtorz 4 [np :bok pw 90]\njuż";
  await editor(page).fill(slowSolution);
  await page.getByRole("button", { name: "Sprawdź rozwiązanie" }).click();
  await expect(
    page.getByRole("button", { name: "Anuluj sprawdzanie" }),
  ).toBeVisible();
  await editor(page).fill("oto kwadrat :bok\nnp :bok\njuż");
  await page.waitForTimeout(300);
  await expect(
    page.getByRole("heading", { name: "Wyniki sprawdzania" }),
  ).toHaveCount(0);
  await expect(page.getByText("Ukończono wcześniej")).toHaveCount(0);
  await editor(page).fill(slowSolution);
  await page.getByRole("button", { name: "Sprawdź rozwiązanie" }).click();
  await expect(
    page.getByRole("button", { name: "Anuluj sprawdzanie" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Wszystkie wyzwania" }).click();
  await page
    .locator("[data-slot=frame]")
    .filter({
      has: page.getByRole("heading", { name: "Gwiazda", exact: true }),
    })
    .getByRole("link", { name: "Otwórz wyzwanie" })
    .click();
  await page.waitForTimeout(300);
  await expect(
    page.getByRole("heading", { name: "Wyniki sprawdzania" }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Wszystkie wyzwania" }).click();
  await page
    .locator("[data-slot=frame]")
    .filter({
      has: page.getByRole("heading", { name: "Kwadrat", exact: true }),
    })
    .getByRole("link", { name: "Otwórz wyzwanie" })
    .click();
  await expect(page.getByText("Ukończono wcześniej")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Wyniki sprawdzania" }),
  ).toHaveCount(0);
});

test("denied challenge storage leaves editing and sample run usable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw Error("denied");
    };
    Storage.prototype.setItem = () => {
      throw Error("denied");
    };
  });
  await page.goto("/challenges/kwadrat");
  await editor(page).fill("oto kwadrat :bok\npowtorz 4 [np :bok pw 90]\njuż");
  await expect(page.getByText("Nie udało się zapisać wyzwania")).toBeVisible();
  await page.getByRole("button", { name: "Uruchom przykład" }).click();
  await expect(page.getByText("1/1 przypadków poprawnych")).toBeVisible();
  await expect(page.locator(".stage").first()).toHaveAttribute(
    "data-segments",
    "4",
  );
});
