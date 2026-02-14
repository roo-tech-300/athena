import { database, ID, Query } from "../appwrite"

export const createDocument = async (
    doc: string, // ID from google doc api
    grant: string,
    title: string,
    action: "Deliverable" | "Milestone",
    actionItem: string,
    creator: string,
    type: string
) => {
    try {
        const res = await database.createRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DOCUMENT_ID,
            ID.unique(),
            {
                doc,
                title,
                grant,
                action,
                actionItem,
                status: "Pending",
                creator,
                type
            }
        )
        return res
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const updateDocument = async (docId: string, data: any) => {
    try {
        const res = await database.updateRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DOCUMENT_ID,
            docId,
            data
        )
        return res
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getDocuments = async (grantId: string) => {
    try {
        const res = await database.listRows(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DOCUMENT_ID,
            [Query.equal("grant", grantId)]
        )
        return res.rows
    } catch (error) {
        console.error(error)
        throw error
    }
}