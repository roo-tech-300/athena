import { useMutation } from "@tanstack/react-query"
import { createAccount, loginAccount, logoutAccount } from "../lib/apis/auth"
import { queryClient } from "../lib/react-query"

export const useCreateAccount = () => {
    return useMutation({
        mutationFn: ({ title, firstName, lastName, email, password, invitationToken }: any) => createAccount(title, firstName, lastName, email, password, invitationToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    })
}

export const useLoginAccount = () => {
    return useMutation({
        mutationFn: ({ email, password }: any) => loginAccount(email, password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
            queryClient.clear() // Clear all queries on login to avoid stale data from previous user
        }
    })
}

export const useLogoutAccount = () => {
    return useMutation({
        mutationFn: () => logoutAccount(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
            queryClient.clear() // Clear all queries on logout
        }
    })
}
