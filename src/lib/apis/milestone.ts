import { database, ID, Query } from "../appwrite"
import { createActivity } from "./grants"

export const createMilestone = async (
    grant: string,
    title: string,
    dueDate: string,
    status: "Completed" | "Progress",
    priority: "High" | "Medium" | "Low",
    userId: string,
) => {
    const res = await database.createRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_MILESTONES_ID,
        ID.unique(),
        {
            grant,
            title,
            dueDate,
            status,
            priority,
        }
    )
    createActivity(grant, `Milestone created: ${title}`, "Milestone", res.$id, [userId])
    return res
}

export const getMilestones = async (grantId: string) => {
    const res = await database.listRows(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_MILESTONES_ID,
        [Query.equal("grant", grantId)]
    )
    return res.rows
}

export const updateMilestone = async (milestoneId: string, data: any) => {
    const res = await database.updateRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_MILESTONES_ID,
        milestoneId,
        data
    )
    return res
}
