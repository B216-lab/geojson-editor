/**
 * Форматировать площадь в удобочитаемый вид
 */
export const areaFormatter = (value?: number | null): string | null => {
    if (!value && value !== 0) return null
    if (value > 10000) {
        return (value / 1000000).toFixed(2) + ' sq. km'
    } else {
        return value.toFixed(2) + ' sq. m'
    }
}

/**
 * Форматировать дистанцию в удобочитаемый вид
 */
export const distanceFormatter = (value?: number | null): string | null => {
    if (!value && value !== 0) return null
    if (value < 1) {
        return (value * 1000).toFixed(2) + ' m'
    } else {
        return value.toFixed(2) + ' Km'
    }
}


