# PageCraft: E-Book Publishing Platform - Documentation

## Project Overview

PageCraft is a comprehensive e-book publishing platform that empowers authors with innovative tools for writing, editing, and selling their works. The platform provides end-to-end publishing solutions including manuscript management, publishing services in multiple formats (paperback, e-book, audiobook), worldwide distribution, and sales tracking.

## Tech Stack

### Frontend
- **React**: UI library for building component-based interfaces
- **TypeScript**: Strongly typed JavaScript for better developer experience and code quality
- **TanStack Query (React Query)**: Data fetching, caching, and state management library
- **Wouter**: Lightweight routing library for React applications
- **Shadcn UI**: Component library with beautiful, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Hook Form**: Form management library with validation
- **Zod**: TypeScript-first schema validation
- **Lucide React**: Icon library
- **Recharts**: Composable charting library for data visualization

### Backend
- **Express**: Web framework for Node.js
- **TypeScript**: Type-safe server code
- **Passport.js**: Authentication middleware
- **Session Management**: Express session for user session management
- **Drizzle ORM**: TypeScript-first ORM for SQL databases
- **PostgreSQL**: Relational database for production (configured but using in-memory storage currently)
- **Memory Storage**: In-memory storage for development and prototyping
- **Stripe**: Payment processing integration

### Development Tools
- **Vite**: Fast, modern frontend build tool
- **ESBuild**: JavaScript bundler used by Vite
- **Drizzle Kit**: Schema migration tools for Drizzle ORM
- **TSX**: TypeScript execution environment

## Project Structure

### Root Structure

```
/
├── client/              # Frontend React application
├── server/              # Backend Express server
├── shared/              # Shared code between client and server
├── drizzle.config.ts    # Drizzle ORM configuration
├── package.json         # Project dependencies and scripts
├── postcss.config.js    # PostCSS configuration for Tailwind
├── tailwind.config.ts   # Tailwind CSS configuration
├── theme.json           # Theme configuration for the application
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite build tool configuration
```

### Client Structure

```
client/
├── index.html           # HTML entry point
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── cart/        # Shopping cart components
│   │   ├── layout/      # Layout components (header, footer, etc.)
│   │   ├── manuscript/  # Manuscript management components
│   │   ├── order/       # Order management components
│   │   ├── publishing/  # Publishing process components
│   │   └── ui/          # Basic UI components (shadcn)
│   ├── hooks/           # Custom React hooks
│   │   ├── use-auth.tsx # Authentication hook
│   │   ├── use-mobile.tsx # Responsive design hook
│   │   └── use-toast.ts # Toast notification hook
│   ├── lib/             # Utility functions and constants
│   │   ├── admin-route.tsx  # Admin route protection
│   │   ├── constants.ts     # Application constants
│   │   ├── fonts.ts         # Font definitions
│   │   ├── protected-route.tsx # Authentication route protection
│   │   ├── queryClient.ts   # TanStack Query configuration
│   │   └── utils.ts         # Utility functions
│   ├── pages/           # Application pages
│   │   ├── about-page.tsx
│   │   ├── account-page.tsx
│   │   ├── admin-panel.tsx
│   │   ├── auth-page.tsx
│   │   ├── author-dashboard.tsx
│   │   ├── book-detail-page.tsx
│   │   ├── bookstore-page.tsx
│   │   ├── checkout-page.tsx
│   │   ├── contact-page.tsx
│   │   ├── home-page.tsx
│   │   ├── not-found.tsx
│   │   ├── pricing-page.tsx
│   │   ├── publishing-process-page.tsx
│   │   ├── services-page.tsx
│   │   ├── user-dashboard-new.tsx
│   │   └── user-dashboard.tsx
│   ├── providers/       # Context providers
│   │   └── auth-provider.tsx # Authentication provider
│   ├── App.tsx          # Main application component
│   ├── index.css        # Global styles
│   └── main.tsx         # Application entry point
```

### Server Structure

```
server/
├── auth.ts              # Authentication setup with Passport.js
├── index.ts             # Server entry point
├── routes.ts            # API route definitions
├── storage.ts           # Data storage interface and implementation
└── vite.ts              # Vite integration for dev server
```

### Shared Structure

