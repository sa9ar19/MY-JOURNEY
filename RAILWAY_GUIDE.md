# 🚀 Deploy Your Website on Railway (Completely FREE)

This guide will help you deploy your personal journey website on **Railway** for completely FREE. No credit card needed, no hidden costs!

---

## Part 1: Push Your Code to GitHub

Your website code needs to be on GitHub for Railway to access it.

### Step 1: Create a GitHub Account (if you don't have one)

1. Go to **https://github.com**
2. Click **"Sign up"**
3. Enter your email and create a password
4. Click **"Create account"**
5. Verify your email address

### Step 2: Create a New Repository

1. After signing in to GitHub, click the **+** icon in the top-right corner
2. Click **"New repository"**
3. Fill in:
   - **Repository name:** `personal-website`
   - **Description:** "My personal journey website"
   - **Public** (leave it public)
4. Click **"Create repository"**
5. You'll see a page with instructions

### Step 3: Upload Your Code to GitHub

1. Open **Terminal** (Mac/Linux) or **Command Prompt** (Windows)
2. Navigate to your project folder:
   ```
   cd ~/personal-website-manusAI
   ```
3. Run these commands one by one (copy and paste):

   ```
   git init
   ```

   ```
   git add .
   ```

   ```
   git commit -m "Initial commit - personal journey website"
   ```

   ```
   git branch -M main
   ```

   ```
   git remote add origin https://github.com/YOUR_USERNAME/personal-website.git
   ```
   (Replace `YOUR_USERNAME` with your actual GitHub username)

   ```
   git push -u origin main
   ```

4. You might be asked to log in to GitHub. Do that.
5. Wait for the upload to complete.

**Success!** Your code is now on GitHub. ✅

---

## Part 2: Create Railway Account

### Step 1: Sign Up

1. Go to **https://railway.app**
2. Click **"Start Free"** or **"Sign Up"**
3. Click **"Continue with GitHub"**
4. Click **"Authorize railway-app"**
5. Complete your profile

**You now have a Railway account!** ✅

---

## Part 3: Deploy Your Website on Railway

### Step 1: Create a New Project

1. In Railway dashboard, click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Click **"Configure GitHub App"**
4. Select your GitHub account
5. Click **"Install & Authorize"**

### Step 2: Select Your Repository

1. Find and click **`personal-website`** repository
2. Click **"Deploy Now"**
3. Railway will start building your website (takes 5-10 minutes)

### Step 3: Wait for Deployment

You'll see a progress bar. Wait for it to complete. This is normal:
- Building...
- Deploying...
- Done! ✅

---

## Part 4: Create a Database

### Step 1: Add PostgreSQL Database

1. In your Railway project, click **"New"**
2. Click **"Database"**
3. Click **"PostgreSQL"**
4. Railway will create a database automatically

### Step 2: Connect Database to Your Website

1. Click on your **web service** (the one that says "personal-website")
2. Go to the **"Variables"** tab
3. Click **"New Variable"**
4. Add these:

   **First Variable:**
   - Key: `DATABASE_URL`
   - Value: Click the **PostgreSQL** service in your project, then copy the connection string from the **"Connect"** tab

   **Second Variable:**
   - Key: `NODE_ENV`
   - Value: `production`

5. Click **"Add"**

### Step 3: Deploy Database Changes

1. Your website will automatically redeploy with the database connection
2. Wait for the deployment to complete (2-5 minutes)

---

## Part 5: Add Environment Variables

### Step 1: Get Your Variables from Manus

1. Go to your **Manus dashboard**
2. Click **"Settings"** → **"Secrets"**
3. Copy each value you see there

### Step 2: Add Variables to Railway

1. In Railway, click your **web service**
2. Go to **"Variables"** tab
3. Click **"New Variable"** for each one:

   ```
   JWT_SECRET = (generate a random string, or copy from Manus)
   VITE_APP_ID = (copy from Manus)
   OAUTH_SERVER_URL = https://api.manus.im
   VITE_OAUTH_PORTAL_URL = https://oauth.manus.im
   OWNER_OPEN_ID = (copy from Manus)
   OWNER_NAME = Your Name
   VITE_ANALYTICS_ENDPOINT = https://analytics.manus.im
   VITE_ANALYTICS_WEBSITE_ID = (copy from Manus)
   VITE_APP_LOGO = (copy from Manus)
   VITE_APP_TITLE = My Journey
   VITE_FRONTEND_FORGE_API_KEY = (copy from Manus)
   VITE_FRONTEND_FORGE_API_URL = https://api.manus.im
   BUILT_IN_FORGE_API_KEY = (copy from Manus)
   BUILT_IN_FORGE_API_URL = https://api.manus.im
   ```

