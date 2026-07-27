# AI-First Test DNA — Python FastAPI + MongoDB REST API Backend

Python RESTful API backend service built with **FastAPI**, **PyMongo**, and **MongoDB** for managing Projects, Subprojects, and Environment Endpoints.

---

## 🛠️ Tech Stack

- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **Database**: MongoDB (via PyMongo)
- **Validation**: Pydantic v2
- **Frontend**: React + TypeScript + Vite

---

## 🚀 Getting Started

### Prerequisites

- [Python 3.10+](https://www.python.org/downloads/)
- [MongoDB](https://www.mongodb.com/) running locally (`mongodb://localhost:27017`) or a MongoDB Atlas Connection String.

### Installation

Navigate to the `Backend` folder and install Python dependencies:

```bash
cd Backend
pip install -r requirements.txt
```

### Environment Configuration

Create or update `.env` in the `Backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=ai_first_dna
```

### Running the Server

Start the Uvicorn development server with auto-reload:

```bash
python main.py
```

Or using Uvicorn directly:

```bash
uvicorn main:app --reload --port 5000
```

The REST API server will run on `http://localhost:5000`.

### Interactive API Documentation (Swagger / OpenAPI)

FastAPI automatically generates interactive API documentation available at:
- **Swagger UI**: [http://localhost:5000/docs](http://localhost:5000/docs)
- **ReDoc**: [http://localhost:5000/redoc](http://localhost:5000/redoc)

---

## 📡 REST API Endpoints (CRUD)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | API service health check & status |
| `GET` | `/api/projects` | Fetch all projects & embedded subprojects |
| `GET` | `/api/projects/{project_id}` | Fetch a single project by ID |
| `POST` | `/api/projects` | Create a new main project |
| `PUT` | `/api/projects/{project_id}` | Update project details |
| `DELETE` | `/api/projects/{project_id}` | Delete a project |
| `POST` | `/api/projects/{project_id}/subprojects` | Create a subproject under a parent project |
| `DELETE` | `/api/projects/{project_id}/subprojects/{subproject_id}` | Delete a subproject |

---

## 🗄️ MongoDB Document Schema

### Collection: `projects`

```json
{
  "id": "ENTERPRISE_BANKING",
  "name": "Enterprise Banking Platform",
  "desc": "Core ledger and transaction testing solution.",
  "icon": "account_balance",
  "category": "FinTech & Banking",
  "tags": ["Core", "API", "Web"],
  "subProjects": [
    {
      "id": "ENTERPRISE_BANKING_MOBILE",
      "name": "Mobile App Workspace",
      "desc": "iOS and Android banking test suite.",
      "icon": "smartphone",
      "type": "Mobile App (iOS/Android)",
      "urls": [
        { "env": "Dev", "url": "https://dev-mobile.bank.com" },
        { "env": "Staging", "url": "https://stage-mobile.bank.com" }
      ],
      "createdAt": "2026-07-27T14:25:00.000Z"
    }
  ],
  "createdAt": "2026-07-27T14:20:00.000Z",
  "updatedAt": "2026-07-27T14:25:00.000Z"
}
```
