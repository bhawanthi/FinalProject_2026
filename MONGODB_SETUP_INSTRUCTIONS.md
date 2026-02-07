# MongoDB Atlas Setup Instructions

## Quick Fix for "Database not connected" Error

### Option 1: Fix Existing Cluster
1. Go to https://cloud.mongodb.com/
2. Sign in with your account
3. **Check if cluster is PAUSED** → Click "Resume" if needed
4. **Network Access** tab → "Add IP Address" → Use `0.0.0.0/0`
5. **Database Access** → Ensure user exists
6. **Clusters** → "Connect" → Update connection string in `.env`

### Option 2: Create New FREE Cluster
1. **Sign up** at https://cloud.mongodb.com/ (FREE FOREVER)
2. **Create New Project** → "Build a Database" 
3. Choose **FREE M0 Shared** tier
4. Select **AWS** and closest region
5. Create cluster (takes 3-5 minutes)
6. **Database Access** → "Add New Database User"
   - Username: `finance_user`
   - Password: `finance123` (remember this!)
7. **Network Access** → "Add IP Address" → `0.0.0.0/0`
8. **Connect** → "Connect your application" → Copy connection string
9. Update your `.env` file with new connection string

### Option 3: Local MongoDB (Advanced)
```bash
# Install MongoDB locally (Windows)
winget install MongoDB.Server

# Update .env file:
MONGO_URI=mongodb://localhost:27017/finance_tracker
```

## After Setup
1. Restart your server: `npm start`
2. Check health: http://localhost:5000/health
3. Your app should now connect successfully!