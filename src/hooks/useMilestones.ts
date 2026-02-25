import { useMutation, useQuery } from "@tanstack/react-query"
import { createMilestone, getMilestones, updateMilestone } from "../lib/apis/milestone"
import { queryClient } from "../lib/react-query"

export const useCreateMilestone = () => {
    return useMutation({
        mutationFn: ({ grant, title, dueDate, status, priority, userId }: {
            grant: string,
            title: string,
            dueDate: string,
            status: "Completed" | "Progress",
            priority: "High" | "Medium" | "Low",
            userId: string
        }) => createMilestone(grant, title, dueDate, status, priority, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['milestones', variables.grant] })
            queryClient.invalidateQueries({ queryKey: ['activities', variables.grant] })
        }
    })
}

export const useGetMilestones = (grantId: string) => {
    return useQuery({
        queryKey: ['milestones', grantId],
        queryFn: () => getMilestones(grantId),
        enabled: !!grantId,
        staleTime: 2 * 60 * 1000,
    })
}

export const useUpdateMilestone = () => {
    return useMutation({
        mutationFn: ({ milestoneId, data }: { milestoneId: string, data: any, grantId: string }) =>
            updateMilestone(milestoneId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['milestones', variables.grantId] })
        }
    })
}
