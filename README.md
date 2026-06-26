# Service Vault (HomeServ-Web)

Web client for **Service Vault**, an all-in-one job management platform for service trades. The app covers the full business workflow—from booking jobs and dispatching technicians to inventory, accounting, outbound marketing, and payments—with dedicated experiences for office staff, field technicians, and management users.

## Features

### Office portal (`/app/*`)

| Module | Capabilities |
|--------|----------------|
| **Dashboard** | Operational overview with charts and map views |
| **Book a Job** | Job booking and customer management |
| **Call Tracking** | Inbound call tracking and attribution |
| **Job Search** | Search and inspect past, current, and future jobs |
| **Dispatching** | Scheduler and map-based technician dispatch |
| **Price Book** | Services, categories, tasks, materials, utilities, margin matrix, option templates |
| **Inventory** | Products, categories, trucks, suppliers, templates, reporting |
| **Reports** | Jobs, sales, quotes, CSR, marketing, timesheets, invoices, and more |
| **Accounting** | Purchase orders and accounts receivable |
| **Outbound** | Quotes, email marketing, SMS campaigns, credits |
| **Payments** | Payment processing (Stripe integration) |
| **Settings** | Users, fleet, discounts, invoice templates, compliance documents |
| **Quick Setup** | Organisation onboarding (industries, tags, roles, teams, lead sources) |
| **Integrations** | Xero, MYOB, QuickBooks, WildJar, Square, Twilio, Reece inventory |

### Technician portal

Field workflow for technicians: dashboard, job list, estimates, travel/work tracking, notes, purchase orders, payments, compliance documents, fleet, and timesheets.

### Management portal

High-level management dashboard with aggregated metrics and map views.

### Public site

Landing page, registration, login, password recovery, and support contact flows.

### Internationalization

UI strings are loaded via **i18next** from `public/assets/locales/`. Supported languages include Arabic, Chinese, English, Spanish, German, Marathi, and Urdu.

## Tech stack

- **React 17** with **Create React App** and **CRACO** (`craco-less` for Ant Design theming)
- **React Router v5** for routing
- **Ant Design 4** for UI components
- **DevExtreme** for data grids
- **Axios** for HTTP (via `BaseApiService`)
- **i18next** / **react-i18next** for translations
- **Stripe**, **SendGrid**, Google Maps, **react-big-scheduler**, and other supporting libraries (see `package.json`)

## Prerequisites

- **Node.js** 16+ (LTS recommended)
- **npm** (project uses `package-lock.json`)
- A running **Service Vault API** backend (required for most functionality)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and set values as needed:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `REACT_APP_ENV` | Target environment: `development`, `staging`, `production`, or `bilaldev` |
| `REACT_APP_SENDGRID_API_KEY` | SendGrid API key (if client-side email helpers are enabled) |
| `REACT_APP_MAPBOX_TOKEN` | Mapbox token for dashboard map components |

API base URLs and OAuth callback URLs are defined per environment in `src/Environment.js`.

### 3. Start the dev server

```bash
# Staging API (default for `npm start`)
npm start

# Local API at http://localhost:8000
npm run dev

# Staging (explicit)
npm run staging

# Production API
npm run prod
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Available scripts

| Script | Description |
|--------|-------------|
| `npm start` | Dev server against **staging** API |
| `npm run dev` | Dev server against **local** API (`localhost:8000`) |
| `npm run staging` | Same as `npm start` |
| `npm run prod` | Dev server against **production** API |
| `npm run billi` | Local dev with `bilaldev` environment profile |
| `npm run build` | Production build (staging env by default; uses increased Node heap) |
| `npm test` | Run tests in watch mode |
| `npm run eject` | Eject CRA config (one-way; generally avoid) |

## Project structure

```
src/
├── App.js                 # Root app, layout routing by role
├── Routes.js              # Route definitions (public, website, technician, management)
├── Environment.js         # Per-environment API URLs and integration config
├── Pages/
│   ├── App/               # Office portal pages
│   ├── Public/            # Landing, auth, errors
│   ├── Technician/        # Field technician portal
│   └── Management/          # Management dashboard
├── Layout/                # Web, Technician, Management, and Public layouts
├── Services/
│   ├── API/               # API service modules
│   ├── AuthService.js     # Auth token and session helpers
│   └── BaseApiService.js  # Shared Axios request layer
├── Components/            # Shared UI (uploaders, grids, forms)
├── Store/                 # React Context and reducers
├── Data/                  # Navigation menu and static data
├── Lib/                   # Form, loader, and utility helpers
└── assets/                # Styles, icons, images

public/
└── assets/locales/        # i18n translation JSON files
```

Path aliases are configured in `jsconfig.json` with `baseUrl` set to `./src`, so imports like `Services/AuthService` resolve without relative paths.

## Authentication and layouts

After login, the app selects a layout based on the user role:

- **Office users** → `WebLayout` with `/app/*` routes
- **Technicians** → `TechnicianLayout`
- **Management users** → `ManagementLayout`
- **Unauthenticated** → `PublicLayout`

Session state (token, user, organisation, technician/officer context) is held in React Context and `localStorage` via `AuthService`.

## API integration

All API calls go through `BaseApiService`, which attaches the auth token and targets the base URL from `Environment.js`:

| `REACT_APP_ENV` | API base URL |
|-----------------|--------------|
| `development` / `bilaldev` | `http://localhost:8000` |
| `staging` | `https://api-stg.servicevault.com` |
| `production` | `https://api.servicevault.com` |

Default API version path: `/v1`.

## Building for production

```bash
npm run build
```

Output is written to the `build/` folder. For a production-targeted build, set `REACT_APP_ENV=production` when invoking the build command (the default `build` script currently uses the staging environment).

## Related links

- Marketing site: [servicevault.com](https://www.servicevault.com)
- Production app: [app.servicevault.com](https://app.servicevault.com)

## License

Private — not for public distribution.
