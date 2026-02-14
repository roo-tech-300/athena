import { database, ID, Query, storage } from "../appwrite"
import { createActivity } from "./grants"

export const createBudgetItem = async (
    grantId: string,
    description: string,
    category: string,
    status: string,
    price: number,
) => {
    const res = await database.createRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_BUDGET_ITEMS_ID,
        ID.unique(),
        {
            grant: grantId,
            description,
            category,
            status,
            price,
        }
    )
    createActivity(grantId, "Project Budget has been updated", "Budget", res.$id)
    return res
}

export const getBudgetItems = async (grantId: string) => {
    const res = await database.listRows(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_BUDGET_ITEMS_ID,
        [Query.equal("grant", grantId)]
    )
    return res.rows
}

export const getBudgetItem = async (budgetItemId: string) => {
    const res = await database.getRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_BUDGET_ITEMS_ID,
        budgetItemId
    )
    return res
}

export const updateBudgetItem = async (budgetItemId: string, data: any) => {
    const res = await database.updateRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_BUDGET_ITEMS_ID,
        budgetItemId,
        data
    )
    return res
}

export const createTransactions = async (
    item: string,
    amount: number,
    grantId: string,
    description: string,
    file?: File,
) => {
    try {
        let proofId = null;

        if (file) {
            const proof = await storage.createFile(
                import.meta.env.VITE_APPWRITE_STORAGE_ID,
                ID.unique(),
                file,
            );
            proofId = proof.$id;
        }

        const res = await database.createRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_TRANSACTIONS_ID,
            ID.unique(),
            {
                budgetItem: item,
                amount,
                grant: grantId,
                description,
                ...(proofId && { proof: proofId })
            }
        )
        return res
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getTransactions = async (grantId: string) => {
    const res = await database.listRows(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_TRANSACTIONS_ID,
        [
            Query.equal("grant", grantId),
            Query.orderDesc("$createdAt")
        ]
    )

    const transactionsWithBudget = await Promise.all(
        res.rows.map(async (transaction) => {
            const budgetItem = await getBudgetItem(transaction.budgetItem)
            let fileUrl = null;

            // Ensure we handle proof as either string ID or object
            const proofId = typeof transaction.proof === 'object' ? (transaction as any).proof?.$id : transaction.proof;

            if (proofId) {
                fileUrl = storage.getFileView(
                    import.meta.env.VITE_APPWRITE_STORAGE_ID,
                    proofId
                ).toString();
            }

            return {
                ...transaction,
                budgetItem,
                fileUrl
            }
        })
    )
    return transactionsWithBudget
}