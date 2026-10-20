const SCALE = 1_000_000n

/** Decimal strings at boundaries; bigint during USDC arithmetic. */
export function toUnits(value: string): bigint {
  if (!/^\d{1,12}(\.\d{1,6})?$/.test(value)) throw new Error('invalidAmount')
  const [integer, fraction = ''] = value.split('.')
  return BigInt(integer) * SCALE + BigInt(fraction.padEnd(6, '0'))
}
export function fromUnits(units: bigint): string {
  return `${units / SCALE}.${(units % SCALE).toString().padStart(6, '0')}`
}
export function sumAmounts(values: string[]): string {
  return fromUnits(values.reduce((total, value) => total + toUnits(value), 0n))
}
export function formatMoney(value: string, locale = 'en-US'): string {
  const units = toUnits(value)
  const decimal = (units % SCALE).toString().padStart(6, '0').replace(/0+$/, '').padEnd(2, '0')
  return `${new Intl.NumberFormat(locale).format(units / SCALE)}.${decimal}`
}
