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
    const shopifyUrl = process.env.VITE_SHOPIFY_STORE_URL;
    const accessToken = process.env.VITE_SHOPIFY_ACCESS_TOKEN;
    
    if (!shopifyUrl || !accessToken) {
      return res.status(500).json({ 
        error: 'Missing environment variables',
        shopifyUrl: !!shopifyUrl,
        accessToken: !!accessToken 
      });
    }
    
    const response = await fetch(`${shopifyUrl}/admin/api/2023-10/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      res.status(200).json({ 
        success: true, 
        shop: data.shop,
        message: 'Successfully connected to Shopify!' 
      });
    } else {
      const errorText = await response.text();
      res.status(response.status).json({ 
        error: 'Shopify API error', 
        status: response.status,
        message: errorText 
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Connection failed', 
      message: error.message 
    });
  }
}
