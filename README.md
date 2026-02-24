# ♟️ Chess Stats Dashboard

A sleek web application that displays comprehensive Chess.com player statistics and game analytics in a beautiful, interactive dashboard.

## Features

- **Player Profile**: View player information including country, join date, and account status
- **Rating Analytics**: Track rating progression over time with interactive line charts
- **Win Rate Visualization**: Visual representation of win/loss/draw rates for rapid games
- **Performance Metrics**: Analyze game outcomes by result with detailed performance charts
- **Puzzle Statistics**: Display puzzle rush scores and attempts
- **Recent Games**: Browse and analyze recent games with detailed game information
- **Search Functionality**: Look up any Chess.com player instantly
- **Responsive Design**: Fully responsive UI that works on desktop and mobile

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **API**: Chess.com Public API (free, no authentication required)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amit-srivatsa/chess-stats.git
   cd chess-stats
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized build will be created in the `dist` folder.

## How It Works

The app fetches real-time data from Chess.com's free public API:

1. **Player Profile**: Fetches basic player information
2. **Statistics**: Retrieves rating data, win rates, and puzzle stats
3. **Recent Games**: Pulls the latest games from the player's archives
4. **Charts**: Renders interactive visualizations of the data

## Portfolio Context

This project demonstrates:
- Modern React patterns (hooks, context, functional components)
- TypeScript for type safety
- Responsive UI design with Tailwind CSS
- API integration and data fetching
- Data visualization with charts
- Component-based architecture
- Local storage for user preferences

## License

MIT

## Contributing

Feel free to fork, modify, and use this project as a reference for your own work!

---

## Attribution & Credits

If you find this project helpful and decide to use it or build upon it, I'd appreciate a credit! Here are a few ways you can do so:

- **Add a link in your project's README:**
  ```markdown
  Built with inspiration from [Chess Stats Dashboard](https://github.com/amit-srivatsa/chess-stats) by [Amit Srivatsa](https://github.com/amit-srivatsa)
  ```

- **GitHub Star**: If you found this useful, consider giving it a ⭐ on [GitHub](https://github.com/amit-srivatsa/chess-stats)

- **Mention in your project**: Link back to this repository or mention it in your project documentation

Attribution helps support open-source development and is greatly appreciated!

---

**Try it out**: Search for any Chess.com username to see their stats instantly!
