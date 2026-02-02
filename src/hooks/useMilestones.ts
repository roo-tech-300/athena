import { useMutation, useQuery } from "@tanstack/react-query"
import { createMilestone, getMilestones, updateMilestone } from "../lib/apis/milestone"
import { queryClient } from "../lib/react-query"

export const useCreateMilestone = () => {
    return useMutation({
        mutationFn: ({ grant, title, dueDate, status, priority }: {
            grant: string,
            title: string,
            dueDate: string,
            status: "Completed" | "Progress",
            priority: "High" | "Medium" | "Low"
        }) => createMilestone(grant, title, dueDate, status, priority),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['milestones', variables.grant] })
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
