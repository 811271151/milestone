import { fromUnits, toUnits } from '../../domain/money'

/** An incomplete or invalid input must never be presented as a balanced zero budget. */
export function draftBudget(total: string, amounts: string[]) {
  let allocated = 0n
  let complete = true
  try {
    for (const amount of amounts) {
      if (!amount) {
        complete = false
        continue
      }
      const units = toUnits(amount)
      if (units <= 0n) complete = false
      allocated += units
    }
  } catch {
    return { status: 'invalid', allocated: null, difference: null } as const
  }
  try {
    if (!total)
      return { status: 'incomplete', allocated: fromUnits(allocated), difference: null } as const
    const units = toUnits(total)
    if (units <= 0n)
      return { status: 'invalid', allocated: fromUnits(allocated), difference: null } as const
    const difference = units - allocated
    const status =
      difference < 0n ? 'over' : difference > 0n ? 'under' : complete ? 'balanced' : 'incomplete'
    return {
      status,
      allocated: fromUnits(allocated),
      difference: fromUnits(difference < 0n ? -difference : difference),
    }
  } catch {
    return { status: 'invalid', allocated: fromUnits(allocated), difference: null } as const
  }
}
