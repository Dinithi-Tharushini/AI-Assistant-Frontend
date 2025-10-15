# AIDA Chatbot Widget

A modern, responsive chatbot widget built with Angular that can be embedded into any website using an iframe approach. Perfect for SharePoint integration and third-party websites.

## Features

- 🤖 **Smart Chat Interface**: Full-featured chat with voice input, text-to-speech, and streaming responses
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Customizable**: Configurable colors, position, and size
- 🔒 **Secure**: Sandboxed iframe with proper security headers
- ⚡ **Fast**: Optimized for performance with lazy loading
- 🌐 **Cross-Platform**: Compatible with SharePoint, WordPress, and any website

## Quick Start

### 1. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with the included `vercel.json` configuration

### 2. Embed in Your Website

Add this single script tag to any website:

```html
<script src="https://your-vercel-app.vercel.app/embed.js" 
        data-widget-url="https://your-vercel-app.vercel.app/widget"
        data-button-text="Chat with AIDA"
        data-button-color="#2E008B"
        data-position="bottom-right"></script>
```

## Configuration Options

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-widget-url` | URL to your deployed widget | Required |
| `data-button-text` | Tooltip text for the chat button | "Chat with AIDA" |
| `data-button-color` | Primary color for the button | "#2E008B" |
| `data-position` | Widget position | "bottom-right" |
| `data-width` | Chat window width | "380px" |
| `data-height` | Chat window height | "600px" |

### Position Options
- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`

## SharePoint Integration

### Method 1: Script Editor Web Part
1. Edit your SharePoint page
2. Add a "Script Editor" web part
3. Insert the embed script

### Method 2: Custom Solution
Include the script in your SharePoint solution's master page or custom CSS.

### Method 3: Content Editor Web Part
Use the Content Editor web part with the embed script.

## API Methods

The widget exposes a global `window.AIDA` object:

```javascript
// Open the chat programmatically
AIDA.open();

// Close the chat programmatically
AIDA.close();

// Toggle the chat open/closed
AIDA.toggle();
```

## Development

### Prerequisites
- Node.js 18+
- Angular CLI
- Your backend API running on localhost:5000

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
ng serve
```

3. Open your browser to:
   - Main app: `http://localhost:4200`
   - Widget only: `http://localhost:4200/widget`

### Building for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── chat-widget/          # Widget component for iframe embedding
│   ├── home/                 # Main application component
│   ├── widget/               # Widget route wrapper
│   ├── api.service.ts        # API service for backend communication
│   └── app.module.ts         # Main app module with routing
├── assets/                   # Static assets (images, etc.)
└── styles.scss              # Global styles
```

## Backend Integration

The widget expects your backend API to be available at the URL specified in `API_BASE`. Make sure your backend supports:

- `POST /chat` - Send chat messages
- `GET /chat/stream` - Stream chat responses
- `POST /stt` - Speech-to-text conversion
- `POST /tts` - Text-to-speech conversion

## Security Considerations

- The widget runs in a sandboxed iframe
- Content Security Policy headers are configured for SharePoint compatibility
- X-Frame-Options is set to SAMEORIGIN
- All user inputs are sanitized using DOMPurify

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Troubleshooting

### Widget Not Appearing
1. Check that the script URL is correct
2. Verify your Vercel deployment is live
3. Check browser console for errors
4. Ensure the iframe URL is accessible

### SharePoint Issues
1. Make sure your SharePoint site allows iframe embedding
2. Check if Content Security Policy blocks the widget
3. Verify the script is added correctly to the page

### API Connection Issues
1. Verify your backend API is running
2. Check CORS settings on your backend
3. Ensure the API_BASE URL is correct

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact your development team or create an issue in the repository.
