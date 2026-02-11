import { database, ID, Query } from "../appwrite"

export const createDepartment = async (name: string, userId: string) => {
    try {
        const department = await database.createRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DEPARTMENT_ID,
            ID.unique(),
            {
                name
            }
        )

        const member = await createDepartmentMember(department.$id, userId, "Admin")
        return { department, member }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const createDepartmentMember = async (departmentId: string, userId: string, role?: string) => {
    try {
        const departmentMember = await database.createRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DEPARTMENT_MEMBERS_ID,
            ID.unique(),
            {
                department: departmentId,
                user: userId,
                roles: role || "member"
            }
        )
        return departmentMember
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getUserDepartments = async (userId: string) => {
    try {
        const res = await database.listRows(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DEPARTMENT_MEMBERS_ID,
            [Query.equal("user", userId)]
        )

        const departmentMembers = res.rows;
        if (departmentMembers.length === 0) return [];

        const departmentIds = departmentMembers.map((m: any) => m.department);

        const depts = await Promise.all(
            departmentIds.map((id: string) =>
                database.getRow(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_DEPARTMENT_ID,
                    id
                )
            )
        )

        // Merge roles into department objects
        return depts.map((dept: any) => {
            const membership = departmentMembers.find((m: any) => m.department === dept.$id);
            return {
                ...dept,
                userRole: membership?.roles || "member"
            };
        });
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getDepartment = async (deptId: string) => {
    try {
        return await database.getRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DEPARTMENT_ID,
            deptId
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateDepartment = async (deptId: string, data: any) => {
    try {
        return await database.updateRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DEPARTMENT_ID,
            deptId,
            data
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
}
