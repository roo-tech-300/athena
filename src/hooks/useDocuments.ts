import { useMutation, useQuery } from "@tanstack/react-query"
import { createDocument, getDocuments, updateDocument } from "../lib/apis/documents"
import { queryClient } from "../lib/react-query"

export const useCreateDocument = () => {
    return useMutation({
        mutationFn: ({ doc, grant, title, action, actionItem, creator, type }: {
            doc: string,
            grant: string,
            title: string,
            action: "Milestone" | "Deliverable",
            actionItem: string,
            creator: string,
            type: string
        }) => createDocument(doc, grant, title, action, actionItem, creator, type),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['documents', variables.grant] })
        }
    })
}

export const useUpdateDocument = () => {
    return useMutation({
        mutationFn: (vars: { docId: string, data: any, grantId: string }) => updateDocument(vars.docId, vars.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['documents', variables.grantId] })
        }
    })
}

export const useGetDocuments = (grantId: string) => {
    return useQuery({
        queryKey: ['documents', grantId],
        queryFn: () => getDocuments(grantId),
        enabled: !!grantId
    })
}
