import { database, ID, Query } from "../appwrite"
import { getGrantMembers } from "./grants"

export const createDeliverables = async (
    grant: string,
    title: string,
    dueDate: string,
    status?: "Completed" | "Progress",
) => {
    console.log("Form Data", { grant, title, dueDate, status })
    const res = await database.createRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DELIVERABLES_ID,
        ID.unique(),
        {
            grant,
            title,
            dueDate,
            status,
        }
    )
    return res
}

export const getDeliverables = async (grantId: string) => {
    const res = await database.listRows(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DELIVERABLES_ID,
        [Query.equal("grant", grantId)]
    )

    const deliverables = res.rows

    const deliverablesWithTasks = await Promise.all(deliverables.map(async (deliverable: any) => {
        const tasks = await getDeliverableTasks(deliverable.$id)
        return {
            ...deliverable,
            tasks
        }
    }))
    return deliverablesWithTasks
}

export const createDeliverableTasks = async (
    deliverable: string,
    title: string,
    dueDate: string,
    status: "Completed" | "Progress" | "PendingApproval",
    assignedMembers: string[],
    description?: string,
    action?: "Transaction" | "Other",
    actionItem?: string,
) => {
    const res = await database.createRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DELIVERABLE_TASKS_ID,
        ID.unique(),
        {
            deliverable,
            title,
            description,
            status,
            dueDate,
            assignedMembers,
            action,
            actionItem,
        }
    )
    return res
}

export const updateDeliverableTask = async (
    taskId: string,
    data: {
        status?: "Completed" | "Progress" | "PendingApproval",
        actionItem?: string,
    }
) => {
    const res = await database.updateRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DELIVERABLE_TASKS_ID,
        taskId,
        data
    )
    return res
}

export const updateDeliverable = async (
    deliverableId: string,
    data: {
        status?: "Completed" | "Progress",
    }
) => {
    const res = await database.updateRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DELIVERABLES_ID,
        deliverableId,
        data
    )
    return res
}

export const getDeliverableTasks = async (deliverableId: string) => {
    // 1. Get the tasks
    const tasksRes = await database.listRows(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DELIVERABLE_TASKS_ID,
        [Query.equal("deliverable", deliverableId)]
    )
    const tasks = tasksRes.rows

    if (tasks.length === 0) return []

    // 2. Get the deliverable to find the grant ID
    const deliverable = await database.getRow(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DELIVERABLES_ID,
        deliverableId
    )

    // 3. Get all grant members for this grant (populated with users)
    const grantMembers = await getGrantMembers(deliverable.grant)

    // 4. Map the assignedMembers (IDs) to the full member objects
    const populatedTasks = tasks.map((task: any) => {
        const populatedAssignedMembers = (task.assignedMembers || []).map((memberId: string) => {
            return grantMembers.find((m: any) => m.$id === memberId) || { $id: memberId, user: { name: 'Unknown' } }
        })

        return {
            ...task,
            assignedMembers: populatedAssignedMembers
        }
    })

    return populatedTasks
}