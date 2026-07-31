# Estate Homes

Real estate platform built with React, Vite, TypeScript, Tailwind CSS, Zustand, React Router, Mapbox, and a built-in chatbot assistant.

## Development

1. Copy `.env.example` to `.env.local`
2. Add `VITE_OPENAI_API_KEY` and `VITE_MAPBOX_TOKEN`
3. Install dependencies with `npm install`
4. Start the app with `npm run dev`

## Deploy with GitHub Actions (GitHub Pages)

1. Push the repository to GitHub.
2. In GitHub, open `Settings` -> `Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to the `main` branch (or run the `Deploy to GitHub Pages` workflow manually from the `Actions` tab).

The workflow file is available at `.github/workflows/deploy.yml` and deploys the built `dist` folder.

### Deploy from a specific branch

1. Open `Actions` in your GitHub repository.
2. Select `Deploy to GitHub Pages`.
3. Click `Run workflow`.
4. Enter the branch name in `deploy_ref` (for example: `develop`).
5. Run the workflow.
