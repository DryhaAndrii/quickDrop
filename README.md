Demo: https://quick-drop-client-rho.vercel.app/

# QuickDrop



A web application for uploading and sharing files, using two backend servers:
- **Small API** — handles small files (hosted on a public server)
- **Big API** — handles large files (runs locally and accessed via a tunnel)

---

## 🚀 Project Setup

### 🧩 Clone the Repository
```bash
git clone https://github.com/DryhaAndrii/quickDrop.git
  ```
```bash
cd quickdrop
  ```



---

## 🧪 Running the Frontend (Client)

### 1. Install Dependencies

```bash
cd client
  ```
```bash
npm install
  ```


### 2. Create Environment File

Create a `.env` file in the `client` folder.

#### Development Mode

NEXT_PUBLIC_SMALL_API_URL=http://localhost:3002
NEXT_PUBLIC_BIG_API_URL=https://sdb9bgs6-3002.euw.devtunnels.ms/

- NEXT_PUBLIC_SMALL_API_URL: your local backend (Small API)
- NEXT_PUBLIC_BIG_API_URL: VS Code remote tunnel URL to your local backend (Big API)

Make sure your local server is running on port 3002 and you’ve opened the tunnel using VS Code Tunnels.

#### Production Mode

NEXT_PUBLIC_SMALL_API_URL=https://someBackend.com
NEXT_PUBLIC_BIG_API_URL=https://qwhosle-pzroqvesn-qmulslexts.ngrok-free.app/

- NEXT_PUBLIC_SMALL_API_URL: deployed backend (for small files)
- NEXT_PUBLIC_BIG_API_URL: public ngrok tunnel to your local backend (for large files)

---

## 🖥️ Running the Backend (Server)

### 1. Install Dependencies
```bash
cd server
  ```
```bash
npm install
  ```

### 2. Create `.env` File

DB_URL=postgres://postgres:0000@localhost:5432/postgres
DB_NAME=quickDropDB

### 3. Start PostgreSQL

Ensure PostgreSQL is running locally. You can either:
- Create the database manually (named `quickDropDB`)
- Or run the script:
- 
```bash
npm run createDB
  ```

### 4. Environment Modes

- `.env.development` — used when developing the backend locally
- `.env.production` — used when the backend is built and accessed remotely via tunnel

---

## 🌐 Exposing the Backend with Ngrok (for Big API)

This allows a remote (e.g., deployed) frontend to upload large files to your local backend.

### Steps:

1. Log in to https://dashboard.ngrok.com
2. Get your auth token
3. Run:
```bash
ngrok config add-authtoken <your-token>
  ```

4. Start the tunnel:
```bash
npm run tunnel
  ```

This will expose port 3002 to the internet (e.g., https://xyz123.ngrok-free.app)

5. Build and start the backend:
```bash
npm run build
  ```
```bash
npm run start:prod
  ```


---

## 🌍 Environment Variable Summary

| Variable                      | Description                                  | Dev Example                                 | Prod Example                                     |
|------------------------------|----------------------------------------------|---------------------------------------------|--------------------------------------------------|
| NEXT_PUBLIC_SMALL_API_URL    | Public or local backend for small files      | http://localhost:3002                       | https://quickdrop-7fzo.onrender.com             |
| NEXT_PUBLIC_BIG_API_URL      | Tunnel to local backend for large file uploads | https://VSCodeTunnel.ms                | https://<your-ngrok-subdomain>.ngrok-free.app   |

---

## 🛡️ CORS Configuration (Backend)

The backend supports CORS for two frontend URLs. You can configure them in `.env` files:

CLIENT_URL=http://localhost:3000
CLIENT_TUNNEL=https://your-vscode-tunnel-url

Use:
- CLIENT_URL for local frontend development
- CLIENT_TUNNEL when frontend is deployed but backend is local

---

## 💡 Summary

- You have two APIs: one for small files (public) and one for big files (local via tunnel)
- The frontend uses two URLs to connect to those APIs
- You can test everything locally, or connect your local backend to production frontend using ngrok or VS Code Tunnels

---

Feel free to open issues or contribute!
