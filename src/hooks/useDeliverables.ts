import { useMutation, useQuery } from "@tanstack/react-query"
import { createDeliverables, getDeliverables, createDeliverableTasks, getDeliverableTasks, updateDeliverableTask, updateDeliverable } from "../lib/apis/deliverable"
import { queryClient } from "../lib/react-query"

export const useCreateDeliverable = () => {
    return useMutation({
        mutationFn: ({ grant, title, dueDate, status }: {
            grant: string,
            title: string,
            dueDate: string,
            status?: "Completed" | "Progress"
        }) => createDeliverables(grant, title, dueDate, status),
        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['deliverables', variables.grant] })

            // Snapshot previous value
            const previousDeliverables = queryClient.getQueryData(['deliverables', variables.grant])

            // Optimistically update
            queryClient.setQueryData(['deliverables', variables.grant], (old: any) => {
                const optimisticDeliverable = {
                    $id: `temp-${Date.now()}`,
                    title: variables.title,
                    dueDate: variables.dueDate,
                    status: variables.status || 'Progress',
                    tasks: []
                }
                return old ? [...old, optimisticDeliverable] : [optimisticDeliverable]
            })

            return { previousDeliverables }
        },
        onError: (_err, variables, context) => {
            // Rollback on error
            if (context?.previousDeliverables) {
                queryClient.setQueryData(['deliverables', variables.grant], context.previousDeliverables)
            }
        },
        onSettled: (_, __, variables) => {
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
        mutationFn: ({ deliverable, title, dueDate, status, assignedMembers, description, action, actionItem }: {
            deliverable: string,
            title: string,
            dueDate: string,
            status: "Completed" | "Progress" | "PendingApproval",
            assignedMembers: string[],
            description?: string,
            action?: "Transaction" | "Other",
            actionItem?: string,
            grantId: string
        }) => createDeliverableTasks(deliverable, title, dueDate, status, assignedMembers, description, action, actionItem),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['deliverables', variables.grantId] })

            const previousDeliverables = queryClient.getQueryData(['deliverables', variables.grantId])

            // Optimistically add task to deliverable
            queryClient.setQueryData(['deliverables', variables.grantId], (old: any) => {
                if (!old) return old

                return old.map((d: any) => {
                    if (d.$id === variables.deliverable) {
                        const optimisticTask = {
                            $id: `temp-${Date.now()}`,
                            title: variables.title,
                            dueDate: variables.dueDate,
                            status: variables.status,
                            assignedMembers: variables.assignedMembers.map(id => ({ $id: id, user: { name: 'Loading...' } })),
                            description: variables.description,
                            action: variables.action,
                            actionItem: variables.actionItem
                        }
                        return {
                            ...d,
                            tasks: [...(d.tasks || []), optimisticTask]
                        }
                    }
                    return d
                })
            })

            return { previousDeliverables }
        },
        onError: (_err, variables, context) => {
            if (context?.previousDeliverables) {
                queryClient.setQueryData(['deliverables', variables.grantId], context.previousDeliverables)
            }
        },
        onSettled: (_, __, variables) => {
            queryClient.invalidateQueries({ queryKey: ['deliverables', variables.grantId] })
        }
    })
}

export const useUpdateDeliverableTask = () => {
    return useMutation({
        mutationFn: ({ taskId, data }: {
            taskId: string,
            data: {
                status?: "Completed" | "Progress" | "PendingApproval",
                actionItem?: string,
            },
            grantId: string
        }) => updateDeliverableTask(taskId, data),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['deliverables', variables.grantId] })

            const previousDeliverables = queryClient.getQueryData(['deliverables', variables.grantId])

            // Optimistically update task status
            queryClient.setQueryData(['deliverables', variables.grantId], (old: any) => {
                if (!old) return old

                return old.map((d: any) => {
                    if (d.tasks) {
                        return {
                            ...d,
                            tasks: d.tasks.map((t: any) => {
                                if (t.$id === variables.taskId) {
                                    return { ...t, ...variables.data }
                                }
                                return t
                            })
                        }
                    }
                    return d
                })
            })

            return { previousDeliverables }
        },
        onError: (_err, variables, context) => {
            if (context?.previousDeliverables) {
                queryClient.setQueryData(['deliverables', variables.grantId], context.previousDeliverables)
            }
        },
        onSettled: (_, __, variables) => {
            queryClient.invalidateQueries({ queryKey: ['deliverables', variables.grantId] })
        }
    })
}

export const useUpdateDeliverable = () => {
    return useMutation({
        mutationFn: ({ deliverableId, data }: {
            deliverableId: string,
            data: {
                status?: "Completed" | "Progress",
            },
            grantId: string
        }) => updateDeliverable(deliverableId, data),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['deliverables', variables.grantId] })

            const previousDeliverables = queryClient.getQueryData(['deliverables', variables.grantId])

            // Optimistically update deliverable status
            queryClient.setQueryData(['deliverables', variables.grantId], (old: any) => {
                if (!old) return old

                return old.map((d: any) => {
                    if (d.$id === variables.deliverableId) {
                        return { ...d, ...variables.data }
                    }
                    return d
                })
            })

            return { previousDeliverables }
        },
        onError: (_err, variables, context) => {
            if (context?.previousDeliverables) {
                queryClient.setQueryData(['deliverables', variables.grantId], context.previousDeliverables)
            }
        },
        onSettled: (_, __, variables) => {
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
