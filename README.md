# Haseen Studio

Production-oriented MERN storefront and admin dashboard for a luxury girls embroidered dresses brand with in-house factory and embroidery capabilities.

## Stack

- Frontend: React, Vite, React Router, Axios, Framer Motion, CSS Modules
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, bcrypt, httpOnly cookies
- Uploads: Cloudinary

## Project structure

```text
backend/
  src/
    config/
    middlewares/
    modules/
      auth/
      product/
      upload/
    utils/
    app.js
    server.js

frontend/
  src/
    assets/
    components/
    context/
    hooks/
    pages/
    routes/
    services/
    styles/
```

## Environment setup

Create these files before running the app:

1. `backend/.env`
   Use `backend/.env.example` as the template.
2. `frontend/.env`
   Use `frontend/.env.example` as the template.

### Backend variables

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hs-fashion
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_NAME=Haseen Studio Admin
ADMIN_EMAIL=admin@haseenstudio.com
ADMIN_PASSWORD=ChangeMe123!
WHATSAPP_NUMBER=923000000000
```

### Frontend variables

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=923000000000
VITE_BRAND_NAME=Haseen Studio
```

## Install and run

From the repo root:

```bash
npm install
npm run dev
```

This starts:

- Backend on `http://localhost:5000`
- Frontend on `http://localhost:5173`

## Core features

- Luxury storefront with premium home page sections and animated transitions
- Shop page with live search, sorting, category filters, season filters, and collection filters
- Product details page with multi-image gallery, related products, WhatsApp order, and inquiry actions
- Admin-only authentication with JWT cookies
- Protected admin dashboard with statistics
- Product CRUD with Cloudinary image uploads
- Mongo-backed featured products, new arrivals, and live suggestion dropdown

## API overview

### Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Products

- `GET /api/products`
- `GET /api/products/search`
- `GET /api/products/suggestions`
- `GET /api/products/featured`
- `GET /api/products/new-arrivals`
- `GET /api/products/:slug`
- `GET /api/products/id/:id`
- `GET /api/products/admin/stats`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Uploads

- `POST /api/uploads`

## Notes

- The backend auto-creates the first admin account from `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` if no admin exists yet.
- Product images are uploaded to Cloudinary and only the returned URLs are stored in MongoDB.
- The storefront gracefully falls back to editorial content blocks when featured or seasonal products have not been added yet.
