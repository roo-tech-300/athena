export interface Grant {
    id: string
    title: string
    status: string
    type: string
    role: string
    deadline: string
    completion: number
    description?: string
    expectedFunding?: number
    department?: string
    departmentName: string
}