4. After adding all variables, your website will redeploy automatically

---

## Part 6: Your Website is Live!

### Step 1: Get Your Website URL

1. In Railway dashboard, click your **web service**
2. Look for **"Deployments"** section
3. You'll see your website URL like: `https://personal-website-xxxx.railway.app`

### Step 2: Test Your Website

1. Copy the URL
2. Open it in your browser
3. Your website should load! 🎉

---

## Part 7: Add Your Content

### Step 1: Access Admin Dashboard

1. On your website, click **"Admin"** in the navigation
2. Log in with your Manus account
3. You'll see the admin dashboard

### Step 2: Create Your First Destination

1. Click **"Destinations"** tab
2. Fill in:
   - **Destination Name:** e.g., "Himalayas"
   - **Description:** e.g., "My trek through the mountains"
3. Click **"Create Destination"**

### Step 3: Add Blog Posts

1. Click **"Blog Posts"** tab
2. Fill in:
   - **Title:** Your blog post title
   - **Excerpt:** Short summary
   - **Content:** Your full story
3. Click **"Publish Post"**

### Step 4: Add Social Links

1. Click **"Social Links"** tab
2. Follow the instructions to add your social media links

---

## Part 8: Update Your Website (After Deployment)

### To Make Changes to Content:

1. Use the **Admin Dashboard** on your website
2. Changes appear immediately online ✅

### To Make Code Changes:

1. Make changes on your computer
2. Test locally: `npm run dev`
3. Push to GitHub:
   ```
   git add .
   git commit -m "Your message here"
   git push
   ```
4. Railway automatically redeploys (takes 2-5 minutes)
5. Your changes are live! ✅

---

## Part 9: Troubleshooting

### Website shows "502 Bad Gateway"
- Wait 5 minutes for Railway to finish deploying
- Click **"Deployments"** to check the status
- Check the **"Logs"** tab for errors

### Database connection error
- Make sure `DATABASE_URL` variable is set
- Check that PostgreSQL database is created
- Verify the connection string is correct

### Build fails
- Check the **"Build Logs"** tab for error messages
- Make sure all environment variables are set
- Try redeploying: click **"Redeploy"** button

### Website is very slow
- Railway free tier can be slow sometimes
- Try refreshing the page
- If persistent, consider upgrading to paid plan ($5/month)

### Admin dashboard won't load
- Make sure you're logged into your Manus account
- Try logging out and logging back in
- Clear browser cookies and try again

---

## Part 10: Get a Custom Domain (Optional)

### Using Railway's Free Domain
Your website already has a free domain: `https://personal-website-xxxx.railway.app`

### Using Your Own Domain
1. Buy a domain from **GoDaddy**, **Namecheap**, or **Google Domains** (~$10/year)
2. In Railway, go to your **web service** → **"Settings"**
3. Click **"Add Custom Domain"**
4. Enter your domain name
5. Follow the DNS instructions from your domain provider

---

## Part 11: Monitor Your Website

### Check Website Status

1. In Railway dashboard, click your **web service**
2. You can see:
   - **Deployments:** All your updates
   - **Logs:** What's happening on your website
   - **Metrics:** Website performance

### Check Database Status

1. Click your **PostgreSQL** database
2. You can see:
   - **Connection info:** How to connect
   - **Logs:** Database activity
   - **Backups:** Automatic backups

---

## Summary

**You now have:**
- ✅ Website running on Railway (free)
- ✅ Database on Railway (free)
- ✅ Live website on the internet
- ✅ Automatic updates when you push to GitHub
- ✅ $5/month free credits (more than enough)

**Your website URL:** `https://personal-website-xxxx.railway.app`

**Monthly cost:** $0 (free credits cover everything)

---

## Important Notes

✅ **Railway is genuinely free:**
- $5/month free credits
- Your website costs ~$3-5/month
- You never pay anything
- Database never expires

💡 **Best practices:**
- Keep your GitHub repo updated
- Test changes locally before pushing
- Monitor your website regularly
- Add content regularly to keep it fresh

---

## Next Steps

1. ✅ Push code to GitHub (already done!)
2. ✅ Create Railway account
3. ✅ Deploy your website
4. ✅ Add your content
5. ✅ Share your website URL with friends!

---

## Need Help?

If you get stuck:
1. Check the **Troubleshooting** section above
2. Visit **https://docs.railway.app** for official docs
3. Contact Railway support through their dashboard

**Congratulations! Your website is now live on the internet!** 🎉

Share your website URL: `https://personal-website-xxxx.railway.app`