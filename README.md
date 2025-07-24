Demo: https://quick-drop-client-rho.vercel.app/

# QuickDrop

A web application for uploading and sharing files, using two backend servers:
- **Small API** — handles small files (hosted on a public server)
- **Big API** — handles large files (runs locally and accessed via a tunnel)

---

## 🚀 Project Setup

### 🧩 Clone the Repository

git clone https://your-repo-url.git
cd quickdrop

---

## 🧪 Running the Frontend (Client)

### 1. Install Dependencies

cd client
npm install

### 2. Create Environment File

Create a `.env` file in the `client` folder.

#### Development Mode

NEXT_PUBLIC_SMALL_API_URL=http://localhost:3002
NEXT_PUBLIC_BIG_API_URL=https://sdb9bgs6-3002.euw.devtunnels.ms/

- NEXT_PUBLIC_SMALL_API_URL: your local backend (Small API)
- NEXT_PUBLIC_BIG_API_URL: VS Code remote tunnel URL to your local backend (Big API)

Make sure your local server is running on port 3002 and you’ve opened the tunnel using VS Code Tunnels.

#### Production Mode

NEXT_PUBLIC_SMALL_API_URL=https://quickdrop-7fzo.onrender.com
NEXT_PUBLIC_BIG_API_URL=https://qwhosle-pzroqvesn-qmulslexts.ngrok-free.app/

- NEXT_PUBLIC_SMALL_API_URL: deployed backend (for small files)
- NEXT_PUBLIC_BIG_API_URL: public ngrok tunnel to your local backend (for large files)

---

## 🖥️ Running the Backend (Server)

### 1. Install Dependencies

cd server
npm install

### 2. Create `.env` File

DB_URL=postgres://postgres:0000@localhost:5432/postgres
DB_NAME=quickDropDB

### 3. Start PostgreSQL

Ensure PostgreSQL is running locally. You can either:
- Create the database manually (named `quickDropDB`)
- Or run the script:

npm run createDB

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

ngrok config add-authtoken <your-token>

4. Start the tunnel:

npm run tunnel

This will expose port 3002 to the internet (e.g., https://xyz123.ngrok-free.app)

5. Build and start the backend:

npm run build
npm run start:prod

---

## 🌍 Environment Variable Summary

| Variable                      | Description                                  | Dev Example                                 | Prod Example                                     |
|------------------------------|----------------------------------------------|---------------------------------------------|--------------------------------------------------|
| NEXT_PUBLIC_SMALL_API_URL    | Public or local backend for small files      | http://localhost:3002                       | https://quickdrop-7fzo.onrender.com             |
| NEXT_PUBLIC_BIG_API_URL      | Tunnel to local backend for large file uploads | https://<VSCodeTunnel>.ms                | https://<your-ngrok-subdomain>.ngrok-free.app   |

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



To run app you should clone this project to your machine.

To run client you should
1. Enter client folder
2. use npm install comman
3. create .env file and, if this is dev mode past there variables like this
  NEXT_PUBLIC_SMALL_API_URL=http://localhost:3002
  NEXT_PUBLIC_BIG_API_URL=https://sdb9bgs6-3002.euw.devtunnels.ms/
   first is server launched at localhost
   second is port to your server launced at localhost
   to run port use PORTS at VSCode and set port where your server runned

   If this is production variables should be like this
  NEXT_PUBLIC_SMALL_API_URL=https://quickdrop-7fzo.onrender.com
  NEXT_PUBLIC_BIG_API_URL=https://qwhosle-pzroqvesn-qmulslexts.ngrok-free.app/
  first is server deployed at some url
  second is ngrok tunnel to server launched at your machine
  The idea is to use 2 backends:
    First server is deployed somewhere to use small files
     Second deployed at your machine and you can use it to store big files

To run server you should
1. enter server folder
2. run npm install
3. create .env and paste there this variables if you want to create db with command specified at 5 step
     DB_URL=postgres://postgres:0000@localhost:5432/postgres
     DB_NAME=quickDropDB
4. launch postgresql at your machine
5. create there DB named quickDropDB, or run command npm run createDB (this command will use .env file created at step 3)
6. also, this project have .env.production and .env.development, first to run locally at dev mode, second also run locally but for deployed frontend so he could use this backend as big api
7. to use this backend as big api you should
    7.1 run ngrok tunnel, for this
       7.1.1 login to ngrok website https://dashboard.ngrok.com
       7.1.2 get there token
       7.1.3 use it in this command ngrok config add-authtoken <your token > like this ngrok config add-authtoken 2lODEqew2mHHEqwe9hDBzcxPmHn8w2AYFz1_2xHtsnCo6oMqweasd5dzAS8MNJc (this token is invalid)
       7.1.4 run command npm run tunnel this command will run ngrok tunnel to port 3002
    7.2 run command npm run build
    7.3 run command npm run start:prod
    7.4 our backend launched at localhost:3002 and we have ngrok tunnel which url we can use at deployed frontend to use it as big api

Also, at frontend in .env file we have 2 backend urls. First as url to small api second as url to big api.
At dev mode there will be no difference between them, but for dev you should run you server at localhost:3002 and set first variable as https://localhost:3002 (this is will be our small api)
And second variable will be our VSCode PORT to our localhost:3002, it can look like this https://sdb9bgs6-3002.euw.devtunnels.ms/

At prod mode, when our frontend will be deployed, we will use first variable(small api) to set url of deployed backend, 
and we will use second variable(big api) to set url to our ngrok tunnel to backend launched at our localhost to store big files

At backend we also have 2 variables for cients, we can use only one, but if you will want to use backend during developing frontend you can use second. 
We use this 2 variables to allow their query with CORS policy. 
At dev mode I used first variable to localhost:3000, where my frontend was runned locally, and second variable it was VSCode PORT to my frontend

