# Athena Folder Structure

This document explains the complete folder structure for the Athena project.

## Root Directory

```
athena/
├── public/                  # Static assets
├── src/                     # Source code
├── .env                     # Environment variables (DO NOT COMMIT)
├── .env.example             # Example environment variables
├── .eslintrc.json           # ESLint configuration
├── .prettierrc              # Prettier configuration
├── .gitignore               # Git ignore rules
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tsconfig.node.json       # TypeScript config for build tools
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.ts           # Vite build configuration
├── PRD.md                   # Product Requirements Document
├── ENGINEERING_PRINCIPLES.md # Architecture guidelines
├── DESIGN_SYSTEM.md         # Design tokens and guidelines
└── README.md                # Project overview
```

## Source Directory (`/src`)

```
src/
├── components/              # Reusable UI components
│   ├── ui/                 # Base design system components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Table.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   ├── Toast.tsx
│   │   └── index.ts        # Barrel export
│   │
│   ├── layout/             # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── PageLayout.tsx
│   │   ├── Container.tsx
│   │   └── index.ts
│   │
│   └── forms/              # Form-specific components
│       ├── GrantForm.tsx
│       ├── UserForm.tsx
│       ├── OrganisationForm.tsx
│       ├── FormField.tsx
│       ├── FormError.tsx
│       └── index.ts
│
├── features/               # Feature-based modules (domain logic)
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useLogin.ts
│   │   │   └── useLogout.ts
│   │   └── types.ts
│   │
│   ├── grants/
│   │   ├── components/
│   │   │   ├── GrantCard.tsx
│   │   │   ├── GrantList.tsx
│   │   │   ├── GrantDetails.tsx
│   │   │   ├── GrantFilters.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── GrantTimeline.tsx
│   │   ├── hooks/
│   │   │   ├── useGrants.ts
│   │   │   ├── useGrantMutations.ts
│   │   │   ├── useGrantFilters.ts
│   │   │   └── useGrantById.ts
│   │   └── types.ts
│   │
│   ├── organisations/
│   │   ├── components/
│   │   │   ├── OrganisationCard.tsx
│   │   │   ├── OrganisationSettings.tsx
│   │   │   └── MemberList.tsx
│   │   ├── hooks/
│   │   │   ├── useOrganisation.ts
│   │   │   └── useOrganisationMembers.ts
│   │   └── types.ts
│   │
│   ├── users/
│   │   ├── components/
│   │   │   ├── UserAvatar.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   └── UserList.tsx
│   │   ├── hooks/
│   │   │   ├── useUser.ts
│   │   │   └── useUsers.ts
│   │   └── types.ts
│   │
│   └── dashboard/
│       ├── components/
│       │   ├── StatCard.tsx
│       │   ├── RecentGrants.tsx
│       │   ├── UpcomingDeadlines.tsx
│       │   └── ActivityFeed.tsx
│       ├── hooks/
│       │   └── useDashboardData.ts
│       └── types.ts
│
├── pages/                  # Route-level page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── GrantsPage.tsx
│   ├── GrantDetailsPage.tsx
│   ├── CreateGrantPage.tsx
│   ├── OrganisationPage.tsx
│   ├── SettingsPage.tsx
│   ├── UsersPage.tsx
│   └── NotFoundPage.tsx
│
├── services/               # Backend integration layer
│   ├── appwrite/
│   │   ├── client.ts       # Appwrite client setup
│   │   ├── auth.ts         # Authentication operations
│   │   ├── grants.ts       # Grant CRUD operations
│   │   ├── organisations.ts # Organisation operations
│   │   ├── users.ts        # User management
│   │   ├── storage.ts      # File upload/download
│   │   └── index.ts        # Barrel export
│   │
│   └── api/
│       ├── types.ts        # API response types
│       └── errors.ts       # Error handling utilities
│
├── hooks/                  # Shared/global hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   ├── useToast.ts
│   ├── useClickOutside.ts
│   └── index.ts
│
├── lib/                    # Utilities and helpers
│   ├── utils.ts            # General utilities (classNames, etc.)
│   ├── validators.ts       # Form validation functions
│   ├── formatters.ts       # Date, currency, number formatting
│   ├── constants.ts        # App-wide constants
│   └── index.ts
│
├── types/                  # Shared TypeScript types
│   ├── index.ts            # Global types
│   ├── grant.ts            # Grant-related types
│   ├── user.ts             # User-related types
│   ├── organisation.ts     # Organisation-related types
│   └── common.ts           # Common shared types
│
├── contexts/               # React contexts
│   ├── AuthContext.tsx     # Authentication state
│   ├── ThemeContext.tsx    # Theme (light/dark mode)
│   └── ToastContext.tsx    # Toast notifications
│
├── styles/                 # Global styles
│   ├── globals.css         # Global CSS
│   └── tailwind.css        # Tailwind imports
│
├── config/                 # Configuration files
│   ├── appwrite.ts         # Appwrite configuration
│   ├── routes.ts           # Route definitions
│   └── queryClient.ts      # React Query configuration
│
├── App.tsx                 # Main App component
├── main.tsx                # Application entry point
└── vite-env.d.ts           # Vite type definitions
```

