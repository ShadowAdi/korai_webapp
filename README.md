🧪 Korai Health Web App

A simple, functional web app where users can upload lab report images and instantly see health parameters extracted into a clean, interactive dashboard.Built for the Korai Health assignment — focused on usability, clean design, and real-world workflows.

Repository: [https://github.com/ShadowAdi/korai_webapp](https://github.com/ShadowAdi/korai_webapp)

✨ Features

Smooth, user-friendly image upload (no PDF support yet)

OCR text extraction using Tesseract.js

Clean, responsive dashboard built with Tailwind CSS

View, query, and filter extracted health parameters

Simple auth flow: register, login, logout

Protected routes: only logged-in users can upload or see dashboard

Toast notifications, loading states, and clear UX

Data stored securely using Prisma & Neon (PostgreSQL)

Bonus: basic trends and flagging abnormal values

🛠 Tech Stack

Next.js (App Router + API routes)

Tailwind CSS for styling

Prisma ORM & Neon for database

Tesseract.js for OCR

React Hook Form + Zod for form validation

React Toastify & React Spinners for UX

JWT & bcrypt for authentication

Recharts for trends visualization

📦 Install & Run Locally

```
# Clone the repo
git clone https://github.com/ShadowAdi/korai_webapp
cd korai_webapp

# Install dependencies
npm install

# Set environment variables
# (See .env.example if provided)

# Push schema & start dev server
npx prisma db push
npm run dev
```

Visit http://localhost:3000

⚙️ Next Steps & Improvements

Add PDF upload support

Improve OCR accuracy (possible Google Vision integration)

More advanced AI insights

Better user roles & permissions

Mobile UX polish

🙏 Thanks

Built as part of the Korai Health assignment to demonstrate:

Practical problem solving

Modern full-stack development (frontend + backend)

Clean code, security, and good UX

# **Images are in the *demo* folder**
