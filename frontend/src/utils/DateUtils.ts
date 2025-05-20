export const formatDate = (date: string | Date) => {
    if (typeof date === 'string') {
        date = new Date(date)
    }
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const dayOfWeek = daysOfWeek[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const ordinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th'
        switch (day % 10) {
            case 1: return 'st'
            case 2: return 'nd'
            case 3: return 'rd'
            default: return 'th'
        }
    };

    const formattedDay = `${day}${ordinalSuffix(day)}`
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${dayOfWeek}, ${formattedDay} of ${month} at ${hours}:${minutes}`
}