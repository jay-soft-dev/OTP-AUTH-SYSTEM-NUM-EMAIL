# OTP Authentication System (SMS & Email)

A full-stack, secure OTP Authentication System built with Node.js, Express, and JWT. It supports real-time OTP dispatch via **Fast2SMS** for mobile numbers and **Nodemailer** for email addresses.

---

## 🚀 Features

* **Multi-Channel Delivery:** Dynamically detects input and sends OTP via SMS (Fast2SMS) or Email (Nodemailer).
* **JWT Token Generation:** Generates a secure JSON Web Token upon successful verification.
* **OTP Expiration:** Automatic expiration of OTP after 5 minutes.
* **Input Validation:** Strict regex verification for 10-digit Indian mobile numbers and valid email formats.
* **CORS Enabled:** Ready for frontend integration (React, Vue, or Vanilla JS).

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Authentication:** JSON Web Tokens (`jsonwebtoken`)
* **Integrations:** `axios` (Fast2SMS API), `nodemailer` (Gmail SMTP)
* **Environment Management:** `dotenv`

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/jay-soft-dev/OTP-AUTH-SYSTEM-NUM-EMAIL.git](https://github.com/jay-soft-dev/OTP-AUTH-SYSTEM-NUM-EMAIL.git)
   cd OTP-AUTH-SYSTEM-NUM-EMAIL
