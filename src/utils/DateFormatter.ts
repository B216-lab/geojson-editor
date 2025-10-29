const units = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'] as const
type Unit = typeof units[number]

/**
 * Возвращать человеко-понятную разницу времени от текущего момента
 */
export const timeAgo = (isoDate: string): string => {
    const now = Date.now()
    const time = Date.parse(isoDate)
    const diffMs = time - now

    const thresholds: Record<Unit, number> = {
        year: 1000 * 60 * 60 * 24 * 365,
        month: 1000 * 60 * 60 * 24 * 30,
        week: 1000 * 60 * 60 * 24 * 7,
        day: 1000 * 60 * 60 * 24,
        hour: 1000 * 60 * 60,
        minute: 1000 * 60,
        second: 1000,
    }

    let unit: Unit = 'second'
    for (const u of units) {
        if (Math.trunc(diffMs / thresholds[u]) !== 0) {
            unit = u
            break
        }
    }

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    const value = Math.trunc(diffMs / thresholds[unit])
    return rtf.format(value, unit)
}


