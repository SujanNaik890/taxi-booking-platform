# Premium Taxi Booking Platform

A complete production-ready full-stack taxi booking platform designed for a local owner-operator taxi service. Customers can submit booking requests for city pickups, airport transfers, and outstation trips, receive manual price quotations, and make secure advance payments via Razorpay. It includes an Admin Dashboard for booking tracking, pricing quotes, route management, and customer reviews moderation.

---

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot (Java 21/25)
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **Database**: MongoDB Atlas via Spring Data MongoDB
- **Integrations**: Razorpay Java SDK (for payment verification)

### Frontend
- **Framework**: React (Vite-based)
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS (with custom premium color palettes and glassmorphic designs)
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

---

## 📂 Project Structure

```
taxi-booking-platform/
├── backend/                  # Spring Boot Backend
│   ├── src/main/java/        # Java Source code
│   ├── src/main/resources/   # Configuration (application.yml)
│   ├── pom.xml               # Maven dependencies
│   └── mvnw / mvnw.cmd       # Maven wrapper
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/       # Shared UI (Navbar, Footer, RouteGuard)
│   │   ├── pages/            # View pages (Home, Booking, Checkout, Dashboard)
│   │   └── services/         # API Client configurations
│   ├── package.json          # Dependencies
│   └── tailwind.config.js    # Custom branding themes
└── README.md                 # Setup & configuration instructions
```

---

## 🔑 Default Credentials & Database Seeding

On the first application startup, the backend automatically seeds the database with the following details if collections are empty:
- **Admin Portal Username**: `admin`
- **Admin Portal Password**: `AdminPassword123` *(Securely hashed with BCrypt)*
- **Destinations**: Prepopulated with 7 popular locations: Ooty, Guruvayur, Mysuru, Coorg, Wayanad, Chikmagalur, and Mangalore.
- **Reviews**: Seeded with 3 approved mock customer testimonials.

---

## ⚙ Configuration & Environment Variables

### 1. Backend Configuration (`backend/src/main/resources/application.yml`)
Configure the following properties (either directly or via env variables):
```yaml
server:
  port: ${PORT:8080}

spring:
  data:
    mongodb:
      uri: ${MONGODB_URI:mongodb://localhost:27017/taxi_booking}

jwt:
  secret: ${JWT_SECRET:dGhpcy1pcy1hLXNlY3JldC1rZXktZm9yLWp3dC10b2tlbi1nZW5lcmF0aW9uLWZvci10YXhpLWJvb2tpbmctcGxhdGZvcm0=}
  expiration: ${JWT_EXPIRATION:86400000} # 24 Hours in ms

razorpay:
  key:
    id: ${RAZORPAY_KEY_ID:rzp_test_mockKeyId123}
    secret: ${RAZORPAY_KEY_SECRET:mockKeySecret456}

driver:
  phone: ${DRIVER_PHONE:919876543210}
```

### 2. Frontend Configuration (`frontend/.env`)
Create a `.env` file inside the `frontend/` directory:
```env
VITE_API_URL=http://localhost:8080/api
VITE_DRIVER_PHONE=919876543210
VITE_RAZORPAY_KEY_ID=rzp_test_mockKeyId123
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```
*Note: If no Google Maps API Key is provided, the location inputs will automatically fallback to standard text fields without crashing.*

---

## 🚀 Setup & Execution Guide

### Prerequisites
- **Java SE Development Kit**: JDK 21 or later
- **Node.js**: v18.0.0 or later (with npm v9.0.0 or later)
- **MongoDB**: A running local MongoDB instance or a MongoDB Atlas cluster URI.

### Step 1: Start the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set your environment variables (e.g. `MONGODB_URI`) or rely on the defaults for local testing.
3. Run the Spring Boot application using Maven:
   - **Windows**:
     ```cmd
     mvnw.cmd spring-boot:run
     ```
   - **Mac/Linux**:
     ```bash
     ./mvnw spring-boot:run
     ```
4. The API will start on `http://localhost:8080`.

### Step 2: Start the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. The website will be available at `http://localhost:5173`.
5. Access the Admin Panel at `cn`.

---

## 🔌 API Endpoints Summary

### Authentications (Public)
- `POST /api/auth/login` - Authenticate admin credentials and retrieve JWT token.

### Bookings (Public / Admin Mixed)
- `POST /api/bookings` - Submit a new booking request (status = `PENDING`).
- `GET /api/bookings/{id}` - Publicly query detailed booking status (Pending, Quoted, Confirmed).
- `GET /api/bookings` - *(Admin)* Fetch all bookings (supports status filter and regex search).
- `PUT /api/bookings/{id}` - *(Admin)* Update booking status, details, or input quotation pricing.
- `DELETE /api/bookings/{id}` - *(Admin)* Delete booking records.
- `GET /api/bookings/stats` - *(Admin)* Retrieve metrics (Total, Pending, Confirmed, Completed).

### Razorpay Payments (Public)
- `POST /api/bookings/{id}/payment/order` - Generate a Razorpay order ID for quoted rides.
- `POST /api/bookings/{id}/payment/verify` - Validate signatures and change status to `CONFIRMED`.

### Destinations (Public / Admin Mixed)
- `GET /api/destinations` - Retrieve all travel routes.
- `POST /api/destinations` - *(Admin)* Create a new route.
- `PUT /api/destinations/{id}` - *(Admin)* Update details of an existing route.
- `DELETE /api/destinations/{id}` - *(Admin)* Remove a destination.

### Reviews (Public / Admin Mixed)
- `GET /api/reviews` - Fetch approved customer testimonials.
- `POST /api/reviews` - Submit feedback for driver moderation (approved = `false`).
- `GET /api/reviews/admin` - *(Admin)* Retrieve all submitted reviews.
- `PUT /api/reviews/{id}/approve` - *(Admin)* Approve a customer testimonial.
- `DELETE /api/reviews/{id}` - *(Admin)* Delete a review.
