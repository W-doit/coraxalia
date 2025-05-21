## Getting Started

### Detailed Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/coraxalia.git
cd coraxalia
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

After building, you can start the production server:

```bash
npm start
# or
yarn start
```

### Deployment on Vercel

The easiest way to deploy Coraxalia is to use the [Vercel Platform](https://vercel.com):

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy

### Environment Variables

The following environment variables are required:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

### Troubleshooting

#### Common Issues

1. **Authentication not working**:
   - Check that your Supabase URL and anon key are correct
   - Ensure email provider is configured in Supabase

2. **Database tables not found**:
   - Verify you've run the SQL setup script in Supabase
   - Check for any SQL errors during table creation

3. **Profile images not uploading**:
   - Confirm the storage bucket is created and policies are set correctly
   - Check browser console for any CORS-related errors

4. **Styling issues**:
   - If the app appears as a white page with black text, try rebuilding Tailwind CSS:
     ```bash
     npx tailwindcss --input ./app/globals.css --output ./app/output.css
     ```
   - Restart the development server after rebuilding CSS

5. **PWA not installing**:
   - Ensure you're using HTTPS (required for PWA installation)
   - Verify the manifest.json file and icon files are correctly configured

For more help, please open an issue on the GitHub repository.
