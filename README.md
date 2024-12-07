# DataViz - Text to Animated Visualization

DataViz is a web application that transforms raw text data into animated visualizations using AI and modern web technologies.

## Features

- Convert raw text into data points using Claude AI
- Generate animated charts using ECharts
- Record and export visualizations as videos
- Modern, responsive UI

## Tech Stack

- Frontend: React.js with TypeScript
- Visualization: ECharts
- Video Recording: Media Recorder Web API
- AI Processing: Claude Sonnet 3.5
- Deployment: Netlify

## Prerequisites

Before running this project, make sure you have installed:

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your Claude API key:
   ```
   REACT_APP_CLAUDE_API_KEY=your_api_key_here
   ```

## Running the Application

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Building for Production

To create a production build:

```bash
npm run build
```

## Deployment

The application is configured for deployment on Netlify. Simply connect your GitHub repository to Netlify and it will automatically deploy when you push to the main branch.

## License

MIT
