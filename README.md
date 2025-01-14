# Interactive Video Player Assessment

A modern video player and analysing application built with Svelte 5, demonstrating interactive features and reactive elements using Tailwind CSS, Chart.js and Firebase integration.

## Live Demo
[View Demo](https://video-player-42436.web.app)

## Screenshot

![Video Player Interface](./static/images/Watch%20Video.png)

![Video Player Interface](./static/images/Analyze%20Video.png)

## Features Implemented

### Core Requirements
- ✅ Built with Svelte 5 and Tailwind CSS
- ✅ Single page application with video player
- ✅ External play/pause button with reactive state
- ✅ Interactive features with video timeline integration

### Advanced Features
- 📊 Watch time analytics with click heatmap visualization
- 🎯 Click tracking system showing timestamp and coordinates
- 📈 Interactive visualization using Chart.js
- 🔥 Firebase integration for data persistence
- 🎨 Clean, responsive UI with Tailwind CSS

## Quick Start

1. Clone and install dependencies:
```bash
git clone https://github.com/DoBestMan/latitude-video-app.git
cd latitude-video-app
npm install
```

2. Set up environment variables:
Create a `.env` file with your Firebase credentials:
```bash
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-domain"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```
You can use the default settings like the following:
```bash
VITE_FIREBASE_API_KEY="AIzaSyCIVvC7EOEPxU8-KQ36x9ClfgztbNciIS0"
VITE_FIREBASE_AUTH_DOMAIN="video-player-42436.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="video-player-42436"
VITE_FIREBASE_STORAGE_BUCKET="video-player-42436.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="352574023119"
VITE_FIREBASE_APP_ID="1:352574023119:web:6a56f2579eb1fcf786deba"
```
3. Run development server:
```bash
npm run dev
```

4. Build and deploy:
```bash
npm run deploy
```

## Technical Implementation

### Video Player Integration
- Custom video player controls
- External play/pause button with reactive state management
- Click tracking system with coordinates and timestamp recording

### Interactive Features
- Real-time click tracking visualization
- Timeline-based analytics
- Responsive design with Tailwind CSS


## Technology Stack

- **Frontend Framework**: Svelte 5
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Backend/Hosting**: Firebase
- **Visualization**: Chart.js
- **Testing**: Vitest

## Project Structure
```
latitude-video-app/
├── src/
│   ├── lib/
│   │   ├── components/     # Video player and UI components
│   │   ├── stores/         # State management
│   │   └── utils/          # Helper functions
│   └── routes/             # Page components
├── static/                 # Static assets
└── tests/                  # Test files
```

## Development Approach

1. **Framework Selection**: Chose `Svelte 5` for its reactive capabilities and efficient DOM updates
2. **UI Design**: Implemented clean, responsive design with `Tailwind CSS`
3. **Interactivity**: `Added click tracking and visualization features`
4. **Testing**: Included comprehensive test suite with `Vitest`
5. **Deployment**: Set up `Firebase` hosting for easy access

## Future Enhancements

- Additional analytics visualizations
- User authentication
- Custom video upload capability
- Enhanced timeline markers
- Mobile-optimized controls

## Running Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

## Contact

For any questions about this assessment, please contact Christopher Metzner at chrismetzner0910@gmail.com.