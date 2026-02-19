# Grant Invitation System Setup Guide

## Overview
This system allows you to invite users to grants even if they don't have an Athena account yet. When you add a user by email:
- **If they exist**: They're added directly to the grant
- **If they don't exist**: An invitation link is created and copied to your clipboard

## Database Setup Required

### Step 1: Create the Invitations Collection in Appwrite

1. Go to your Appwrite Console: https://fra.cloud.appwrite.io/console/project-697a31b9000db34753ad/databases/database-697a31d1001d428f50bf
2. Click "Create Collection"
3. Name it: **Grant Invitations**
4. Copy the Collection ID that's generated

### Step 2: Add Attributes to the Collection

Add these attributes to your new collection:

| Attribute Key | Type     | Size | Required | Default | Array |
|--------------|----------|------|----------|---------|-------|
| `email`      | String   | 255  | Yes      | -       | No    |
| `grant`      | String   | 255  | Yes      | -       | No    |
| `role`       | String   | 1000 | Yes      | -       | Yes   |
| `token`      | String   | 255  | Yes      | -       | No    |
| `status`     | String   | 50   | Yes      | Pending | No    |

**Note**: The `role` attribute should be an array to support multiple roles.

### Step 3: Set Collection Permissions

Set the following permissions:
- **Create**: Any authenticated user
- **Read**: Any authenticated user
- **Update**: Any authenticated user
- **Delete**: Admins only

### Step 4: Create Indexes

Add these indexes for better query performance:
1. Index on `email` (type: key)
2. Index on `grant` (type: key)
3. Index on `token` (type: unique, key)

### Step 5: Update Environment Variable

1. Open `.env` file
2. Find: `VITE_APPWRITE_GRANT_INVITATIONS_ID = PLACEHOLDER_UPDATE_THIS`
3. Replace `PLACEHOLDER_UPDATE_THIS` with your Collection ID from Step 1

Example:
```
VITE_APPWRITE_GRANT_INVITATIONS_ID = 67abc123def456789ghi
```

## How It Works

### For Existing Users
1. PI enters user's email in "Add Member" modal
2. System finds the user
3. User is immediately added to the grant as "Accepted"
4. Toast: "Member added to project"

### For New Users (Invitation Flow)
1. PI enters email of someone without an account
2. System creates an invitation record with a unique token
3. Invitation link is automatically copied to clipboard
4. Toast shows: "Invitation created! Link copied to clipboard"
5. PI shares the link with the invitee
6. When invitee clicks the link, they go to signup page with:
   - Pre-filled email
   - Invitation banner showing they've been invited
7. After signup completes:
   - Account is created
   - They're automatically added to the grant with assigned roles
   - Invitation is marked as "Accepted"

### Invitation Link Format
```
https://your-domain.com/signup?invite=TOKEN&email=user@example.com
```

## User Experience

### Principal Investigator Flow
1. Opens grant workspace
2. Goes to Personnel tab
3. Clicks "Add Member"
4. Enters email and selects roles
5. Clicks "Add researcher"
6. If user doesn't exist:
   - Gets notification with invitation link copied
   - Shares link via email/chat

### Invitee Flow
1. Receives invitation link
2. Clicks link → redirected to signup page
3. Sees invitation banner
4. Email is pre-filled
5. Completes signup form
6. After signup → automatically added to grant
7. Redirected to portal with new grant visible

## Testing

1. Try adding an existing user → should add immediately
2. Try adding a non-existent email → should create invitation
3. Click the invitation link → should open signup with email pre-filled
4. Complete signup → should join grant automatically
5. Try using same invitation link again → should show "already used"

## Troubleshooting

### "INVITATION_ALREADY_SENT" error
- An invitation already exists for this email + grant combination
- Check the Grant Invitations collection in Appwrite
- Delete the old invitation if needed

### Invitation token not working
- Check that `VITE_APPWRITE_GRANT_INVITATIONS_ID` is set correctly
- Verify the invitation exists in the database
- Check token matches exactly (case-sensitive)

### User not automatically joining grant
- Check browser console for errors
- Verify invitation status is "Pending"
- Ensure grant ID in invitation is valid

## Security Notes

- Invitation tokens are unique and single-use
- Tokens are only valid for the specific email address
- Once accepted, invitations cannot be reused
- Invitations don't expire (you may want to add expiration later)

## Future Enhancements

Possible improvements:
- Email notification system (send invitation via email)
- Expiration dates for invitations
- Ability to resend invitations
- View pending invitations in UI
- Revoke pending invitations
