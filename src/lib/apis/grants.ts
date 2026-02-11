import { generateGrantCode } from "../../utils/grant"
import { database, ID, Query } from "../appwrite"
import { getUserByEmail } from "./user";

type Role = 'Principal Investigator' | 'Researcher' | 'Reviewer' | 'Finance Officer';

export const createGrant = async (
    userId: string,
    title: string,
    type: string,
    expectedFunding: number,
    departmentId: string,
    description?: string,
) => {
    try {
        const code = generateGrantCode(title)
        const grant = await database.createRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_GRANT_COLLECTION_ID,
            ID.unique(),
            {
                name: title,
                description,
                type,
                expectedFunding,
                code,
                department: departmentId
            }
        )
        await createGrantMember(grant.$id, userId, ['Principal Investigator'], "Accepted")
        return grant
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getGrant = async (grantId: string) => {
    try {
        const grant = await database.getRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_GRANT_COLLECTION_ID,
            grantId
        )

        const members = await database.listRows(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_GRANT_MEMBER_COLLECTION_ID,
            [Query.equal("grant", grantId)]
        )
        grant.members = members.rows
        return grant
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const joinGrantByCode = async (code: string, userId: string) => {
    try {
        const grantResponse = await database.listRows(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_GRANT_COLLECTION_ID,
            [Query.equal("code", code)]
        )

        if (grantResponse.rows.length === 0) {
            throw new Error("GRANT_NOT_FOUND")
        }

        const grant = grantResponse.rows[0]
        const grantId = grant.$id

        const userGrants = await getUserGrants(userId)

        const alreadyMember = userGrants.some(
            (gm: any) => {
                const existingGrantId = typeof gm.grant === 'string' ? gm.grant : gm.grant.$id;
                return existingGrantId === grantId;
            }
        )

        if (alreadyMember) {
            throw new Error("ALREADY_MEMBER")
        }

        await createGrantMember(grantId, userId, ["Researcher"], "Pending")
        return grant
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const addGrantMember = async (grantId: string, email: string, role: Role[]) => {
    try {
        const userSearch = await getUserByEmail(email);
        if (userSearch.rows.length === 0) {
            throw new Error("USER_NOT_FOUND")
        }
        const user = userSearch.rows[0];
        const userId = user.$id;

        // Check if user is already a member
        const existingMembers = await database.listRows(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_GRANT_MEMBER_COLLECTION_ID,
            [
                Query.equal("grant", grantId),
                Query.equal("user", userId)
            ]
        )

        if (existingMembers.rows.length > 0) {
            throw new Error("ALREADY_MEMBER")
        }

        return await createGrantMember(grantId, userId, role, "Accepted")
    } catch (error) {
        console.error(error);
        throw error
    }
}

export const createGrantMember = async (grantId: string, userId: string, role?: Role[], status?: string) => {

    try {
        const grantMember = await database.createRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_GRANT_MEMBER_COLLECTION_ID,
            ID.unique(),
            {
                grant: grantId,
                user: userId,
                role,
                status
            }
        )
        return grantMember
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const updateGrantMember = async (memberId: string, role?: Role[], status?: "Accepted" | "Pending" | "Rejected") => {
    try {
        const grantMember = await database.updateRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_GRANT_MEMBER_COLLECTION_ID,
            memberId,
            {
                role,
                status
            }
        )
        return grantMember
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getUserGrants = async (userId: string) => {
    try {
        const grantsRes = await database.listRows(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_GRANT_MEMBER_COLLECTION_ID,
            [
                Query.equal("user", userId)
            ]
        )

        const grantMembers = grantsRes.rows;

        // Manually populate 'grant' if it's returning strings (IDs)
        const grantIdsToFetch = new Set<string>();
        grantMembers.forEach((m: any) => {
            if (typeof m.grant === 'string') {
                grantIdsToFetch.add(m.grant);
            }
        });

        if (grantIdsToFetch.size > 0) {
            const fetchedGrantsRes = await database.listRows(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_GRANT_COLLECTION_ID,
                [Query.equal('$id', Array.from(grantIdsToFetch))]
            );

            const grantsMap = new Map();
            fetchedGrantsRes.rows.forEach((g: any) => {
                grantsMap.set(g.$id, g);
            });

            // Merge back
            const populatedMembers = grantMembers.map((m: any) => {
                if (typeof m.grant === 'string') {
                    // If grant not found (deleted/permissions), provide fallback or keep ID
                    const grantData = grantsMap.get(m.grant);
                    // Create a minimal object if missing to prevent UI crash
                    return {
                        ...m,
                        grant: grantData || { $id: m.grant, name: 'Unknown Grant', status: 'Unknown', type: 'Unknown', expectedFunding: 0 }
                    };
                }
                return m;
            });

            // Fetch department names for grouping
            const deptIdsToFetch = new Set<string>();
            populatedMembers.forEach((m: any) => {
                if (m.grant.department) deptIdsToFetch.add(m.grant.department);
            });

            if (deptIdsToFetch.size > 0) {
                const deptIds = Array.from(deptIdsToFetch);
                const depts = await Promise.all(
                    deptIds.map(id =>
                        database.getRow(
                            import.meta.env.VITE_APPWRITE_DATABASE_ID,
                            import.meta.env.VITE_APPWRITE_DEPARTMENT_ID,
                            id
                        )
                    )
                );

                const deptsMap = new Map();
                depts.forEach((d: any) => deptsMap.set(d.$id, d));

                populatedMembers.forEach((m: any) => {
                    if (m.grant.department) {
                        m.grant.departmentName = deptsMap.get(m.grant.department)?.name || 'Unknown Funding Group';
                    } else {
                        m.grant.departmentName = 'Personal Projects';
                    }
                });
            } else {
                populatedMembers.forEach((m: any) => {
                    m.grant.departmentName = 'Personal Projects';
                });
            }

            return populatedMembers;
        }

        return grantMembers
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const createActivity = async (
    grant: string,
    description: string,
    entityType: string,
    entityId: string,
) => {
    try {
        const activity = await database.createRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_ACTIVITY_ID,
            ID.unique(),
            {
                grant,
                description,
                entityType,
                entityId
            }
        )
        return activity
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getGrantMembers = async (grantId: string) => {
    try {
        const membersRes = await database.listRows(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_GRANT_MEMBER_COLLECTION_ID,
            [Query.equal("grant", grantId)]
        )

        const grantMembers = membersRes.rows;
        if (grantMembers.length === 0) return [];

        // Fetch user data for each member to ensure we have name/email
        const userIdsToFetch = new Set<string>();
        grantMembers.forEach((m: any) => {
            const userId = typeof m.user === 'object' ? m.user?.$id : m.user;
            if (userId) userIdsToFetch.add(userId);
        });

        if (userIdsToFetch.size > 0) {
            const fetchedUsersRes = await database.listRows(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
                [Query.equal('$id', Array.from(userIdsToFetch))]
            );

            const usersMap = new Map();
            fetchedUsersRes.rows.forEach((u: any) => {
                usersMap.set(u.$id, u);
            });

            // Merge user profiles into the member records
            return grantMembers.map((m: any) => {
                const userId = typeof m.user === 'object' ? m.user?.$id : m.user;
                const userData = usersMap.get(userId);
                return {
                    ...m,
                    user: userData || (typeof m.user === 'object' ? m.user : { $id: userId, name: 'Unknown User' })
                };
            });
        }

        return grantMembers
    } catch (error) {
        console.error("Error fetching grant members:", error)
        throw error
    }
}
export const getActivities = async (grantId: string) => {
    try {
        const res = await database.listRows(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_ACTIVITY_ID,
            [Query.equal("grant", grantId), Query.orderDesc("$createdAt"), Query.limit(10)]
        )
        return res.rows
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const updateGrant = async (grantId: string, data: any) => {
    try {
        const res = await database.updateRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_GRANT_COLLECTION_ID,
            grantId,
            data
        )
        return res
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const deleteGrant = async (grantId: string) => {
    try {
        const res = await database.deleteRow(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_GRANT_COLLECTION_ID,
            grantId
        )
        // Also delete all members
        const members = await database.listRows(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_GRANT_MEMBER_COLLECTION_ID,
            [Query.equal("grant", grantId)]
        )
        for (const member of members.rows) {
            await database.deleteRow(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_GRANT_MEMBER_COLLECTION_ID,
                member.$id
            )
        }
        return res
    } catch (error) {
        console.error(error)
        throw error
    }
}
export const getDepartmentGrants = async (departmentId: string) => {
    try {
        const res = await database.listRows(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_GRANT_COLLECTION_ID,
            departmentId === 'personal'
                ? [Query.isNull("department")]
                : [Query.equal("department", departmentId)]
        )
        return res.rows
    } catch (error) {
        console.error(error)
        throw error
    }
}
