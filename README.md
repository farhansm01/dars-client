# Dars — Client

Dars is a simple Learning Management System (LMS). Students can browse courses and watch video lectures. Admins can manage courses and lectures from a protected dashboard.

## Tech Stack

- **Next.js 15** — App Router, React 19
- **TypeScript**
- **Tailwind CSS v4**
- **Better Auth** — email/password authentication + JWT
- **MongoDB** — via native driver
- **lucide-react** — icons

## Local Setup

### Prerequisites

- Node.js 18+
- A running MongoDB instance (local or Atlas)
- `dars-server` running on port 5000

### 1. Clone and install

```bash
git clone <repo-url>
cd dars-client
npm install
```

### 2. Create environment file

Create a `.env` file in the root:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=any_random_secret_string
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Seed the admin account

Run this once to create the admin user (`admin@dars.com` / `admin321`):

```bash
node scripts/seed-admin.mjs
```

### 4. Start the development server

```bash
npm run dev
```

App runs at `http://localhost:3000`

## Pages

| Route | Description |
|---|---|
| `/` | Home — course catalog |
| `/courses/[id]` | Course detail + video player |
| `/login` | Admin login |
| `/admin` | Admin dashboard — course & lecture management |

## Admin Login

```
Email:    admin@dars.com
Password: admin321
```
