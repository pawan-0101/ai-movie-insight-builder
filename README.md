# AI Movie Insight Builder 🎬

A premium web application that provides in-depth movie insights and AI-powered audience sentiment analysis based on an IMDb ID.

## 🚀 Features
- **Comprehensive Movie Details**: Get posters, cast lists, credits, plot summaries, and box office metadata.
- **AI Sentiment Analysis**: Uses advanced AI analysis (via OpenAI by default, with an automated fallback heuristic) to provide clear audience sentiment classification (Positive / Mixed / Negative) and a helpful analytical summary.
- **Reviews & Rating Metrics**: View simulated aggregated ratings/reviews to understand the public reception.
- **Premium Design**: Modern aesthetic, dark theme styling, glassmorphism, responsive grid layout, and subtle micro-animations for an elevated user experience.
- **Robust Loading Sequence**: Multi-step loading states inform the user of exactly what backend processes are running.

## 🛠 Tech Stack & Rationale
- **Framework**: Next.js (App Router) + React.
  - *Rationale*: Next.js App Router easily integrates backend API endpoints (for our OMDB / OpenAI fetching) directly within the frontend monorepo, avoiding the overhead of setting up a separate backend server. It scales excellently for web apps.
- **Styling**: Vanilla CSS (Global variables, Flexbox/Grid).
  - *Rationale*: Vanilla CSS ensures complete control over layout aesthetics, granular micro-animations, and modern CSS variables matching the required "premium design" with custom gradients and glassmorphism.
- **Backend integrations**:
  - `Node.js / Next.js API Routes` handle server-side data fetching for security (to avoid exposing API keys on the frontend).
  - `OMDB API` provides extensive metadata.
  - `OpenAI GPT-3.5-Turbo` processes simulated review data into sentiment insights.
- **Testing**: Jest & React Testing Library.
  - *Rationale*: The standard, reliable toolchain for React component and logic unit tests.

## 🔧 Setup Instructions
1. **Clone/Download the repository**
2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
3. **Environment Setup**:
   Create a \`.env.local\` file in the root directory (using the downloaded \`.env.local\` as a base) and add your keys:
   \`\`\`
   OMDB_API_KEY=b6003d8a
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`
   *Note: If no OPENAI_API_KEY is provided, the application will automatically fall back to a robust programmatic heuristic that simulates sentiment based on ratings, votes, and awards.*
4. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`
5. Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing
Run the comprehensive test suite with:
\`\`\`bash
npm run test
\`\`\`

## 📌 Assumptions
- **Review Sourcing**: Since there is no free, consistently public API that directly provides structured audience comments for every IMDb ID (IMDb does not have an official open API for scraping reviews), the app programmatically aggregates IMDb ratings and votes, then feeds them as structured "simulated review contexts" to the AI to evaluate. This works effectively for demonstration purposes.
- **AI Fallback mechanism**: Knowing that OpenAI keys can expire or be unavailable during a review process, a full heuristic-based sentiment analyzer was explicitly built into the API as a fallback to ensure the app functions perfectly under all conditions.
- **Image handling**: External domains (IMDb, Amazon) are allowed in `next.config.ts` so remote OMDB posters load correctly.
