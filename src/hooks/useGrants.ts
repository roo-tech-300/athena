import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserGrants, getGrant, getGrantMembers, createGrant, joinGrantByCode, createActivity, updateGrantMember, getActivities, updateGrant, deleteGrant, addGrantMember } from "../lib/apis/grants";
import { queryClient } from "../lib/react-query";

export function useActivities(grantId: string) {
    return useQuery({
        queryKey: ['activities', grantId],
        queryFn: () => getActivities(grantId),
        enabled: !!grantId,
        staleTime: 1 * 60 * 1000
    })
}

export function useUpdateGrant() {
    return useMutation({
        mutationFn: ({ grantId, data }: { grantId: string, data: any }) => updateGrant(grantId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['grant', variables.grantId] })
            queryClient.invalidateQueries({ queryKey: ['grants'] })
        }
    })
}

export function useDeleteGrant() {
    return useMutation({
        mutationFn: (grantId: string) => deleteGrant(grantId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grants'] })
        }
    })
}

export function useUserGrants(userId: string) {
    return useQuery({
        queryKey: ['grants', userId],
        queryFn: () => getUserGrants(userId),
        enabled: !!userId,
        staleTime: 2 * 60 * 1000
    })
}

export function useGrant(grantId: string) {
    return useQuery({
        queryKey: ['grant', grantId],
        queryFn: () => getGrant(grantId),
        enabled: !!grantId,
        staleTime: 2 * 60 * 1000
    })
}

export function useGrantMembers(grantId: string) {
    return useQuery({
        queryKey: ['grantMembers', grantId],
        queryFn: () => getGrantMembers(grantId),
        enabled: !!grantId,
        staleTime: 2 * 60 * 1000
    })
}

export function useCreateGrant() {
    return useMutation({
        mutationFn: ({ userId, title, type, expectedFunding, description }: {
            userId: string,
            title: string,
            type: string,
            expectedFunding: number,
            description?: string
        }) => createGrant(userId, title, type, expectedFunding, description),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['grants', variables.userId] })
        }
    })
}

export function useJoinGrantByCode() {
    return useMutation({
        mutationFn: ({ code, userId }: { code: string, userId: string }) => joinGrantByCode(code, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['grants', variables.userId] })
        }
    })
}

export function useGetUserGrants(userId: string) {
    return useQuery({
        queryKey: ['userGrantsByCode', userId],
        queryFn: () => getUserGrants(userId),
        enabled: !!userId,
        staleTime: 2 * 60 * 1000
    })
}

export function useCreateActivity(grant: string, description: string, entityType: string, entityId: string) {
    return useMutation({
        mutationFn: () => createActivity(grant, description, entityType, entityId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grants', grant] })
        }
    })
}

export function useGetGrantMembers(grantId: string) {
    return useQuery({
        queryKey: ['grantMembers', grantId],
        queryFn: () => getGrantMembers(grantId),
        enabled: !!grantId,
        staleTime: 2 * 60 * 1000
    })
}

export function useUpdateGrantMember() {
    return useMutation({
        mutationFn: ({ memberId, role, status }: { memberId: string, role?: any, status?: any, grantId: string }) =>
            updateGrantMember(memberId, role, status),
        onMutate: async (variables) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['grantMembers', variables.grantId] });

            // Snapshot the previous value
            const previousMembers = queryClient.getQueryData(['grantMembers', variables.grantId]);

            // Optimistically update to the new value
            queryClient.setQueryData(['grantMembers', variables.grantId], (old: any) => {
                if (!old) return old;
                return old.map((member: any) => {
                    if (member.$id === variables.memberId) {
                        return {
                            ...member,
                            ...(variables.role !== undefined ? { role: variables.role } : {}),
                            ...(variables.status !== undefined ? { status: variables.status } : {})
                        };
                    }
                    return member;
                });
            });

            // Return a context object with the snapshotted value
            return { previousMembers, grantId: variables.grantId };
        },
        onError: (_err, _variables, context: any) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousMembers) {
                queryClient.setQueryData(['grantMembers', context.grantId], context.previousMembers);
            }
        },
        onSettled: (_data, _error, variables) => {
            // Always refetch after error or success to ensure we have the truth from the server
            queryClient.invalidateQueries({ queryKey: ['grantMembers', variables.grantId] });
        }
    })
}

export function useAddGrantMember() {
    return useMutation({
        mutationFn: ({ grantId, email, role }: { grantId: string, email: string, role: any[] }) =>
            addGrantMember(grantId, email, role),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['grantMembers', variables.grantId] })
        }
    })
}
