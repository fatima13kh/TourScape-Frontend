# 🧳 Curated Travel Experiences

## 📘 Project Overview
**TourScape:** Tourscape is a comprehensive travel booking platform connecting travelers with professional tour companies. Multiple travel companies can showcase their curated itineraries, adventure packages, cultural tours, and relaxation getaways, while customers can browse, compare, and book their ideal travel experiences.

---

## 🚀 Key Features
### 👤 For Travel Companies
- Create and manage travel packages with detailed itineraries, accommodations, activities, and pricing.
- Monitor bookings and manage customer reservations.

### 🌍 For Customers
- Explore diverse travel experiences filtered by theme, destination, and budget.
- View detailed package information and book experiences easily.

### ⚙️ Platform Capabilities
- Role-based access for travelers and companies.
- Secure authentication and authorization.
- Package browsing, filtering, and booking management.
- Company profile pages showcasing their travel offerings.

---

## 🛠️ Technologies Used
- **Frontend:** React, Vite  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose  
- **Authentication:** JWT (JSON Web Token)  

---

## 🧩 User Stories

### 👤 **Epic 1: User Authentication & Roles**

#### **1.1 – Customer Registration**
As a **customer**, I want to **create an account** so that I can **save my information and book travel packages securely**.

**Acceptance Criteria:**
- Customer can sign up with name, email, password, and Phone Number.  
- System validates email uniqueness.  
- Passwords are encrypted before storage.  
- Upon success, user receives a confirmation or JWT token.

---

#### **1.2 – Travel Company Registration**
As a **travel company**, I want to **register my company on the platform** so that I can **offer my travel packages to potential customers**.

**Acceptance Criteria:**
- Company provides company name, email, password, and Phone Number.  
- Password is stored securely (hashed).  
- Role is automatically assigned as “company.”  
- The company can log in immediately after registration.

---

#### **1.3 – User Login**
As a **registered user (traveler or company)**, I want to **log in securely** so that I can **access my personalized dashboard**.

**Acceptance Criteria:**
- Login supports both traveler and company accounts.  
- System returns a JWT token on success.  
- Invalid credentials show a proper error message.

---


### 🌍 **Epic 2: Travel Package Management**

#### **2.1 – Create Travel Package**
As a **travel company**, I want to **create a new travel package** so that **travelers can view and book it**.

**Acceptance Criteria:**
- Company can enter title, destination, description, price, itinerary, and available dates.  
- System validates required fields.  
- Package is linked to the company account.  
- Package is visible on the main listing page.

---

#### **2.2 – Edit Travel Package**
As a **travel company**, I want to **update details of my packages** so that **I can correct or improve my offerings**.

**Acceptance Criteria:**
- Company can edit any field of their own packages.  
- System prevents editing packages owned by other companies.  
- Updates reflect immediately in traveler views.
- Company cannot delete the booking after  payment. (extra)

---

#### **2.3 – Delete Travel Package**
As a **travel company**, I want to **delete outdated or inactive packages** so that **my listings stay up-to-date**.

**Acceptance Criteria:**
- Only the company that created the package can delete it.  
- Associated bookings remain stored for record-keeping.  
- Package disappears from traveler browsing lists.

---

#### **2.4 – View Company’s Packages**
As a **travel company**, I want to **see all my existing packages in one dashboard** so that **I can manage them efficiently**.

**Acceptance Criteria:**
- Displays all packages owned by the logged-in company.  
- Shows summary info (title, destination, bookings count).  
- Offers quick edit and delete actions.

---

### 🧭 **Epic 3: Customer Experience & Booking**

#### **3.1 – Browse Packages**
As a **traveler**, I want to **browse available travel packages** so that **I can explore different travel options**.

**Acceptance Criteria:**
- Customers see all active packages.  
- Each package displays image, price, destination, and short description.  
- Supports pagination or infinite scrolling.

---

#### **3.2 – Filter & Search Packages**
As a **customer**, I want to **filter and search packages** by **destination, theme, or budget** so that **I can quickly find trips that match my preferences**.

**Acceptance Criteria:**
- Filters include: theme, destination, price range.  
- Search by package title or destination.  
- Results update dynamically.

---

#### **3.3 – View Package Details**
As a **customer**, I want to **view detailed information about a travel package** so that **I can make an informed decision before booking**.

**Acceptance Criteria:**
- Displays itinerary, accommodation, activities, and available dates.  
- Shows company name and contact info.  
- Option to proceed with booking.

---

#### **3.4 – Book a Package**
As a **customer**, I want to **book a travel package** by selecting my travel date and number of travelers so that **I can reserve my spot**.

**Acceptance Criteria:**
- Booking form includes date and traveler count.  
- Calculates total price automatically.  
- Saves booking in the database.  
- Traveler and company can view booking status.

---

#### **3.5 – Manage My Bookings**
As a **traveler**, I want to **view and manage my bookings** so that **I can track or cancel them if needed**.

**Acceptance Criteria:**
- Travelers can view all bookings with details.  
- Can cancel pending bookings (before confirmation).  
- Status updates reflect instantly.

---

### 📦 **Epic 4: Company Booking Management**

#### **4.1 – View Received Bookings**
As a **travel company**, I want to **see all bookings made for my packages** so that **I can confirm or manage reservations**.

**Acceptance Criteria:**
- Displays booking list with traveler name, package, and dates.  
- Allows updating status (Pending → Confirmed/Cancelled).  
- Filter bookings by package or status.

---

## 📅 Future Enhancements
- Admin dashboard for platform-wide analytics.  
- Reviews and ratings for travel packages.  
- Payment gateway integration.  
- Email and notification system for booking updates.

---

## 🧠 Author
**Developed by:** Abdulla Alsahi  
**Technologies:** React, Node.js, Express, MongoDB  
**Purpose:** Capstone project — showcasing full-stack development with real-world travel booking functionality.
