// api/shopify/test.js
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Shopify-Access-Token');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const shopifyUrl = process.env.VITE_SHOPIFY_STORE_URL || process.env.SHOPIFY_STORE_URL;
    const accessToken = process.env.VITE_SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_ACCESS_TOKEN;
    
    // Debug logging
    console.log('Environment check:');
    console.log('shopifyUrl exists:', !!shopifyUrl);
    console.log('shopifyUrl value:', shopifyUrl);
    console.log('accessToken exists:', !!accessToken);
    console.log('accessToken length:', accessToken ? accessToken.length : 0);
    
    if (!shopifyUrl || !accessToken) {
      return res.status(500).json({ 
        error: 'Missing environment variables',
        debug: {
          shopifyUrl: !!shopifyUrl,
          accessToken: !!accessToken,
          shopifyUrlValue: shopifyUrl || 'undefined',
          accessTokenLength: accessToken ? accessToken.length : 0
        }
      });
    }
    
    const apiUrl = `${shopifyUrl}/admin/api/2023-10/shop.json`;
    console.log('Making request to:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Shopify response status:', response.status);
    console.log('Shopify response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Shop data received');
      res.status(200).json({ 
        success: true, 
        shop: data.shop,
        message: 'Successfully connected to Shopify!',
        debug: {
          status: response.status,
          shopName: data.shop?.name
        }
      });
    } else {
      const errorText = await response.text();
      console.log('Shopify error response:', errorText);
      res.status(response.status).json({ 
        error: 'Shopify API error', 
        status: response.status,
        message: errorText,
        debug: {
          url: apiUrl,
          headers: response.headers
        }
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Connection failed', 
      message: error.message,
      stack: error.stack
    });
  }
}
