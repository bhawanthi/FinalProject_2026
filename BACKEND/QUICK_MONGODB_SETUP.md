# ⚡ QUICK MongoDB Atlas Setup (2 Minutes)

## Step 1: Create FREE Account
**Link opened in browser:** https://www.mongodb.com/cloud/atlas/register

1. Sign up with Google/GitHub (fastest) OR use email
2. Skip the questionnaire or answer quickly

## Step 2: Create FREE Cluster (M0 - Free Forever)
1. Choose **FREE** tier (M0 Sandbox)
2. Select region closest to you
3. Click "Create Cluster" (takes 1-3 minutes to provision)

## Step 3: Set Up Database Access
1. Go to **Database Access** (left sidebar)
2. Click "Add New Database User"
3. Username: `finance_user`
4. Password: Click "Autogenerate Secure Password" - **COPY IT!**
5. User Privileges: "Read and write to any database"
6. Click "Add User"

## Step 4: Set Up Network Access
1. Go to **Network Access** (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (adds 0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String
1. Go to **Database** (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` with `finance_user`
6. Replace `<password>` with the password you copied
7. Add database name: `finance_tracker` at the end before `?`
   
   **Final format:**
   ```
   mongodb+srv://finance_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/finance_tracker?retryWrites=true&w=majority
   ```

## Step 6: Update .env File
1. Open `BACKEND/.env`
2. Replace the MONGO_URI line with your new connection string
3. Save the file

## Step 7: Restart Server
```bash
cd BACKEND
npm start
```

**You should see:**
```
✅ MongoDB connected successfully
📦 Database: finance_tracker
```

---

## Alternative: Install MongoDB Locally (15 Minutes)
If you prefer running MongoDB on your computer:

1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings (install as Windows Service)
3. Update `.env`: `MONGO_URI=mongodb://localhost:27017/finance_tracker`
4. Restart server

---

## Current Issue Status
Your old MongoDB Atlas cluster `wathsara.uxvh4h9.mongodb.net` is no longer accessible (possibly deleted/paused). Creating a new cluster is the fastest solution.
