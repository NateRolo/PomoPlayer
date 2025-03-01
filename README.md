# Pomodoro Timer App

A modern Pomodoro Timer application built with Next.js, featuring YouTube integration and customizable timer settings.

## Features

- Work, Short Break, and Long Break timer cycles
- YouTube player integration
- Customizable session durations
- Modern, responsive UI
- Session progress tracking

## Running with Docker

### Prerequisites

- Docker
- Docker Compose

### Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pomodoro-timer-next
   ```

2. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Access the application at `http://localhost:3000`

### Development Mode

To run the application in development mode:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Configuration

- Default session durations can be customized in the Settings panel
- YouTube URL can be changed to any valid YouTube video URL
- All settings are automatically saved to localStorage

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Docker

## License

MIT
