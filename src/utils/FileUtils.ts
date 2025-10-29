/**
 * Читать файл как текст
 */
export const fileReader = (file: File): Promise<string> => {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result || ''))
        reader.onerror = reject
        reader.readAsText(file)
    })
}


