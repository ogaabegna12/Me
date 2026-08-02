// Vercel Serverless Function - MetaSearch API
export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Health check
        if (req.url === '/api/health' && req.method === 'GET') {
            return res.status(200).json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                uptime: process.uptime()
            });
        }

        // Main search endpoint
        if (req.url === '/api/search' && req.method === 'POST') {
            const { query, userId } = req.body;

            // Validate
            if (!query || typeof query !== 'string' || query.trim().length < 2) {
                return res.status(400).json({
                    error: 'Invalid query',
                    message: 'Query must be at least 2 characters'
                });
            }

            const cleanQuery = query.trim();

            // Log (optional)
            console.log(`[Search] "${cleanQuery}" | User: ${userId || 'anon'}`);

            // Perform search
            const results = await performSearch(cleanQuery);

            return res.status(200).json({
                query: cleanQuery,
                results: results,
                count: results.length,
                cached: false,
                timestamp: new Date().toISOString()
            });
        }

        // 404
        return res.status(404).json({
            error: 'Endpoint not found',
            path: req.url,
            method: req.method
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}

/**
 * SEARCH FUNCTION
 * Replace this with your actual search implementation
 * 
 * Options:
 * 1. Google Custom Search API
 * 2. Bing Search API
 * 3. Your own database
 * 4. WordPress posts (if you integrate)
 */
async function performSearch(query) {
    // DEFAULT: Return mock results
    // Replace with real search below
    
    const mockResults = [
        {
            title: `Search: ${query}`,
            snippet: `Results for "${query}". Replace performSearch() function with your actual search engine.`,
            url: `https://google.com/search?q=${encodeURIComponent(query)}`
        },
        {
            title: 'MetaSearch Documentation',
            snippet: 'Learn how to integrate a real search engine with your extension.',
            url: 'https://github.com'
        },
        {
            title: `Local search for: ${query}`,
            snippet: 'This is where your real search results would appear.',
            url: `https://example.com/search?q=${encodeURIComponent(query)}`
        }
    ];

    return mockResults;

    /**
     * OPTION 1: Google Custom Search
     * Uncomment to use (set environment variables first)
     */
    /*
    const googleApiKey = process.env.GOOGLE_API_KEY;
    const googleSearchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!googleApiKey || !googleSearchEngineId) {
        throw new Error('Google API credentials not configured');
    }

    try {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${googleApiKey}&cx=${googleSearchEngineId}&num=8`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.items) return [];

        return data.items.map(item => ({
            title: item.title,
            snippet: item.snippet,
            url: item.link
        }));
    } catch (error) {
        console.error('Google search error:', error);
        return [];
    }
    */

    /**
     * OPTION 2: Bing Search
     * Uncomment to use
     */
    /*
    const bingApiKey = process.env.BING_API_KEY;

    if (!bingApiKey) {
        throw new Error('Bing API key not configured');
    }

    try {
        const response = await fetch(
            `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=8`,
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': bingApiKey
                }
            }
        );

        const data = await response.json();

        return data.webPages.value.map(item => ({
            title: item.name,
            snippet: item.snippet,
            url: item.url
        }));
    } catch (error) {
        console.error('Bing search error:', error);
        return [];
    }
    */

    /**
     * OPTION 3: Local database search
     * Connect to your own database
     */
    /*
    try {
        const response = await fetch(`${process.env.INTERNAL_DB_URL}/search?q=${query}`);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Database search error:', error);
        return [];
    }
    */
}
