export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Missing required parameter: prompt' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Gemini API key not configured' });
        }

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = {
            contents: chatHistory,
            generationConfig: {
                responseMimeType: "application/json"
            }
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts.length > 0) {
            const jsonText = result.candidates[0].content.parts[0].text;
            try {
                const data = JSON.parse(jsonText);
                return res.status(200).json(data);
            } catch (parseError) {
                console.error('Error parsing Gemini response as JSON:', parseError);
                return res.status(500).json({ error: 'Invalid JSON response from Gemini API' });
            }
        } else {
            throw new Error("Invalid response structure from Gemini API");
        }

    } catch (error) {
        console.error('Gemini Analyze API Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}