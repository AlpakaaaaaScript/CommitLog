# Deploying TaskFlow to Vercel

This guide walks you through deploying TaskFlow to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial TaskFlow setup"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your repository
   - Vercel will auto-detect Next.js

3. **Configure the project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (auto-configured)
   - **Output Directory**: `.next` (auto-configured)
   - **Install Command**: `npm install` (auto-configured)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

## Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
4. **Follow the prompts**
   - Link to existing project or create new
   - Confirm settings
   - Deploy

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Important Notes

### Data Persistence

⚠️ **The current implementation uses local JSON files for data storage, which will NOT persist on Vercel** because Vercel's serverless functions are stateless.

For production deployment, you should upgrade to a database:

### Recommended Database Options

1. **Vercel Postgres** (Recommended for Vercel)
   - Built-in integration
   - Easy setup
   - Generous free tier

2. **MongoDB Atlas**
   - Free tier available
   - Good for document-based storage

3. **Supabase**
   - PostgreSQL-based
   - Free tier available
   - Real-time capabilities

### Migrating to a Database (Future Enhancement)

To make your deployment production-ready:

1. Choose a database provider
2. Update the API routes in `app/api/projects/route.ts` and `app/api/tasks/route.ts`
3. Replace file system operations with database queries
4. Add database connection strings as environment variables in Vercel

## Environment Variables

Currently, no environment variables are required. When you add a database:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add your database connection string, e.g.:
   - `DATABASE_URL`: Your database connection string

## Custom Domain

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Automatic Deployments

Vercel automatically deploys when you push to your repository:
- **Push to main branch**: Deploys to production
- **Push to other branches**: Creates preview deployments

## MCP Server Hosting

⚠️ **Note**: The MCP server (`mcp-server/index.js`) is designed to run locally, not on Vercel. 

For MCP functionality:
- Run the MCP server on your local machine
- Or deploy it to a service that supports long-running Node.js processes (e.g., Railway, Render, DigitalOcean)

## Monitoring

After deployment:
1. View logs in the Vercel dashboard
2. Monitor performance and errors
3. Set up alerts for issues

## Troubleshooting

### Build Failures
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Next.js version compatibility

### Runtime Errors
- Check function logs in Vercel dashboard
- Verify API routes are working
- Test locally with `npm run build && npm start`

### Data Not Persisting
- This is expected with the file-based storage
- Upgrade to a database for production use

## Next Steps

After deployment:
1. Test the application thoroughly
2. Set up a database for production use
3. Configure custom domain
4. Set up monitoring and alerts
5. Consider implementing authentication

## Support

For Vercel-specific issues, consult:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
