/** Returns the Logo source in a model response, or null when there is none. */
export function extractCode(response: string): string | null {
  const fences = [...response.matchAll(/```([^\n`]*)\n([\s\S]*?)```/g)];
  if (fences.length) {
    const logo = fences.filter((m) => m[1].trim().toLowerCase() === "logo");
    const chosen = (logo.length ? logo : fences).at(-1);
    return chosen ? chosen[2].trim() : null;
  }
  const bare = response.trim();
  return /^(oto|to)\s/i.test(bare) ? bare : null;
}
