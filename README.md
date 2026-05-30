# Admin Dashboard

A production-quality admin dashboard built with **Next.js 15**, **TypeScript**, **Material UI**, **Zustand**, and **NextAuth**. All data is sourced from the [DummyJSON API](https://dummyjson.com/).

## Tech Stack

| Technology   | Purpose                          |
| ------------ | -------------------------------- |
| Next.js 15   | React framework (App Router)    |
| TypeScript   | Type safety                     |
| Material UI  | UI component library            |
| Zustand      | State management + persistence  |
| NextAuth     | Authentication + route protection|
| Axios        | HTTP client                     |
| Swiper       | Image carousel                  |
| DummyJSON    | REST API backend                |

## Features

- **Authentication** — Login with DummyJSON credentials, session management with NextAuth + Zustand
- **Route Protection** — Middleware-based protection for all dashboard routes
- **Users Module** — Searchable, paginated user table with detail pages
- **Products Module** — Filterable product grid with category dropdown, Swiper image gallery
- **Dashboard Home** — Stats cards, quick navigation, session info
- **Theme Toggle** — Dark / Light mode with persistence
- **Debounced Search** — 500ms debounce on all search inputs
- **Cache Strategy** — 10-minute TTL on user and product list caches
- **Responsive Design** — Mobile, tablet, and desktop layouts
- **Error Handling** — Error boundaries, retry buttons, user-friendly alerts
- **Skeleton Loading** — MUI Skeleton components during API loading
- **URL-synced Pagination** — Page number reflected in URL query params
- **Snackbar Notifications** — MUI Snackbar for success/error feedback

## Installation

```bash
git clone <repository-url>
cd admin-dashboard
npm install
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
```

## Running Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

| Username | Password    |
| -------- | ----------- |
| emilys   | emilyspass  |

## Folder Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts   # NextAuth configuration
│   ├── dashboard/
│   │   ├── layout.tsx                     # Dashboard shell (sidebar + appbar)
│   │   ├── page.tsx                       # Dashboard home
│   │   ├── error.tsx                      # Dashboard error boundary
│   │   ├── users/
│   │   │   ├── page.tsx                   # Users list
│   │   │   └── [id]/page.tsx              # User details
│   │   └── products/
│   │       ├── page.tsx                   # Products grid
│   │       └── [id]/page.tsx              # Product details
│   ├── login/
│   │   ├── page.tsx                       # Login page (server)
│   │   └── LoginPageClient.tsx            # Login page (client)
│   ├── layout.tsx                         # Root layout
│   ├── page.tsx                           # Root redirect
│   └── error.tsx                          # Global error boundary
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SessionProvider.tsx
│   ├── common/
│   │   ├── BackButton.tsx
│   │   ├── CardSkeleton.tsx
│   │   ├── ContentSkeleton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── PageHeader.tsx
│   │   ├── PaginationComponent.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SnackbarNotification.tsx
│   │   └── TableSkeleton.tsx
│   ├── users/
│   │   ├── UserTable.tsx
│   │   └── UserDetailCard.tsx
│   └── products/
│       ├── ProductCard.tsx
│       ├── ProductGrid.tsx
│       ├── ProductCardSkeleton.tsx
│       ├── CategoryFilter.tsx
│       └── ProductDetailView.tsx
├── hooks/
│   └── useDebounce.ts
├── services/
│   ├── api.ts                             # Axios instance
│   ├── authApi.ts
│   ├── userApi.ts
│   └── productApi.ts
├── store/
│   ├── authStore.ts
│   ├── userStore.ts
│   ├── productStore.ts
│   └── uiStore.ts
├── theme/
│   ├── theme.ts
│   └── ThemeRegistry.tsx
├── types/
│   └── index.ts
├── utils/
│   ├── constants.ts
│   └── formatters.ts
└── middleware.ts
```

## Authentication Flow

```
User enters credentials
        ↓
LoginForm validates inputs
        ↓
Zustand authStore.login() called
        ↓
authApi.login() → POST /auth/login
        ↓
On success: store user + token in Zustand (persisted)
        ↓
NextAuth signIn() creates JWT session
        ↓
Redirect to /dashboard
```

## State Management — Why Zustand?

- **Simpler than Redux** — No actions/reducers/dispatch boilerplate
- **Less boilerplate** — Define state and actions in a single `create()` call
- **Small bundle size** — ~1KB gzipped vs Redux Toolkit's ~11KB
- **Built-in async support** — Async actions are just async functions
- **Easy persistence** — `persist` middleware stores state in localStorage
- **No context overhead** — Direct store subscriptions, no provider tree

## Caching Strategy

All caches use Zustand's `persist` middleware with localStorage:

| Data          | TTL        | Invalidation                    |
| ------------- | ---------- | ------------------------------- |
| User list     | 10 minutes | Auto-refetch after expiry       |
| Product list  | 10 minutes | Auto-refetch after expiry       |
| Categories    | 10 minutes | Auto-refetch after expiry       |
| Auth session  | Permanent  | Cleared on logout               |
| Search results| No cache   | Fresh request every time        |

On logout, all persisted stores are cleared from localStorage.

## Performance Optimizations

- `React.memo` on all reusable components to prevent unnecessary re-renders
- `useCallback` for all event handlers passed as props
- `useMemo` for computed values (theme, formatted data)
- `useDebounce` hook with 500ms delay prevents excessive API calls on search
- API-side pagination (limit/skip) — only fetches 10 items per page
- Selective store persistence — only cache essential fields, not loading/error state
- Swiper lazy loading for product image carousels

## Future Improvements

- [ ] Add unit tests with Jest and React Testing Library
- [ ] Add user/product CRUD operations (POST, PUT, DELETE)
- [ ] Add data export (CSV/PDF)
- [ ] Add charts and analytics dashboard
- [ ] Add token refresh flow with DummyJSON refresh endpoint
- [ ] Add i18n internationalization support
- [ ] Add E2E tests with Playwright
- [ ] Add PWA support for offline access