```
shared/
└── schema.ts            # Shared data models and schemas
```

## Data Flow

1. **Client-side requests**:
   - React components use React Query hooks to fetch data
   - API requests are made through the `apiRequest` function in `queryClient.ts`
   - Authentication state is managed through the `useAuth` hook

2. **Server-side processing**:
   - Express routes in `routes.ts` handle API requests
   - Authentication is managed through Passport.js in `auth.ts`
   - Data operations are performed through the storage interface in `storage.ts`

3. **Data persistence**:
   - Currently using in-memory storage (`MemStorage` class in `storage.ts`)
   - Schema defined in `shared/schema.ts` with Drizzle ORM and Zod validation
   - Configured for PostgreSQL database migration when needed

## Authentication System

1. **User registration and login**:
   - `/api/register` and `/api/login` endpoints
   - Password hashing using Node.js crypto module
   - Session-based authentication using Passport.js

2. **Authorization**:
   - Protected routes using `ProtectedRoute` component
   - Admin routes using `AdminRoute` component
   - Role-based access control for different user types (readers, authors, admins)

## Key Features

### User Authentication and Profiles
- Registration and login system
- User profile management
- Role-based access (readers, authors, administrators)

### Manuscript Management
- Manuscript upload and editing
- Multiple file format support
- Progress tracking
- Editor feedback system

### Publishing Services
- Three-tier publishing plans:
  - Basic: Paperback only
  - Premium: Paperback + E-book
  - Professional: Paperback + E-book + Audiobook
- Global distribution through multiple channels:
  - Paperbacks: Amazon, Flipkart, eBay, Meesho
  - E-books: Google Play Books, Apple Books
  - Audiobooks: Audible, iTunes

### E-commerce System
- Book browsing and discovery
- Shopping cart functionality
- Checkout process
- Order management
- Payment processing with Stripe

### Analytics Dashboard
- Sales tracking
- Reader demographics
- Performance metrics
- Revenue analysis

## Workflow Process

### Reader Workflow
1. Browse books in the bookstore
2. Add books to cart
3. Complete checkout process
4. Access purchased books

### Author Workflow
1. Register/login to author account
2. Select a publishing plan
3. Upload and edit manuscript
4. Submit for publishing
5. Track progress in author dashboard
6. Monitor sales and analytics

### Admin Workflow
1. Manage users and manuscripts
2. Review and process publishing requests
3. Manage book inventory
4. Monitor platform performance

## API Endpoints

### Authentication
- `POST /api/register`: Register a new user
- `POST /api/login`: Login existing user
- `POST /api/logout`: Logout user
- `GET /api/user`: Get current user information

### Manuscripts
- `GET /api/manuscripts`: Get user's manuscripts
- `GET /api/manuscripts/:id`: Get specific manuscript
- `POST /api/manuscripts`: Create new manuscript
- `PUT /api/manuscripts/:id`: Update manuscript
- `DELETE /api/manuscripts/:id`: Delete manuscript

### Books
- `GET /api/books`: Get all books
- `GET /api/books/:id`: Get specific book
- `GET /api/books/:id/reviews`: Get book reviews
- `GET /api/author/books`: Get author's published books
- `POST /api/books`: Create new book (admin)
- `PUT /api/books/:id`: Update book (admin)
- `DELETE /api/books/:id`: Delete book (admin)

### Orders
- `GET /api/orders`: Get user's orders
- `POST /api/orders`: Create new order
- `GET /api/orders/:id`: Get specific order

### Payment
- `POST /api/create-payment-intent`: Create Stripe payment intent

## Third-Party Integrations

### Stripe
- Payment processing for book purchases and publishing services
- Integration through `/api/create-payment-intent` endpoint
- Configured with environment variables:
  - `STRIPE_SECRET_KEY`: Server-side secret key
  - `VITE_STRIPE_PUBLIC_KEY`: Client-side public key

### Distribution Platforms
- Integration with multiple publishing and distribution channels
- APIs configured for Amazon, Google Play, Apple Books, etc.

## Development and Deployment

### Development
- Run `npm run dev` to start development server
- Server runs on port 5000
- Client and server are served from the same port in development

### Deployment
- Build with `npm run build`
- Production-ready assets in `dist` directory
- Configured for deployment on Replit