export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN')
}

export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}
