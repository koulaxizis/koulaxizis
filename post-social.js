// post-social.js
const fs = require('fs');
const path = require('path');
const { BskyAgent, RichText } = require('@atproto/api');

// ============================================
// HELPER: Delay function (για retry backoff)
// ============================================
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// HELPER: Retry wrapper για API calls
// ============================================
async function postWithRetry(postFn, maxRetries = 3, baseDelay = 1000) {
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[INFO] Attempt ${attempt}/${maxRetries}...`);
      const result = await postFn();
      
      if (result.success) {
        console.log(`[OK] Success on attempt ${attempt}`);
        return result;
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      lastError = error;
      console.warn(`[WARN] Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        const waitTime = baseDelay * attempt; // Exponential backoff: 1s, 2s, 3s
        console.log(`[INFO] Waiting ${waitTime}ms before retry...`);
        await delay(waitTime);
      }
    }
  }
  
  console.error('[ERROR] All retry attempts failed');
  return { success: false, error: lastError.message };
}

// ============================================
// HELPER: Εξαγωγή πρώτου URL από κείμενο
// ============================================
function extractFirstUrl(text) {
  const urlRegex = /(https?:\/\/[^\s<>"']+)/;
  const match = text.match(urlRegex);
  return match ? match[1] : null;
}

// ============================================
// HELPER: Fetch Open Graph Metadata
// ============================================
async function fetchOgMetadata(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KoulaxizisBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();

    const getMeta = (property) => {
      const patterns = [
        new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, 'i')
      ];
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) return decodeHTMLEntities(match[1]);
      }
      return null;
    };

    const getTitleFallback = () => {
      const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      return match ? decodeHTMLEntities(match[1].trim()) : null;
    };

    const getDescFallback = () => {
      const patterns = [
        /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i,
        /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i
      ];
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) return decodeHTMLEntities(match[1]);
      }
      return null;
    };

    const title = getMeta('og:title') || getTitleFallback() || url;
    const description = getMeta('og:description') || getDescFallback() || '';
    let image = getMeta('og:image');

    if (image && !image.startsWith('http')) {
      try {
        image = new URL(image, url).href;
      } catch (e) {
        image = null;
      }
    }

    return { uri: url, title, description, image };
  } catch (error) {
    console.warn('[WARN] Could not fetch OG metadata for', url, '-', error.message);
    return null;
  }
}

// ============================================
// HELPER: Decode HTML Entities
// ============================================
function decodeHTMLEntities(str) {
  if (!str) return str;
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'");
}

