// Cloudflare Worker script to handle API proxying to backend tunnel
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Handle config.js request
      if (url.pathname === '/config.js') {
        return generateConfigJs(env);
      }
      
      // Handle API requests - proxy to your tunnel
      if (url.pathname.startsWith('/api/')) {
        return handleApiRequest(request, env);
      }
      
      // Handle static assets
      if (env.ASSETS) {
        const response = await env.ASSETS.fetch(request);
        
        // If asset not found and it's not a file request (no extension), serve index.html for SPA routing
        if (response.status === 404 && !url.pathname.includes('.')) {
          const indexRequest = new Request(new URL('/', request.url), request);
          return env.ASSETS.fetch(indexRequest);
        }
        
        return response;
      } else {
        // Fallback for missing assets binding
        return new Response('Assets not configured', { status: 404 });
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Worker exception',
        message: error.message,
        stack: error.stack 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },
};

function generateConfigJs(env) {
  const config = {
    BACKEND_URL: "/api", // Relative URL since Worker handles proxying
    ELEVENLABS_API_KEY: env.VITE_ELEVENLABS_API_KEY || "",
    BRANDING_URL: env.VITE_BRANDING_URL || "https://automate.builders",
    BRANDING_NAME: env.VITE_BRANDING_NAME || "Automate Builders",
    TABLE_COLUMNS: env.VITE_TABLE_COLUMNS || "name,hostname,username,password",
  };

  const configJs = `window.APP_CONFIG = ${JSON.stringify(config, null, 2)};`;
  
  return new Response(configJs, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache'
    }
  });
}

async function handleApiRequest(request, env) {
  try {
    const url = new URL(request.url);
    
    // Get the backend tunnel URL from environment variable
    const backendUrl = env.BACKEND_TUNNEL_URL;
    
    if (!backendUrl) {
      return new Response(JSON.stringify({ 
        error: 'Backend tunnel URL not configured',
        debug: 'BACKEND_TUNNEL_URL environment variable is missing'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Backend URL:', backendUrl);
    console.log('Request path:', url.pathname);
  
    // Construct the target URL
    const targetUrl = new URL(url.pathname + url.search, backendUrl);
    console.log('Target URL:', targetUrl.toString());
  
  // Create headers for private network request
  const headers = new Headers(request.headers);
  
  // Add Cloudflare Access service token headers for authentication
  if (env.CF_ACCESS_CLIENT_ID && env.CF_ACCESS_CLIENT_SECRET) {
    headers.set('CF-Access-Client-Id', env.CF_ACCESS_CLIENT_ID);
    headers.set('CF-Access-Client-Secret', env.CF_ACCESS_CLIENT_SECRET);
  }
  
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
    console.log('Sending request to backend...');
    const response = await fetch(proxyRequest);
    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', Object.fromEntries(response.headers));
    
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
  
  } catch (error) {
    console.error('API request error:', error);
    return new Response(JSON.stringify({ 
      error: 'API request exception',
      message: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}