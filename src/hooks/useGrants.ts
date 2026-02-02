import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserGrants, getGrant, getGrantMembers, createGrant, joinGrantByCode, createActivity } from "../lib/apis/grants";
import { queryClient } from "../lib/react-query";

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