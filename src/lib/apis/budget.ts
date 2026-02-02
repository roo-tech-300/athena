import { database, ID, Query } from "../appwrite"
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
) => {
    const res = await database.createRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_TRANSACTIONS_ID,
        ID.unique(),
        {
            budgetItem: item,
            amount,
            grant: grantId,
        }
    )
    return res
}

export const getTransactions = async (grantId: string) => {
    const res = await database.listRows(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_TRANSACTIONS_ID,
        [Query.equal("grant", grantId)]
    )

    const transactionsWithBudget = await Promise.all(
        res.rows.map(async (transaction) => {
            const budgetItem = await getBudgetItem(transaction.budgetItem)

            return {
                ...transaction,
                budgetItem, // now full object, not just ID
            }
        })
    )
    return transactionsWithBudget
}