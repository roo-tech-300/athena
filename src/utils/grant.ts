export function generateGrantCode(name: string): string {
  // Remove non-letters and trim
  const cleanedName = name
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase();

  // Take first 3 letters (fallback if name is short)
  const letters = cleanedName.slice(0, 3).padEnd(3, "X");

  // Generate random 3-digit number
  const randomNumber = Math.floor(100 + Math.random() * 900);

  return `GRT-${letters}-${randomNumber}`;
}

export function formatMoneyCompact(
  value: number,
  decimals: number = 1
): string {
  if (value < 100_000) {
    return value.toLocaleString(); // 99,999 stays normal
  }

  const units = [
    { value: 1_000_000_000_000, symbol: "T" }, // optional future-proofing
    { value: 1_000_000_000, symbol: "B" },
    { value: 1_000_000, symbol: "M" },
    { value: 1_000, symbol: "K" },
  ];

  for (const unit of units) {
    if (value >= unit.value) {
      const formatted = value / unit.value;

      return (
        parseFloat(formatted.toFixed(decimals)) // removes trailing .0
          .toString() + unit.symbol
      );
    }
  }

  return value.toString();
}
