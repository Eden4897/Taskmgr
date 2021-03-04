export function levelToXp(level: number): number {
  return 5 * Math.pow(level, 2) + 50 * level + 100;
}

export function xpToLevel(xp: number): number {
  let i = 0;
  while (true) {
    if (levelToXp(i) > xp) {
      return i;
    } else i++;
  }
}
