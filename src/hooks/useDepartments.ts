import { useMutation, useQuery } from "@tanstack/react-query"
import { createDepartment, getUserDepartments, getDepartment, updateDepartment } from "../lib/apis/department"
import type { DepartmentSubscription } from "../utils/subscription";
import { queryClient } from "../lib/react-query";

export const useUserDepartments = (userId: string) => {
    return useQuery({
        queryKey: ["departments", userId],
        queryFn: () => getUserDepartments(userId),
        enabled: !!userId,
    })
}

export const useDepartment = (deptId: string) => {
    return useQuery<DepartmentSubscription & { $id: string }>({
        queryKey: ["department", deptId],
        queryFn: () => getDepartment(deptId) as any,
        enabled: !!deptId,
    })
}

export const useCreateDepartment = () => {
    return useMutation({
        mutationFn: ({ name, userId }: { name: string, userId: string }) => createDepartment(name, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["departments", variables.userId] })
        }
    })
}
export const useUpdateDepartment = () => {
    return useMutation({
        mutationFn: ({ deptId, data }: { deptId: string, data: any }) => updateDepartment(deptId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["department", variables.deptId] })
            queryClient.invalidateQueries({ queryKey: ["departments"] })
        }
    })
}
