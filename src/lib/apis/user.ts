import { account, database } from "../appwrite"

export const getUser = async () => {
    try {
        const user = await account.get()
        return user
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = await database.getRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
            id
        )
        return user
    } catch (error) {
        console.error(error)
        throw error
    }
}