// Cloudflare Worker script to handle API proxying to backend tunnel
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API requests - proxy to your tunnel
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }
    
    // Handle static assets
    return env.ASSETS.fetch(request);
  },
};

async function handleApiRequest(request, env) {
  const url = new URL(request.url);
  
  // Get the backend tunnel URL from environment variable
  const backendUrl = env.BACKEND_TUNNEL_URL;
  
  if (!backendUrl) {
    return new Response(JSON.stringify({ 
      error: 'Backend tunnel URL not configured' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Construct the target URL
  const targetUrl = new URL(url.pathname + url.search, backendUrl);
  
  // Add authentication headers
  const headers = new Headers(request.headers);
  
  // Option A: Cloudflare Access (if configured)
  if (env.CF_ACCESS_CLIENT_ID && env.CF_ACCESS_CLIENT_SECRET) {
    headers.set('CF-Access-Client-Id', env.CF_ACCESS_CLIENT_ID);
    headers.set('CF-Access-Client-Secret', env.CF_ACCESS_CLIENT_SECRET);
  }
  
  // Option B: Custom secret header (fallback)
  if (env.BACKEND_SECRET_KEY) {
    headers.set('X-Worker-Secret', env.BACKEND_SECRET_KEY);
  }

  // Create a new request with the same method, headers, and body
  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
  });
  
  try {
    // Forward the request to your tunnel
    const response = await fetch(proxyRequest);
    
    // Create a new response with CORS headers
    const proxyResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
    return proxyResponse;
    
  } catch (error) {
    console.error('Error proxying request:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to connect to backend',
      details: error.message 
    }), {
      status: 502,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}