# Athena Setup Guide

Complete guide for setting up the Athena project from scratch.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** version 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- **Appwrite** account ([Sign up](https://appwrite.io/))
- Code editor (VS Code recommended)

## Step 1: Initialize Project

### Create Vite Project

```bash
# Navigate to Desktop
cd Desktop

# Create new Vite + React + TypeScript project
npm create vite@latest athena -- --template react-ts

# Navigate into project
cd athena

# Install dependencies
npm install
```

## Step 2: Install Dependencies

### Core Dependencies

```bash
# React Query for data fetching
npm install @tanstack/react-query @tanstack/react-query-devtools

# Appwrite SDK
npm install appwrite

# React Router for navigation
npm install react-router-dom

# Date handling
npm install date-fns

# Form validation
npm install zod react-hook-form @hookform/resolvers
```

### Development Dependencies

```bash
# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# ESLint and Prettier
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react-hooks

# TypeScript types
npm install -D @types/node

# Testing (optional but recommended)
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

## Step 3: Configure Tailwind CSS

### Initialize Tailwind

```bash
npx tailwindcss init -p
```

### Update `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#1E40AF',
          light: '#DBEAFE',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          300: '#D1D5DB',
          500: '#6B7280',
          700: '#374151',
          900: '#111827',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 38, 135, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
```

### Create `src/styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@layer base {
  * {
    @apply border-gray-300;
  }
  
  body {
    @apply bg-gray-50 text-gray-900 font-sans;
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    @apply outline-none ring-2 ring-primary ring-offset-2;
  }
}

@layer components {
  /* Glass effect utility */
  .glass {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Import in `src/main.tsx`

```typescript
import './styles/globals.css'
```

## Step 4: TypeScript Configuration

### Update `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "strictNullChecks": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/services/*": ["./src/services/*"],
      "@/config/*": ["./src/config/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Update `vite.config.ts` for path aliases

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## Step 5: ESLint & Prettier Configuration

### `.eslintrc.json`

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint", "react-hooks"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

### `.prettierignore`

```
node_modules
dist
build
.vite
```

## Step 6: Environment Variables

### Create `.env` file (DO NOT COMMIT)

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_COLLECTION_GRANTS=grants
VITE_APPWRITE_COLLECTION_ORGANISATIONS=organisations
VITE_APPWRITE_COLLECTION_USERS=users_metadata
VITE_APPWRITE_BUCKET_DOCUMENTS=documents
```

### Create `.env.example` (commit this)

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_COLLECTION_GRANTS=
VITE_APPWRITE_COLLECTION_ORGANISATIONS=
VITE_APPWRITE_COLLECTION_USERS=
VITE_APPWRITE_BUCKET_DOCUMENTS=
```

### Update `.gitignore`

```
# Environments
.env
.env.local
.env.production

# Dependencies
node_modules

# Build
dist
dist-ssr

# Editor
.vscode/*
!.vscode/extensions.json
.idea

# OS
.DS_Store
Thumbs.db
```

## Step 7: Appwrite Configuration

### Create `src/config/appwrite.ts`

```typescript
export const APPWRITE_CONFIG = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  collections: {
    grants: import.meta.env.VITE_APPWRITE_COLLECTION_GRANTS,
    organisations: import.meta.env.VITE_APPWRITE_COLLECTION_ORGANISATIONS,
    users: import.meta.env.VITE_APPWRITE_COLLECTION_USERS,
  },
  buckets: {
    documents: import.meta.env.VITE_APPWRITE_BUCKET_DOCUMENTS,
  },
} as const

// Type guard to ensure all config values are present
export function validateAppwriteConfig() {
  const config = APPWRITE_CONFIG
  
  if (!config.endpoint || !config.projectId || !config.databaseId) {
    throw new Error('Missing required Appwrite configuration. Check your .env file.')
  }
  
  return true
}
```

### Create `src/services/appwrite/client.ts`

```typescript
import { Client, Account, Databases, Storage } from 'appwrite'
import { APPWRITE_CONFIG, validateAppwriteConfig } from '@/config/appwrite'

// Validate config on initialization
validateAppwriteConfig()

// Initialize Appwrite Client
export const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId)

// Initialize Appwrite services
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
```

## Step 8: React Query Setup

### Create `src/config/queryClient.ts`

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
```

### Update `src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/config/queryClient'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
```

## Step 9: Set Up Appwrite Backend

### 1. Create Appwrite Project

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io/)
2. Sign up or log in
3. Create a new project called "Athena"
4. Copy the Project ID to your `.env` file

### 2. Create Database

1. In your project, go to "Databases"
2. Create a new database called "athena-production"
3. Copy the Database ID to your `.env` file

### 3. Create Collections

#### Organisations Collection

**Attributes**:
- `name` (string, 255, required)
- `slug` (string, 255, required, unique)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)

**Indexes**:
- `slug` (key: slug, type: unique)

**Permissions**:
- Read: Users
- Create: Users
- Update: Users
- Delete: Users

#### Grants Collection

**Attributes**:
- `title` (string, 500, required)
- `fundingBody` (string, 255, required)
- `amount` (integer, required)
- `currency` (string, 10, required, default: "USD")
- `status` (enum: draft, submitted, under_review, approved, rejected, active, completed, required)
- `description` (string, 5000)
- `startDate` (datetime)
- `endDate` (datetime)
- `deadline` (datetime)
- `organisationId` (string, 255, required)
- `userId` (string, 255, required) // Owner
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)

**Indexes**:
- `organisationId` (key: organisationId, type: key)
- `userId` (key: userId, type: key)
- `status` (key: status, type: key)

**Permissions**:
- Read: Users
- Create: Users
- Update: Users
- Delete: Users

#### Users Metadata Collection (optional)

For storing additional user data beyond Appwrite's built-in user object.

**Attributes**:
- `userId` (string, 255, required, unique)
- `organisationId` (string, 255, required)
- `role` (enum: lecturer, administrator, viewer, required)
- `firstName` (string, 100)
- `lastName` (string, 100)
- `createdAt` (datetime, required)

### 4. Create Storage Bucket

1. Go to "Storage"
2. Create bucket called "documents"
3. Set max file size: 50MB
4. Allowed file extensions: pdf, doc, docx, txt, jpg, png
5. Copy Bucket ID to your `.env` file

**Permissions**:
- Read: Users
- Create: Users
- Update: Users
- Delete: Users

## Step 10: Create Initial Folder Structure

Run these commands to create the folder structure:

```bash
# Navigate to src
cd src

# Create component folders
mkdir -p components/ui components/layout components/forms

# Create feature folders
mkdir -p features/auth/components features/auth/hooks
mkdir -p features/grants/components features/grants/hooks
mkdir -p features/organisations/components features/organisations/hooks
mkdir -p features/users/components features/users/hooks
mkdir -p features/dashboard/components features/dashboard/hooks

# Create other folders
mkdir -p pages
mkdir -p services/appwrite
mkdir -p hooks
mkdir -p lib
mkdir -p types
mkdir -p contexts
mkdir -p styles
mkdir -p config

cd ..
```

## Step 11: Add Scripts to `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit"
  }
}
```

## Step 12: Create Initial Utility Files

### `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility for merging Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### `src/lib/constants.ts`

```typescript
export const APP_NAME = 'Athena'
export const APP_DESCRIPTION = 'University Grant Tracking & Management'

export const GRANT_STATUSES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const

export const USER_ROLES = {
  LECTURER: 'lecturer',
  ADMINISTRATOR: 'administrator',
  VIEWER: 'viewer',
} as const

export const DATE_FORMAT = 'MMM dd, yyyy'
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm'
```

## Step 13: VS Code Recommended Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## Step 14: Test the Setup

```bash
# Start development server
npm run dev

# In a new terminal, check TypeScript
npm run type-check

# Check linting
npm run lint
```

Visit `http://localhost:5173` - you should see the Vite + React welcome page.

## Step 15: Next Steps

Now that setup is complete:

1. **Build authentication**: Start with `/features/auth`
2. **Create base UI components**: `/components/ui/Button.tsx`, etc.
3. **Set up routing**: Install react-router-dom and create routes
4. **Create first feature**: Grant listing and creation

## Troubleshooting

### TypeScript path aliases not working

Make sure `vite.config.ts` has the path alias configuration and restart the dev server.

### Appwrite connection errors

1. Check your `.env` file has correct values
2. Verify project ID and endpoint in Appwrite console
3. Check network connection

### Tailwind classes not applying

1. Ensure `globals.css` is imported in `main.tsx`
2. Check `tailwind.config.js` content paths
3. Restart dev server

### ESLint errors

Run `npm run lint:fix` to auto-fix most issues.

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code quality
npm run lint            # Check for lint errors
npm run lint:fix        # Fix lint errors
npm run format          # Format code with Prettier
npm run type-check      # Check TypeScript types

# Dependencies
npm install <package>   # Install new package
npm update              # Update packages
npm audit fix           # Fix security vulnerabilities
```

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Appwrite Documentation](https://appwrite.io/docs)

---

**Your Athena project is now ready for development! 🚀**