## Detailed Breakdown

### `/components/ui`
**Purpose**: Base design system components that are reusable across the entire app.

**Guidelines**:
- Components should be generic and not contain business logic
- Should accept props for customization
- Should be fully typed with TypeScript
- Maximum 200 lines per component

**Examples**:
- `Button.tsx`: Primary, secondary, outline variants
- `Input.tsx`: Text input with label, error state
- `Card.tsx`: Container with shadow and padding
- `Modal.tsx`: Dialog component with backdrop

### `/components/layout`
**Purpose**: Components that define the structure and layout of pages.

**Examples**:
- `Header.tsx`: Top navigation with logo, user menu
- `Sidebar.tsx`: Side navigation menu
- `PageLayout.tsx`: Wrapper that combines header + sidebar + content
- `Container.tsx`: Max-width content container

### `/components/forms`
**Purpose**: Complex form components that compose multiple UI elements.

**Examples**:
- `GrantForm.tsx`: Form for creating/editing grants
- `FormField.tsx`: Reusable field with label + input + error

### `/features/[feature]`
**Purpose**: Feature-specific components, hooks, and types organized by domain.

**Structure for each feature**:
```
feature/
├── components/     # Components specific to this feature
├── hooks/          # React Query hooks and custom hooks
└── types.ts        # TypeScript types for this feature
```

**Why this structure?**:
- Keeps related code together
- Easy to find everything related to a feature
- Makes features more portable
- Clear separation of concerns

### `/pages`
**Purpose**: Top-level route components that compose features and components.

**Guidelines**:
- Pages should be thin - mostly composition
- Use feature components and hooks
- Handle routing logic
- Maximum 300 lines

**Example**:
```tsx
// GrantsPage.tsx
export default function GrantsPage() {
  const { grants, isLoading } = useGrants()
  
  return (
    <PageLayout>
      <GrantFilters />
      <GrantList grants={grants} isLoading={isLoading} />
    </PageLayout>
  )
}
```

### `/services/appwrite`
**Purpose**: All Appwrite SDK interactions isolated in one place.

**Guidelines**:
- UI components should NEVER import from here directly
- Only hooks should call service functions
- All functions should be typed
- Handle errors consistently
- Return structured data

**Example**:
```typescript
// grants.ts
export async function getGrants(orgId: string): Promise<Grant[]> {
  try {
    const response = await databases.listDocuments(...)
    return response.documents.map(doc => transformGrant(doc))
  } catch (error) {
    throw new AppwriteError('Failed to fetch grants', error)
  }
}
```

### `/hooks`
**Purpose**: Shared React hooks used across multiple features.

**Examples**:
- `useDebounce.ts`: Debounce values
- `useMediaQuery.ts`: Responsive breakpoint detection
- `useToast.ts`: Show toast notifications

