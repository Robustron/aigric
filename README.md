# FarmWise AI Compass 🌱

A cloud-native web application that provides real-time, location-specific farming recommendations powered by AI and weather data.

## 🌟 Features

- **Real-time Location Analysis**: Get instant farming recommendations based on your exact location
- **Weather Integration**: Uses OpenWeatherMap API to fetch current weather conditions
- **AI-Powered Insights**: Leverages Google Gemini AI for intelligent crop recommendations
- **Detailed Recommendations**: Includes soil preparation, watering schedules, fertilizer needs, and pest management
- **Alternative Suggestions**: Provides backup crop options with reasoning
- **Cloud-Native Architecture**: Built on modern cloud services for scalability and reliability

## 🏗️ Technology Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn-ui for UI components
- Vercel for hosting

### Backend
- Supabase Edge Functions (Serverless)
- PostgreSQL Database
- Supabase Authentication
- Google Gemini AI API
- OpenWeatherMap API

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Supabase account
- Google Cloud account (for Gemini API)
- OpenWeatherMap API key

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/farmwise-ai-compass.git
cd farmwise-ai-compass
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

### Deployment

1. **Frontend Deployment (Vercel)**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy

2. **Backend Deployment (Supabase)**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Deploy functions
   supabase functions deploy api --project-ref your-project-ref --no-verify-jwt
   supabase functions deploy fetch-weather --project-ref your-project-ref
   supabase functions deploy generate-recommendations --project-ref your-project-ref

   # Set secrets
   supabase secrets set WEATHER_API_KEY=your_weather_api_key
   supabase secrets set GEMINI_API_KEY=your_gemini_api_key
   ```

## 📚 Project Structure

```
farmwise-ai-compass/
├── src/
│   ├── components/
│   │   ├── landing/
│   │   │   ├── RecommendationFinder.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   └── CtaSection.tsx
│   │   └── ...
│   ├── lib/
│   │   └── supabaseClient.ts
│   └── ...
├── supabase/
│   └── functions/
│       ├── api/
│       ├── fetch-weather/
│       └── generate-recommendations/
└── ...
```

## 🔒 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS) for data protection
- Secure API key management through Supabase secrets
- CORS configuration for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent recommendations
- OpenWeatherMap for weather data
- Supabase for backend infrastructure
- Vercel for frontend hosting
- All contributors and supporters of the project

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ for farmers and agricultural enthusiasts
