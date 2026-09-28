# QuickDrop

Share Anything. Anywhere. Instantly.
Send files or text with a simple 4-digit code. No complicated setup.

## Features

- **File Upload:** Upload any file up to 100MB
- **Text Sharing:** Directly paste and share text
- **4-Digit Code:** Get a simple, unique 4-digit code
- **Secure Retrieval:** Download or copy your shared content using the code on any device
- **Auto-Expiration:** Content expires automatically after 30 minutes
- **Rate Limiting:** Protects against abuse and brute-forcing
- **Premium UI:** Glassmorphism, smooth animations, fully responsive design

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Next.js API Routes (Route Handlers)
- **Database:** PostgreSQL via Prisma ORM
- **Storage:** Local file system fallback for development (Uploads to `uploads/` directory)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root of the project:

```bash
cp .env.example .env
```

Ensure your `DATABASE_URL` is configured for your PostgreSQL database.

### 3. Database Setup (Prisma)

Run the Prisma migrations to set up the schema:

```bash
npx prisma migrate dev --name init
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Build

### 1. Build the Application

```bash
npm run build
```

### 2. Start the Production Server

```bash
npm start
```

## Security & Storage Notes

- **File Storage:** By default, files are saved in the `uploads/` directory locally. In a real production deployment on Vercel or AWS, you should replace the functions in `lib/storage.ts` with AWS S3 or a similar blob storage.
- **Security:** There are basic IP-based rate limits in `lib/rate-limit.ts` to prevent brute forcing of the 4-digit codes. Files are verified for size limits before processing.
