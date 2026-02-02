import { useMutation, useQuery } from "@tanstack/react-query"
import { createDeliverables, getDeliverables, createDeliverableTasks, getDeliverableTasks } from "../lib/apis/deliverable"
import { queryClient } from "../lib/react-query"

export const useCreateDeliverable = () => {
    return useMutation({
        mutationFn: ({ grant, title, dueDate, status }: {
            grant: string,
            title: string,
            dueDate: string,
            status?: "Completed" | "Progress"
        }) => createDeliverables(grant, title, dueDate, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['deliverables', variables.grant] })
        }
    })
}

export const useGetDeliverables = (grantId: string) => {
    return useQuery({
        queryKey: ['deliverables', grantId],
        queryFn: () => getDeliverables(grantId),
        enabled: !!grantId,
        staleTime: 2 * 60 * 1000,
    })
}

export const useCreateDeliverableTask = () => {
    return useMutation({
        mutationFn: ({ deliverable, title, dueDate, status, assignedMembers, description }: {
            deliverable: string,
            title: string,
            dueDate: string,
            status: "Completed" | "Progress",
            assignedMembers: string[],
            description?: string,
            grantId: string
        }) => createDeliverableTasks(deliverable, title, dueDate, status, assignedMembers, description),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['deliverables', variables.grantId] })
        }
    })
}

export const useGetDeliverableTasks = (deliverableId: string) => {
    return useQuery({
        queryKey: ['deliverable-tasks', deliverableId],
        queryFn: () => getDeliverableTasks(deliverableId),
        enabled: !!deliverableId,
        staleTime: 2 * 60 * 1000,
    })
}
