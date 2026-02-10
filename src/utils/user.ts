export function getUserInitials(user: { name?: string, title?: string } | null | undefined): string {
    if (!user?.name) return '?';

    // Split the full name by spaces
    const parts = user.name.split(' ').filter(p => p.trim() !== '');

    // The user says "ignore the first which is going to be title"
    // and "get the second and third then ignore everyother thing"

    if (parts.length >= 3) {
        // Case: "Dr. Eluzia Ameh Ako Oche" -> Ignore "Dr.", take "Eluzia" and "Ameh"
        return (parts[1].charAt(0) + parts[2].charAt(0)).toUpperCase();
    } else if (parts.length === 2) {
        // Case: "Mr. Einstein" -> Ignore "Mr.", take "Einstein" (first two letters)
        return parts[1].substring(0, 2).toUpperCase();
    } else if (parts.length === 1) {
        // Edge case: No title, just one name
        return parts[0].substring(0, 2).toUpperCase();
    }

    return user.name.substring(0, 2).toUpperCase();
}
