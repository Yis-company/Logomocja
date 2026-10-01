import { expect, test } from "@playwright/test";
import packageJson from "../../package.json" with { type: "json" };
const { version } = packageJson;
const editor = (page: import("@playwright/test").Page) =>
  page.getByRole("textbox", { name: "Kod programu Logo" });
test("static Pages assets, navigation, history, refresh and legacy links", async ({
  page,
  request,
}) => {
  expect((await request.get("favicon.svg")).status()).toBe(200);
  expect((await request.get("challenges")).status()).toBe(404);
  await page.goto("./");
  await expect(page.getByText(`v${version}`, { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Przykłady", exact: true }).click();
  await expect(page).toHaveURL(/\/Logomocja\/#\/examples$/);
  await page.getByRole("link", { name: "Wyzwania", exact: true }).click();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Przykłady", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Przykłady", exact: true }),
  ).toBeVisible();
  await page.goto("./#examples");
  await expect(page).toHaveURL(/#\/examples$/);
  await page.goto("./#/missing");
  await expect(
    page.getByRole("heading", { name: "Nie znaleziono strony" }),
  ).toBeVisible();
});
test("production 2D procedures, stepping, persistence and dark theme", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await editor(page).fill(
    "oto kwadrat :bok\npowtorz 4 [np :bok pw 90]\njuż\nkwadrat 60",
  );
  await page.getByRole("button", { name: "Krok", exact: true }).click();
  await expect(page.locator(".stage")).toHaveAttribute("data-segments", "1");
  await page.getByRole("slider").focus();
  await page.keyboard.press("End");
  await page.getByRole("button", { name: "Wznów", exact: true }).click();
  await expect(page.locator(".stage")).toHaveAttribute("data-segments", "4");
  await page.getByRole("button", { name: "Włącz ciemny motyw" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(editor(page)).toContainText("kwadrat 60");
  expect(errors).toEqual([]);
});
test("production lazy WebGL, spatial drawing and deep-linked challenge", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await page.getByRole("tab", { name: /3D Przestrzeń/ }).click();
  await expect(page.locator(".three-host canvas")).toBeVisible();
  await editor(page).fill("gora 90 np 40");
  await page.getByRole("button", { name: "Uruchom", exact: true }).click();
  await expect(page.locator(".stage")).toHaveAttribute("data-z", "40");
  await page.getByRole("button", { name: "Z góry", exact: true }).click();
  await page.goto("./#/challenges/kwadrat");
  await page.reload();
  await editor(page).fill("oto kwadrat :bok\npowtorz 4 [np :bok pw 90]\njuż");
  await page.getByRole("button", { name: "Sprawdź rozwiązanie" }).click();
  await expect(page.getByText("6/6 przypadków poprawnych")).toBeVisible();
  expect(errors).toEqual([]);
});
