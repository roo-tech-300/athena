import { generateGrantCode } from "../../utils/grant"
import { database, ID, Query } from "../appwrite"

type Role = 'Principal Investigator' | 'Researcher' | 'Reviewer' | 'Finance Officer';

export const createGrant = async (
    userId: string,
    title: string,
    type: string,
    expectedFunding: number,
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
                code
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
