import type { NextApiRequest, NextApiResponse } from 'next';
import { Client, RenderOptions } from 'creatomate'; // Import Creatomate Node library

// Initialize the Creatomate client with your API key from environment variables
// IMPORTANT: Do this *outside* the handler to reuse the client instance
const client = process.env.CREATOMATE_API_KEY
  ? new Client(process.env.CREATOMATE_API_KEY)
  : null; // Handle case where key might be missing

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Check if the API key is configured
  if (!client) {
    console.error('API Route Error: CREATOMATE_API_KEY is not set.');
    return res.status(500).json({ message: 'Server configuration error: API key missing.' });
  }

  // Check if the request body contains the source
  if (!req.body || !req.body.source) {
     return res.status(400).json({ message: 'Bad Request: Missing "source" in request body.' });
  }

  try {
    const options: RenderOptions = {
      source: req.body.source,
      // You can add other options here, e.g.:
      // outputFormat: 'mp4', // Default is mp4
      // quality: 'high',
      // webhookUrl: 'https://your-app.com/api/render-callback', // For notifications
    };

    console.log('API Route: Sending render request to Creatomate...');
    const renders = await client.render(options);

    console.log('API Route: Render request successful:', renders);

    // Send back the first render result (usually there's only one unless you batch)
    // This typically includes the render ID, status, and potentially a URL if using synchronous rendering (not recommended for long videos)
    // or if the render completes very quickly.
    res.status(200).json(renders[0]);

  } catch (error) {
    console.error('API Route Error: Failed to process render request:', error);
    // Provide a more informative error message if possible
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during rendering.';
    res.status(500).json({ message: `Failed to start render: ${errorMessage}` });
  }
} 