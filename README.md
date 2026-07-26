# PharmaSync

**A B2B pharmaceutical supply chain platform for the Indian market — connecting retailers, distributors, and admins with trust, safety, and sustainability at its core.**

🔗 **Live App:** [pharmasync-app.netlify.app](https://pharmasync-app.netlify.app)
🔗 **Backend API:** [pharmasync-backend-j9dw.onrender.com](https://pharmasync-backend-j9dw.onrender.com)

---

## About the Project

Most pharmaceutical platforms in India (1mg, PharmEasy, Apollo 24/7) are built for **B2C** medicine delivery. PharmaSync takes a different approach — it's a **B2B network** for the retailer–distributor relationship, built around two problems the existing apps don't solve together:

1. **Trust** — fake prescriptions and unverified medicine batches contribute to antimicrobial resistance and counterfeit risk.
2. **Waste** — near-expiry stock is often destroyed instead of redistributed, leading to significant financial and medical loss.

PharmaSync addresses both with a unified platform for **verification, safety, and sustainability**.

## Key Features

| Feature | Description |
|---|---|
| **Multi-role access** | Separate dashboards for Retailer, Distributor, and Admin |
| **Prescription Verification** | Upload and track Rx verification status before dispensing |
| **AI Drug Safety Checker** | Groq-powered interaction and dosage-caution checks |
| **Near-Expiry Redistribution Marketplace** | Retailers list soon-to-expire stock at a discount instead of discarding it |
| **Voice Ordering** | Hands-free product search using the Web Speech API |
| **Emergency Stock Locator** | Quickly find critical medicines in stock |
| **Expiry Alerts** | Automatic flagging of stock nearing expiry |
| **Order Management** | Cart, checkout, order history, and invoices |

## Tech Stack

**Frontend:** HTML, CSS, JavaScript (vanilla)
**Backend:** Node.js, Express.js
**Database:** TiDB Cloud (MySQL-compatible)
**AI:** Groq API (Llama 3.1)
**Auth:** JWT + bcrypt
**Deployment:** Netlify (frontend) · Render (backend)

## Project Structure

```
pharmasync/
├── frontend/          # HTML/CSS/JS client
│   ├── css/
│   ├── js/
│   └── *.html
└── backend/           # Node + Express API
    ├── config/        # Database connection
    ├── models/        # Table schemas + queries
    ├── routes/        # API endpoints
    ├── controllers/   # Business logic
    ├── middleware/     # JWT auth
    └── server.js
```

## Getting Started Locally

### Backend
```bash
cd backend
npm install
# Create a .env file — see .env.example for required variables
node setup.js       # creates database tables
node server.js
```

### Frontend
Open `frontend/index.html` with a local server (e.g. VS Code Live Server).

## Environment Variables

See `backend/.env.example` for the full list, including TiDB Cloud credentials, JWT secret, and Groq API key.

## Author

**Diya Gor** — B.Tech Computer Science & AI, Parul University
[GitHub](https://github.com/diyagor39) · [LinkedIn](https://linkedin.com/in/diya-gor-86b722305)

---

*Built as a full-stack learning project exploring role-based access control, third-party AI integration, and real-world B2B commerce workflows.*
