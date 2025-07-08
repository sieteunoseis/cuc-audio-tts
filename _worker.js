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
  
  // Create headers for private network request
  const headers = new Headers(request.headers);
  
  // Optional: Add custom secret header for additional security
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