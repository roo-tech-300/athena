import { useQuery } from "@tanstack/react-query";
import { getUser, getUserById } from "../lib/apis/user";

export function useGetUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
    })
}

export function useGetUserById(id?: string) {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserById(id!),
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!id,
    })
}
