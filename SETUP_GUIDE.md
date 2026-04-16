# 🚀 Personal Journey Website — Setup & Deployment Guide

This guide will help you run the website on your computer and deploy it online for free. No technical experience needed!

---

## Part 1: Prerequisites (Install These First)

### Step 1: Install Node.js
Node.js is the software that runs your website on your computer.

1. Go to **https://nodejs.org/**
2. Download the **LTS (Long Term Support)** version (the green button)
3. Run the installer and click "Next" through all screens
4. Click "Install" when prompted
5. Restart your computer

**To verify it's installed:**
- Open Command Prompt (Windows) or Terminal (Mac/Linux)
- Type: `node --version`
- You should see a version number like `v22.13.0`

### Step 2: Install Git
Git helps you manage code versions.

1. Go to **https://git-scm.com/download**
2. Download for your operating system
3. Run the installer and click "Next" through all screens
4. Click "Install"

---

## Part 2: Get Your Website Code

### Step 1: Download the Code
1. Go to the Manus dashboard where your project is hosted
2. Click on the **"Code"** panel in the Management UI
3. Click **"Download all files"** button
4. Extract the ZIP file to a folder on your computer (e.g., `C:\Users\YourName\my-website`)

### Step 2: Open Command Prompt in Your Project Folder
**Windows:**
1. Open File Explorer
2. Navigate to your project folder
3. Click on the address bar at the top
4. Type `cmd` and press Enter
5. A Command Prompt window will open

**Mac/Linux:**
1. Open Terminal
2. Type: `cd ~/my-website` (replace with your folder path)
3. Press Enter

---

## Part 3: Run the Website Locally

### Step 1: Install Dependencies
In the Command Prompt/Terminal, type:
```
npm install
```
This downloads all the software packages your website needs. **Wait for it to complete** (takes 2-5 minutes).

### Step 2: Start the Development Server
Type:
```
npm run dev
```

You should see output like:
```
Server running on http://localhost:3000/
```

### Step 3: Open Your Website
1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Go to: **http://localhost:3000**
3. Your website should load! 🎉

---

## Part 4: Add Your Content (Admin Dashboard)

### Step 1: Access Admin Dashboard
1. On your website, click the **"Admin"** button in the top navigation
2. You'll see a login screen (this is normal)
3. You need to log in with your Manus account

### Step 2: Create Your First Destination
1. Click the **"Destinations"** tab
2. Fill in:
   - **Destination Name:** e.g., "Himalayas"
   - **Description:** e.g., "My trek through the beautiful Himalayan mountains"
3. Click **"Create Destination"**

### Step 3: Add Blog Posts
1. Click the **"Blog Posts"** tab
2. Fill in:
   - **Title:** Your blog post title
   - **Excerpt:** Short summary (optional)
   - **Content:** Your full story
3. Click **"Publish Post"**

### Step 4: Add Social Links
1. Click the **"Social Links"** tab
2. Follow the instructions to add your social media links
3. You'll add them through the database UI

---

## Part 5: Deploy for FREE (Using Manus)

The easiest way to deploy your website for free is using **Manus Hosting** (which you already have!).

### Step 1: Save a Checkpoint
1. In the Manus dashboard, click **"Save Checkpoint"** (or it might say "Version History")
2. Add a description like "First version with content"
3. Click Save

### Step 2: Publish Your Website
1. After saving the checkpoint, click the **"Publish"** button in the top-right
2. Your website will be deployed online automatically
3. You'll get a public URL like: `https://my-website.manus.space`

### Step 3: Share Your Website
1. Copy your website URL
2. Share it with friends and family!
3. Your website is now live on the internet 🌍

---

## Part 6: Update Your Website (After Deployment)

### To Make Changes:
1. Make changes in the Admin Dashboard (add photos, blog posts, etc.)
2. Changes appear immediately on your live website
3. No need to redeploy!

### To Update Code:
1. Make code changes on your computer
2. Test locally at `http://localhost:3000`
3. Save a checkpoint in Manus
4. Click Publish
5. Changes go live in seconds

---

## Part 7: Add Photos to Your Gallery

### Step 1: Upload Photos to S3 Storage
1. In the Manus dashboard, go to the **"Database"** panel
2. Find the `gallery_photos` table
3. Add a new row with:
   - **destinationId:** The ID of your destination
   - **title:** Photo title
   - **description:** Photo description
   - **imageUrl:** URL to your photo (see next step)
   - **order:** 1, 2, 3, etc.

### Step 2: Get Photo URLs
1. In the Manus dashboard, go to **"Settings"** → **"Secrets"**
2. Look for S3 storage information
3. Upload your photos using the provided S3 interface
4. Copy the photo URL and paste it in the `imageUrl` field

---

## Part 8: Troubleshooting

### "npm command not found"
- Node.js is not installed correctly
- Restart your computer and try again
- Or reinstall Node.js from https://nodejs.org/

### "Port 3000 is already in use"
- Another program is using port 3000
- Close other applications or use: `npm run dev -- --port 3001`

### Website won't load at localhost:3000
- Make sure the dev server is running (you should see "Server running on...")
- Try refreshing the page (Ctrl+R or Cmd+R)
- Check that you're using the correct URL

### Admin Dashboard won't let me log in
- Make sure you're logged into your Manus account
- Try logging out and logging back in
- Clear your browser cookies and try again

---

## Part 9: Custom Domain (Optional)

If you want a custom domain like `www.myjourney.com`:

1. In Manus dashboard, go to **Settings** → **Domains**
2. Click "Purchase Domain" or "Connect Custom Domain"
3. Follow the instructions
4. Your website will be accessible at your custom domain

---

## Part 10: Keep Your Website Running

### Your Website Stays Live Because:
- Manus provides free hosting
- Your website runs on Manus servers
- You can access it anytime from anywhere

### To Keep It Updated:
- Add new destinations and blog posts regularly
- Update your about page with new information
- Share new photos from your travels

---

## Need Help?

If you get stuck:
1. Check the **Troubleshooting** section above
2. Visit https://help.manus.im for support
3. Check error messages carefully — they usually tell you what's wrong

---

## Summary

**You now have:**
- ✅ A personal journey website
- ✅ Photo gallery organized by destinations
- ✅ Blog system for your travel stories
- ✅ Admin dashboard to manage everything
- ✅ Free hosting on Manus
- ✅ A live website on the internet

**Next steps:**
1. Run it locally: `npm run dev`
2. Add your content in the Admin Dashboard
3. Deploy: Click Publish in Manus
4. Share your website with the world! 🌍

Enjoy your personal journey website! 🎉
