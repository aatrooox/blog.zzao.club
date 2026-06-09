/**
export function formatNumberForView(num: number): string {
  if (num < 1000) {
    return String(num)
  }

  const thousands = Math.floor(num / 1000)
  return `${thousands}k${num % 1000 !== 0 ? '+' : ''}`
}
