export default function handler(req, res) {
  if (req.method === 'POST') {
    const { level, message, timestamp, url, stack } = req.body;
    
    // Log to server console (visible in Vercel dev output)
    console.log(`[BROWSER ${level.toUpperCase()}] ${timestamp} - ${url}`);
    console.log(`Message: ${message}`);
    if (stack) {
      console.log(`Stack: ${stack}`);
    }
    console.log('---');
    
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}