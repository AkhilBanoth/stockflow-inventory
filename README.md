\# StockFlow – SaaS Inventory Management System



StockFlow is a multi-tenant SaaS inventory management application designed to help businesses manage products, monitor stock levels, and track inventory efficiently.



It provides secure authentication, organization-based data isolation, product management, and a dashboard for monitoring inventory.



\## 🚀 Live Demo



\- \*\*Frontend:\*\* https://frontend-blond-ten-80.vercel.app/login

\- \*\*Backend API:\*\* Deployed on Render

\- \*\*GitHub Repository:\*\* https://github.com/AkhilBanoth/stockflow-inventory



\## ✨ Features



\- \*\*User Authentication:\*\* Secure registration and login using JWT authentication.

\- \*\*Organization Management:\*\* Organization-based access and data isolation.

\- \*\*Product Management:\*\* Create, view, update, and delete products.

\- \*\*SKU Management:\*\* Unique product SKU within each organization.

\- \*\*Product Search:\*\* Search products using name or SKU.

\- \*\*Stock Management:\*\* Update available stock quantities.

\- \*\*Low Stock Tracking:\*\* Identify products that reach or fall below their configured stock threshold.

\- \*\*Dashboard:\*\* View inventory summaries and low-stock products.

\- \*\*Cloud Deployment:\*\* Frontend deployed on Vercel and backend deployed on Render.



\## 🛠️ Tech Stack



| Layer | Technology |

|---|---|

| Frontend | React, TypeScript |

| Build Tool | Vite |

| Backend | Python, FastAPI |

| Database | PostgreSQL |

| Database Hosting | Supabase |

| ORM | SQLAlchemy |

| Authentication | JWT |

| API Communication | Axios |

| Frontend Hosting | Vercel |

| Backend Hosting | Render |

| Version Control | Git and GitHub |



\## 🏗️ Architecture



```text

&#x20;                 User

&#x20;                  |

&#x20;                  v

&#x20;         React + TypeScript

&#x20;            (Vercel)

&#x20;                  |

&#x20;             Axios API

&#x20;                  |

&#x20;                  v

&#x20;            FastAPI Backend

&#x20;              (Render)

&#x20;                  |

&#x20;            JWT Authentication

&#x20;                  |

&#x20;                  v

&#x20;            SQLAlchemy ORM

&#x20;                  |

&#x20;                  v

&#x20;            PostgreSQL DB

&#x20;              (Supabase)

```



\## 📁 Project Structure



```text

stockflowmvp/

│

├── backend/

│   └── app/

│       ├── core/

│       ├── models/

│       ├── routes/

│       ├── schemas/

│       ├── services/

│       └── main.py

│

├── frontend/

│   ├── src/

│   │   ├── api/

│   │   ├── components/

│   │   └── pages/

│   ├── public/

│   ├── vercel.json

│   └── package.json

│

├── requirements.txt

├── README.md

└── .gitignore

```



\## ⚙️ Local Installation and Setup



\### 1. Clone the repository



```bash

git clone https://github.com/AkhilBanoth/stockflow-inventory.git

cd stockflow-inventory

```



\### 2. Backend Setup



Create and activate a virtual environment:



```bash

python -m venv venv

```



Windows PowerShell:



```powershell

.\\venv\\Scripts\\Activate.ps1

```



Install dependencies:



```bash

pip install -r requirements.txt

```



Create a `.env` file inside the backend folder and configure:



```env

DATABASE\_URL=your\_postgresql\_connection\_string

SECRET\_KEY=your\_secret\_key

```



Start the backend:



```bash

cd backend

uvicorn app.main:app --reload

```



Backend API:



`http://127.0.0.1:8000`



Swagger API Documentation:



`http://127.0.0.1:8000/docs`



\### 3. Frontend Setup



Open another terminal:



```bash

cd frontend

npm install

```



Create a `.env` file inside the frontend folder:



```env

VITE\_API\_BASE\_URL=http://127.0.0.1:8000

```



Start the frontend:



```bash

npm run dev

```



Frontend URL:



`http://localhost:5173`



\## 🔗 API Endpoints



| Method | Endpoint | Description |

|---|---|---|

| POST | `/auth/register` | Register a new user |

| POST | `/auth/login` | Authenticate user |

| GET | `/auth/me` | Get current user |

| GET | `/products/` | List products |

| POST | `/products/` | Create product |

| PUT | `/products/{id}` | Update product |

| DELETE | `/products/{id}` | Delete product |

| PATCH | `/products/{id}/stock` | Update stock |

| GET | `/dashboard/summary` | Get dashboard summary |



\## 🔐 Security



\- JWT-based authentication.

\- Protected API endpoints.

\- Password-based user authentication.

\- Organization-scoped inventory access.

\- Environment variables for sensitive configuration.

\- CORS configuration for frontend-backend communication.



\## 🧪 Testing



The backend test suite contains 12 passing tests from the development process.



Frontend production build verified using:



```bash

npm run build

```



\## 🌐 Deployment



\- \*\*Frontend:\*\* Vercel

\- \*\*Backend:\*\* Render

\- \*\*Database:\*\* Supabase PostgreSQL



\## 🎯 Project Objective



The main objective of StockFlow is to simplify inventory management for small businesses by providing a secure, scalable, and user-friendly platform to manage products and monitor stock levels.



\## 👨‍💻 Developer



\*\*Banoth Akhil\*\*



\- GitHub: \[AkhilBanoth](https://github.com/AkhilBanoth)

\- Project: \[StockFlow Inventory](https://github.com/AkhilBanoth/stockflow-inventory)



\---



⭐ If you find this project useful, consider giving it a star on GitHub.

