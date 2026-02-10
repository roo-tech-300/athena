import { account, database, ID } from "../appwrite"

export const createAccount = async (title: string, firstName: string, lastName: string, email: string, password: string) => {
    try {
        const fullName = `${title} ${firstName} ${lastName}`
        const user = await account.create(
            ID.unique(),
            email,
            password,
            fullName
        )
        const dbUser = await database.createRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
            user.$id,
            {
                name: fullName,
                email,
                password,
                title
            }
        )

        await loginAccount(email, password)
        return dbUser
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const loginAccount = async (email: string, password: string) => {
    try {
        const session = await account.createEmailPasswordSession(
            email,
            password
        )
        return session
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const logoutAccount = async () => {
    try {
        await account.deleteSession('current')
    } catch (error) {
        console.log(error)
        throw error
    }
}