# Deployment Guide for AIDA Chatbot Widget

This guide will walk you through deploying your AIDA chatbot widget to Vercel and integrating it into SharePoint or other third-party websites.

## Step 1: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy from your project directory**:
```bash
cd frontend-angular
vercel --prod
```

4. **Follow the prompts**:
   - Link to existing project or create new one
   - Confirm build settings (should auto-detect Angular)
   - Wait for deployment to complete

### Option B: Deploy via GitHub Integration

1. **Push your code to GitHub**:
```bash
git add .
git commit -m "Add AIDA chatbot widget"
git push origin main
```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Angular settings

3. **Configure build settings**:
   - Build Command: `ng build --configuration production`
   - Output Directory: `dist/advantis-assistant-angular`
   - Install Command: `npm install`

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

## Step 2: Update Configuration

After deployment, update the embed script with your actual Vercel URL:

1. **Get your Vercel URL** (e.g., `https://your-app-name.vercel.app`)

2. **Update the embed script**:
```javascript
// In embed.js, update this line:
const CONFIG = {
  widgetUrl: 'https://your-app-name.vercel.app/widget', // Replace with your actual URL
  // ... other config
};
```

3. **Redeploy** if you made changes to the embed script

## Step 3: Test the Widget

1. **Test the main app**: Visit `https://your-app-name.vercel.app`
2. **Test the widget**: Visit `https://your-app-name.vercel.app/widget`
3. **Test the embed**: Open `embed-example.html` in your browser

## Step 4: Integrate with SharePoint

### Method 1: Script Editor Web Part (Recommended)

1. **Edit your SharePoint page**
2. **Add a Script Editor web part**:
   - Click "Edit" on your SharePoint page
   - Click "+" to add a web part
   - Search for "Script Editor" or "Embed"
   - Add the web part to your page

3. **Add the embed script**:
```html
<script src="https://your-app-name.vercel.app/embed.js" 
        data-widget-url="https://your-app-name.vercel.app/widget"
        data-button-text="Chat with AIDA"
        data-button-color="#2E008B"
        data-position="bottom-right"></script>
```

4. **Save and publish** the page

### Method 2: Content Editor Web Part

1. **Add a Content Editor web part** to your page
2. **Edit the web part** and add the embed script in the HTML source
3. **Save and publish**

### Method 3: Custom SharePoint Solution

1. **Create a custom web part** or **modify the master page**
2. **Include the embed script** in your solution
3. **Deploy the solution** to your SharePoint farm

## Step 5: Configure for Your Environment

### Update API Base URL

If your backend API is not on localhost:5000, update the API base URL:

1. **Set environment variable** in Vercel:
   - Go to your Vercel project settings
   - Add environment variable: `API_BASE=https://your-api-url.com`

2. **Or update the code** in `api.service.ts`:
```typescript
base = (window as any).API_BASE || 'https://your-api-url.com';
```

### Customize Widget Appearance

Update the embed script configuration:

```html
<script src="https://your-app-name.vercel.app/embed.js" 
        data-widget-url="https://your-app-name.vercel.app/widget"
        data-button-text="Your Custom Text"
        data-button-color="#your-color"
        data-position="bottom-left"
        data-width="400px"
        data-height="700px"></script>
```

## Step 6: Security Configuration

### SharePoint Security Settings

1. **Content Security Policy**: The widget is configured to work with SharePoint's CSP
2. **X-Frame-Options**: Set to SAMEORIGIN for security
3. **CORS**: Ensure your backend API allows requests from your Vercel domain

### Iframe Sandbox

The widget uses a sandboxed iframe with these permissions:
- `allow-scripts`: Required for Angular functionality
- `allow-same-origin`: Required for API calls
- `allow-forms`: Required for form submissions
- `allow-popups`: Required for external links
- `allow-popups-to-escape-sandbox`: Required for popup windows

## Troubleshooting

### Widget Not Appearing

1. **Check browser console** for JavaScript errors
2. **Verify the script URL** is accessible
3. **Check if iframe is blocked** by browser or SharePoint
4. **Test in different browsers**

### API Connection Issues

1. **Verify API_BASE URL** is correct
2. **Check CORS settings** on your backend
3. **Test API endpoints** directly
4. **Check network tab** in browser dev tools

### SharePoint Specific Issues

1. **Check SharePoint version** compatibility
2. **Verify web part permissions**
3. **Test in different SharePoint environments**
4. **Check SharePoint security policies**

## Monitoring and Analytics

### Vercel Analytics

1. **Enable Vercel Analytics** in your project settings
2. **Monitor widget usage** and performance
3. **Set up alerts** for errors or downtime

### Custom Analytics

Add custom tracking to the embed script:

```javascript
// Track widget opens
window.AIDA = {
  open: () => {
    // Your analytics tracking code
    gtag('event', 'chat_widget_opened');
    // ... existing code
  }
};
```

## Maintenance

### Regular Updates

1. **Monitor for Angular updates**
2. **Update dependencies** regularly
3. **Test after updates** in all environments
4. **Keep documentation** up to date

### Performance Optimization

1. **Monitor bundle size**
2. **Optimize images** and assets
3. **Use Vercel's performance insights**
4. **Implement lazy loading** where appropriate

## Support and Documentation

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Angular Documentation**: [angular.io/docs](https://angular.io/docs)
- **SharePoint Development**: [docs.microsoft.com/en-us/sharepoint/dev](https://docs.microsoft.com/en-us/sharepoint/dev)

## Next Steps

1. **Deploy to production**
2. **Test thoroughly** in your SharePoint environment
3. **Train users** on the new chatbot feature
4. **Monitor usage** and gather feedback
5. **Iterate and improve** based on user feedback
