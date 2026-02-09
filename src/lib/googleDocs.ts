export const createGoogleDoc = async (title: string, accessToken: string) => {
    try {
        const response = await fetch('https://docs.googleapis.com/v1/documents', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create Google Document');
        }

        const data = await response.json();
        return data; // Returns { documentId: "...", title: "...", ... }
    } catch (error) {
        console.error('Error creating Google Doc:', error);
        throw error;
    }
};
