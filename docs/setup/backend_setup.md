## NestJS Setup

### Prerequisites  
- Before starting, ensure you have `Node.js` installed on your system.  
- If not installed, download it from the official website: [Download Node.js](https://nodejs.org) `v20.20.2 LTS`  
- Check if Node.js is installed:
```
node -v
```
### Installation
```
cd backend  
```
```
npx @nestjs/cli new api
```
select `npm` 

```
cd backend/api  
```
#### Installing TypeScript type definitions
```
npm install --save-dev @types/node
```
#### Install bcrypt for password hashing  
```
npm install bcrypt
```
#### Install types as a development dependency  
```
npm install --save-dev @types/bcrypt
```
- command to populate your database with initial data
```
npx prisma db seed
```

#### Run the server  
```
npm run start
```
#### server URL  
`http://localhost:3000/`
The project is deployed and available for real-time testing:
```
https://powerlifting-competition-platform-5.onrender.com
```
The application is hosted on the `Render Free Tier`. If the service is inactive for 15 minutes, it automatically goes into a "sleep" mode. As a result, the **first request may take 30-50 seconds to respond** (Cold Start). Please give it a moment to spin up the container.

### Testing

This project uses `Jest` as the default testing framework (provided by NestJS).  
```
cd backend/api
```
```
npm install --save-dev jest @types/jest  
```
#### Run tests  
```
npm run test
```

---

## Docker Setup

### Prerequisites
- Before starting, ensure you have `Docker` and `Docker Compose` installed on your system.
- If not installed, download it from the official website: [Docker Desktop](https://docker.com) installed and running.

### Running with Docker Compose
The project uses Docker Compose to orchestrate the NestJS backend and a PostgreSQL database.

1. **Start the services**:
   This command builds the backend image and starts both the database and the API:
   ```
   docker-compose up -d --build
   ```

2. **Environment Variables**:
   The backend automatically connects to the database using the following internal URL:
   `postgresql://admin:admin@postgres:5432/powerlifting`

3. **Service Details**:
   - **Backend API**: Accessible at `http://localhost:3005`
   - **PostgreSQL**: Accessible at `localhost:5432` (User: `admin`, Pass: `admin`, DB: `powerlifting`)

4. **Stop and clean up**:
   To stop the containers and keep the data:
   ```
   docker-compose stop
   ```
   To remove containers and the internal network:
   ```
   docker-compose down
   ```

#### Troubleshooting
- **Database Persistence**: Data is stored in a named volume `postgres_data`. It persists even if you stop the containers.
- **Logs**: To view real-time logs for the backend, run:
  ```
  docker logs -f pcp_backend
  ```

---

## Database Migration (Prisma)

Once the Docker containers are running, you need to set up the database schema using Prisma.

### Step 1 — Installation

1. **Navigate to the API directory**:
   ```
   cd backend/api
   ```

2. **Install Prisma dependencies**:
   ```
   npm install prisma @prisma/client
   ```

3. **Initialize Prisma**:
   ```
   npx prisma init
   ```
   *This creates a `prisma` folder and a `.env` file.*

### Step 2 — Configure Database URL

After initializing Prisma, you must configure the connection string in your `.env` file located in `backend/api/.env`.

1. **Open the `.env` file** and update the `DATABASE_URL` variable:
   ```
   DATABASE_URL="postgresql://admin:admin@localhost:5432/powerlifting"
   ```

2. **Crucial Note**: 
- Use `localhost` when running `Prisma` commands from your host machine (Windows/Mac/Linux).
- Use postgres only for internal `Docker` communication (inside containers).
```
npx prisma migrate dev --name init
```