### `/lib`
**Purpose**: Pure utility functions with no React dependencies.

**Examples**:
- `utils.ts`: `cn()` for classNames, `sleep()`, etc.
- `formatters.ts`: `formatDate()`, `formatCurrency()`
- `validators.ts`: `isValidEmail()`, `isStrongPassword()`

### `/types`
**Purpose**: Shared TypeScript types and interfaces.

**Guidelines**:
- Use interfaces for object shapes
- Use types for unions and complex types
- Export everything from `index.ts`
- Keep related types in the same file

**Example**:
```typescript
// grant.ts
export interface Grant {
  id: string
  title: string
  fundingBody: string
  amount: number
  status: GrantStatus
  createdAt: Date
  updatedAt: Date
}

export type GrantStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected'
  | 'active'
  | 'completed'
```

### `/contexts`
**Purpose**: React Context providers for global state.

**Guidelines**:
- Use sparingly (prefer React Query for server state)
- Good for: auth user, theme, toasts
- Bad for: data fetching, complex state

### `/config`
**Purpose**: Configuration files and constants.

**Examples**:
- `appwrite.ts`: Appwrite endpoint, project ID, collection IDs
- `routes.ts`: Route path constants
- `queryClient.ts`: React Query default options

## Naming Conventions

### Files
- **Components**: PascalCase (`GrantCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useGrants.ts`)
- **Utils**: camelCase (`formatters.ts`)
- **Types**: camelCase (`grant.ts`)
- **Config**: camelCase (`appwrite.ts`)

### Exports
- **Default export**: Use for main component of file
- **Named exports**: Use for multiple utilities/types
- **Barrel exports**: Use `index.ts` to re-export from folder

### Folders
- **Lowercase with hyphens**: Avoid (we use camelCase for single words)
- **camelCase**: Preferred (`components`, `appwrite`)
- **Plural**: For collections (`components`, `hooks`, `types`)
- **Singular**: For single items (`config`, `lib`)

## Import Path Aliases

Configure in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

**Usage**:
```typescript
import { Button } from '@/components/ui'
import { useGrants } from '@/features/grants/hooks/useGrants'
import { formatDate } from '@/lib/formatters'
import type { Grant } from '@/types/grant'
```

## Best Practices

1. **Keep files small**: Max 300-400 lines
2. **Colocate related code**: Feature folders keep everything together
3. **Clear separation**: UI, logic, and data layers are distinct
4. **Type everything**: No `any` types
5. **Consistent naming**: Follow conventions throughout
6. **Barrel exports**: Use `index.ts` to simplify imports
7. **No circular dependencies**: Import flow should be clear
8. **Test files**: Place alongside source files with `.test.tsx` suffix

## File Size Guidelines

| File Type | Max Lines | Reason |
|-----------|-----------|--------|
| Component | 300 | Readability, maintainability |
| Hook | 200 | Single responsibility |
| Service | 300 | Each service handles one domain |
| Utility | 200 | Pure functions, easy to test |
| Type | 150 | Keep types focused |
| Page | 300 | Should be mostly composition |

## Growth Strategy

As the app grows:

1. **Split large features**: If a feature folder gets too large, split into sub-features
2. **Extract shared logic**: Move reusable logic to `/hooks` or `/lib`
3. **Create sub-components**: Break large components into smaller pieces
4. **Add feature services**: Complex features can have their own service layer
5. **Domain-driven structure**: Consider organizing by domain instead of technical layer

## Example: Adding a New Feature

To add a "notifications" feature:

1. Create `/src/features/notifications/`
2. Add `components/`, `hooks/`, and `types.ts`
3. Create service in `/src/services/appwrite/notifications.ts`
4. Add types in `/src/types/notification.ts`
5. Create page in `/src/pages/NotificationsPage.tsx`
6. Add route in `/src/config/routes.ts`

This structure keeps everything organized and easy to find!
