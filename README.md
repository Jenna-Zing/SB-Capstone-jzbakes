# SB-Capstone-jzbakes
Springboard SE Bootcamp - Capstone backend

# Capstone Project

A full-stack e-commerce application built with React, Node.js, Express, PostgreSQL, and Stripe. This project features a secure checkout flow with custom Stripe payment integration, user authentication, and order management.

## Tech Stack

-   **Frontend**: React, Vite, TailwindCSS, ShadCN, Stripe Elements
-   **Backend**: Node.js, Express, PostgreSQL, Stripe SDK
-   **Payment**: Stripe Payment Intents & Webhooks

## Installation

### Prerequisites

-   Node.js & npm
-   PostgreSQL
-   Stripe Account & CLI (for local webhook testing)

### 1. Setting up the repository

-   Create the `Capstone_project` directory (`mkdir Capstone_project`)
-   Inside the Capstone_project directory, create the `server` and `client` directories (`mkdir server client`)
-   clone client repository (`git clone https://github.com/Jenna-Zing/SB-Capstone-jzbakes-fe-react-vite`)
-   clone server repository (`git clone https://github.com/Jenna-Zing/SB-Capstone-jzbakes`)

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

### 4. Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=8080
DB_URI=postgresql://user:password@localhost:5432/your_db_name
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the `client` directory:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:8080/api
```

### 5. Database Setup

Ensure PostgreSQL is running and your database is created. Run the migration to create the payments table:

```sql
-- In your SQL tool or terminal
CREATE TABLE IF NOT EXISTS stripePayments (
    id SERIAL PRIMARY KEY,
    stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Usage

### 1. Start the Backend Server

```bash
cd server
npm run dev
# Server runs on http://localhost:8080
```

### 2. Start the Frontend Client

```bash
cd client
npm run dev
# client runs on http://localhost:5173
```

### 3. Listen for Stripe Webhooks (Local Development)

To test payment confirmation locally, you must forward Stripe events to your local server:

```bash
stripe listen --forward-to localhost:8080/api/stripe/webhook
```

Then, copy the **Webhook Signing Secret** (`whsec_...`) from the terminal output and paste it into your `server/.env` or `stripeController.ts` file.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