// ============================================
// Mastodon Function
// ============================================
async function postToMastodon(content, instanceUrl, accessToken) {
  try {
    const response = await fetch(`${instanceUrl}/api/v1/statuses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        status: content,
        visibility: 'public'
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
    
    const result = await response.json();
    return { success: true, url: result.url };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// Bluesky Function (ΜΕ LINK CARD EMBED)
// ============================================
async function postToBluesky(content, handle, password) {
  try {
    const agent = new BskyAgent({ service: 'https://bsky.social' });
    await agent.login({ identifier: handle, password });
    
    const rt = new RichText({ text: content });
    await rt.detectFacets(agent);
    
    let embed = undefined;
    const firstUrl = extractFirstUrl(content);
    
    if (firstUrl) {
      console.log('[INFO] Bluesky: Fetching link card for', firstUrl);
      const metadata = await fetchOgMetadata(firstUrl);
      
      if (metadata) {
        let thumbBlob = null;
        
        if (metadata.image) {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            
            const imgResponse = await fetch(metadata.image, {
              signal: controller.signal,
              headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KoulaxizisBot/1.0)' }
            });
            clearTimeout(timeout);
            
            if (imgResponse.ok) {
              const contentType = imgResponse.headers.get('content-type') || 'image/jpeg';
              const arrayBuffer = await imgResponse.arrayBuffer();
              const uint8Array = new Uint8Array(arrayBuffer);
              
              const uploadResult = await agent.uploadBlob(uint8Array, {
                encoding: contentType
              });
              
              thumbBlob = uploadResult.data.blob;
              console.log('[OK] Bluesky: Thumbnail uploaded');
            }
          } catch (imgError) {
            console.warn('[WARN] Bluesky: Could not upload thumbnail:', imgError.message);
          }
        }
        
        embed = {
          $type: 'app.bsky.embed.external',
          external: {
            uri: metadata.uri,
            title: metadata.title.substring(0, 300),
            description: metadata.description.substring(0, 300),
            ...(thumbBlob && { thumb: thumbBlob })
          }
        };
        
        console.log('[OK] Bluesky: Link card prepared -', metadata.title.substring(0, 50) + '...');
      } else {
        console.log('[WARN] Bluesky: Could not fetch metadata, posting without link card');
      }
    }
    
    const postData = {
      text: rt.text,
      facets: rt.facets,
      createdAt: new Date().toISOString()
    };
    
    if (embed) {
      postData.embed = embed;
    }
    
    const response = await agent.post(postData);
    
    return { 
      success: true, 
      uri: response.uri,
      withLinkCard: !!embed
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// Main Function
// ============================================
async function main() {
  console.log('[INFO] Starting social auto-post...\n');
  
  const updatesPath = path.join(process.cwd(), 'updates.json');
  
  if (!fs.existsSync(updatesPath)) {
    console.error('[ERROR] updates.json not found');
    process.exit(1);
  }
  
  const updatesData = JSON.parse(fs.readFileSync(updatesPath, 'utf8'));
  
  if (!updatesData.updates || updatesData.updates.length === 0) {
    console.log('[WARN] No updates found');
    process.exit(0);
  }
  
  const latestUpdate = updatesData.updates[0];
  const content = latestUpdate.content;
  
  const prefs = latestUpdate.publishTo || { mastodon: true, bluesky: true };
  const enabledNetworks = [];
  
  if (prefs.mastodon) enabledNetworks.push('mastodon');
  if (prefs.bluesky) enabledNetworks.push('bluesky');
  
  if (enabledNetworks.length === 0) {
    console.log('[WARN] No networks selected for publishing');
    process.exit(0);
  }
  
  console.log('[INFO] Content preview: "' + content.substring(0, 80) + '..."');
  console.log('[INFO] Networks: ' + enabledNetworks.join(', ') + '\n');
  
  const limits = { mastodon: 500, bluesky: 300 };
  for (const network of enabledNetworks) {
    if (content.length > limits[network]) {
      console.warn('[WARN] ' + network + ': Message (' + content.length + ' chars) exceeds limit (' + limits[network] + ')');
    }
  }
  
  const results = {};
  
  if (enabledNetworks.includes('mastodon')) {
    const instanceUrl = process.env.MASTODON_INSTANCE_URL || 'https://mastodon.social';
    const accessToken = process.env.MASTODON_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.error('[ERROR] MASTODON_ACCESS_TOKEN not set');
      results.mastodon = { success: false, error: 'Missing secret' };
    } else {
      // WRAP WITH RETRY LOGIC
      results.mastodon = await postWithRetry(
        () => postToMastodon(content, instanceUrl, accessToken),
        3, 1000
      );
    }
  }
  
  if (enabledNetworks.includes('bluesky')) {
    const handle = process.env.BLUESKY_HANDLE;
    const password = process.env.BLUESKY_PASSWORD;
    
    if (!handle || !password) {
      console.error('[ERROR] BLUESKY credentials not set');
      results.bluesky = { success: false, error: 'Missing secrets' };
    } else {
      // WRAP WITH RETRY LOGIC
      results.bluesky = await postWithRetry(
        () => postToBluesky(content, handle, password),
        3, 1000
      );
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('[RESULTS] SUMMARY');
  console.log('='.repeat(50));
  
  let successCount = 0;
  for (const [network, result] of Object.entries(results)) {
    const status = result.success ? '[OK]' : '[FAIL]';
    const extra = network === 'bluesky' && result.withLinkCard ? ' (with link card)' : '';
    console.log(status + ' ' + network.toUpperCase() + ': ' + (result.success ? 'Success' + extra : result.error));
    if (result.success) successCount++;
  }
  
  console.log('='.repeat(50));
  console.log('[SUMMARY] ' + successCount + '/' + Object.keys(results).length + ' successful');
  
  process.exit(successCount > 0 ? 0 : 1);
}

main().catch(error => {
  console.error('[FATAL] Fatal error:', error);
  process.exit(1);
});