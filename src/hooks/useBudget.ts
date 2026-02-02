import { useMutation, useQuery } from "@tanstack/react-query"
import { createBudgetItem, createTransactions, getBudgetItem, getBudgetItems, getTransactions, updateBudgetItem } from "../lib/apis/budget"
import { queryClient } from "../lib/react-query"

export const useCreateBudgetItem = () => {
    return useMutation({
        mutationFn: ({ grantId, description, category, status, price }: {
            grantId: string,
            description: string,
            category: string,
            status: string,
            price: number
        }) => createBudgetItem(grantId, description, category, status, price),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['budget-items', variables.grantId] })
        }
    })
}

export const useGetBudgetItems = (grantId: string) => {
    return useQuery({
        queryKey: ['budget-items', grantId],
        queryFn: () => getBudgetItems(grantId),
        enabled: !!grantId,
        staleTime: 2 * 60 * 1000,
    })
}

export const useGetBudgetItem = (budgetItemId: string) => {
    return useQuery({
        queryKey: ['budget-item', budgetItemId],
        queryFn: () => getBudgetItem(budgetItemId),
        enabled: !!budgetItemId,
        staleTime: 2 * 60 * 1000,
    })
}

export const useUpdateBudgetItem = () => {
    return useMutation({
        mutationFn: ({ budgetItemId, data }: { budgetItemId: string, data: any, grantId: string }) =>
            updateBudgetItem(budgetItemId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['budget-items', variables.grantId] })
        }
    })
}

export const useCreateTransaction = () => {
    return useMutation({
        mutationFn: ({ item, amount, grantId }: { item: string, amount: number, grantId: string }) =>
            createTransactions(item, amount, grantId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['budget-items', variables.grantId] })
            queryClient.invalidateQueries({ queryKey: ['transactions', variables.grantId] })
        }
    })
}

export const useGetTransactions = (grantId: string) => {
    return useQuery({
        queryKey: ['transactions', grantId],
        queryFn: () => getTransactions(grantId),
        enabled: !!grantId,
        staleTime: 2 * 60 * 1000,
    })
}