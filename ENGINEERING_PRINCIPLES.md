# Athena Engineering Principles

## Architecture Philosophy

### 1. Component-First Design
- **Maximum file size**: 300-400 lines
- **Single Responsibility Principle** for all components
- Composable, reusable building blocks
- Clear component boundaries
- Prefer composition over large monolithic components

### 2. Type Safety
- Strict TypeScript configuration
- **No `any` types** - use `unknown` and type guards if needed
- Shared type definitions in `/src/types`
- Type guards where necessary
- Explicit return types for service functions

### 3. Backend Abstraction
- **Zero direct Appwrite SDK calls from UI components**
- All backend logic lives in `/src/services/appwrite`
- Service layer handles all data operations
- Consistent error handling across all services
- Type-safe API contracts

**Example structure**:
```
/src/services/appwrite/
  ├── client.ts          # Appwrite client setup
  ├── auth.ts            # Authentication operations
  ├── grants.ts          # Grant CRUD
  ├── organisations.ts   # Organisation operations
  ├── users.ts           # User management
  └── storage.ts         # File uploads
```

### 4. State Management Strategy
- **React Query** for all server state (fetching, caching, mutations)
- **React Context** for global UI state (theme, auth user, toasts)
- **Local state** (useState) for component-specific needs
- No Redux or other complex state libraries

### 5. React Query Usage
Use React Query for:
- Data fetching
- Caching with automatic background refetching
- Mutations with optimistic updates
- Loading and error states

**Rules**:
- Queries must be colocated in hooks (e.g. `useGrants.ts`, `useAuth.ts`)
- No manual loading state duplication when React Query provides it
- Use query keys consistently: `['grants'], ['grants', id], ['organisations', orgId]`
- Invalidate queries after mutations

### 6. Folder Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base components (Button, Input, Card)
│   ├── layout/          # Layout components
│   └── forms/           # Form-specific components
│
├── features/            # Feature-based modules
│   ├── auth/
│   ├── grants/
│   ├── organisations/
│   ├── users/
│   └── dashboard/
│
├── pages/               # Route-level page components
├── services/            # Backend integration layer
│   └── appwrite/
├── hooks/               # Shared hooks
├── lib/                 # Utilities and helpers
├── types/               # Shared TypeScript types
├── contexts/            # React contexts
├── styles/              # Global styles
└── config/              # Configuration files
```

### 7. Performance Guidelines
- Code splitting by route
- Lazy loading for heavy components
- Optimistic updates where appropriate
- Debounced search and filters (300ms)
- Memoize expensive computations with `useMemo`
- Virtualize long lists (react-virtual or similar)

### 8. Error Handling
- All service functions must handle errors gracefully
- Return typed error objects, not just throwing
- Display user-friendly error messages
- Log errors for debugging
- Never expose raw error messages to users

**Example**:
```typescript
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }
```

### 9. Testing Strategy
- **Unit tests**: Utilities, hooks, and pure functions
- **Integration tests**: Service layer functions
- **E2E tests**: Critical user flows (login, create grant)
- **Accessibility tests**: Automated with jest-axe

### 10. Code Quality
- ESLint enforces code standards
- Prettier for consistent formatting
- Pre-commit hooks with husky + lint-staged
- No console.logs in production code
- Meaningful variable and function names

### 11. Accessibility Requirements
- All interactive elements keyboard accessible
- Clear focus indicators (2-3px outline)
- ARIA labels where needed
- Semantic HTML elements
- Color contrast ratio minimum 4.5:1
- Support for screen readers
- `prefers-reduced-motion` support

### 12. File Naming Conventions
- Components: PascalCase (`GrantCard.tsx`, `Button.tsx`)
- Hooks: camelCase with `use` prefix (`useGrants.ts`, `useAuth.ts`)
- Utilities: camelCase (`formatDate.ts`, `validators.ts`)
- Types: PascalCase for interfaces/types (`Grant.ts`, `User.ts`)
- Constants: UPPER_SNAKE_CASE in `constants.ts`

### 13. Import Organization
Order imports as follows:
1. React and external libraries
2. Internal absolute imports (@/)
3. Relative imports
4. Type imports (separate)
5. CSS imports

**Example**:
```typescript
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth/hooks/useAuth'

import { validateEmail } from './validators'

import type { Grant } from '@/types/grant'

import './styles.css'
```

### 14. Component Guidelines
- One component per file
- Export component as default if it's the main export
- Props interface should be named `[ComponentName]Props`
- Destructure props in function signature
- Keep JSX readable (max 3 levels of nesting)

**Example**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  children: React.ReactNode
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  children 
}: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### 15. Security Considerations
- Never store sensitive data in localStorage
- Use environment variables for API keys
- Sanitize user input
- Validate on both client and server
- Use HTTPS only
- Implement proper CORS policies
- Rate limiting for API calls
