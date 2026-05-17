// post-social.js
const fs = require('fs');
const path = require('path');
const { BskyAgent } = require('@atproto/api');

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
    console.log('✅ Mastodon: Posted successfully');
    return { success: true, url: result.url };
  } catch (error) {
    console.error('❌ Mastodon failed:', error.message);
    return { success: false, error: error.message };
  }
}

// ============================================
// Bluesky Function
// ============================================
async function postToBluesky(content, handle, password) {
  try {
    const agent = new BskyAgent({ service: 'https://bsky.social' });
    await agent.login({ identifier: handle, password });
    
    const response = await agent.post({
      text: content,
      createdAt: new Date().toISOString()
    });
    
    console.log('✅ Bluesky: Posted successfully');
    return { success: true, uri: response.uri };
  } catch (error) {
    console.error('❌ Bluesky failed:', error.message);
    return { success: false, error: error.message };
  }
}

// ============================================
// Main Function
// ============================================
async function main() {
  console.log('🚀 Starting social auto-post...\n');
  
  // Read updates.json
  const updatesPath = path.join(process.cwd(), 'updates.json');
  
  if (!fs.existsSync(updatesPath)) {
    console.error('❌ updates.json not found');
    process.exit(1);
  }
  
  const updatesData = JSON.parse(fs.readFileSync(updatesPath, 'utf8'));
  
  if (!updatesData.updates || updatesData.updates.length === 0) {
    console.log('⚠️ No updates found');
    process.exit(0);
  }
  
  // Get latest update (first item)
  const latestUpdate = updatesData.updates[0];
  const content = latestUpdate.content;
  const displayDate = latestUpdate.displayDate || latestUpdate.date;
  
  // Get publish preferences (default: both true if missing)
  const prefs = latestUpdate.publishTo || { mastodon: true, bluesky: true };
  const enabledNetworks = [];
  
  if (prefs.mastodon) enabledNetworks.push('mastodon');
  if (prefs.bluesky) enabledNetworks.push('bluesky');
  
  if (enabledNetworks.length === 0) {
    console.log('⚠️ No networks selected for publishing');
    process.exit(0);
  }
  
  console.log(`📝 Content preview: "${content.substring(0, 80)}..."`);
  console.log(`📅 Date: ${displayDate}`);
  console.log(`🌐 Networks: ${enabledNetworks.join(', ')}\n`);
  
  // Build final message
  const message = `${content}\n\n📅 ${displayDate}\n🔗 https://koulaxizis.gr`;
  
  // Check character limits
  const limits = { mastodon: 500, bluesky: 300 };
  for (const network of enabledNetworks) {
    if (message.length > limits[network]) {
      console.warn(`⚠️ ${network}: Message (${message.length} chars) exceeds limit (${limits[network]})`);
    }
  }
  
  // Execute posts
  const results = {};
  
  if (enabledNetworks.includes('mastodon')) {
    const instanceUrl = process.env.MASTODON_INSTANCE_URL || 'https://mastodon.social';
    const accessToken = process.env.MASTODON_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.error('❌ MASTODON_ACCESS_TOKEN not set');
      results.mastodon = { success: false, error: 'Missing secret' };
    } else {
      results.mastodon = await postToMastodon(message, instanceUrl, accessToken);
    }
  }
  
  if (enabledNetworks.includes('bluesky')) {
    const handle = process.env.BLUESKY_HANDLE;
    const password = process.env.BLUESKY_PASSWORD;
    
    if (!handle || !password) {
      console.error('❌ BLUESKY credentials not set');
      results.bluesky = { success: false, error: 'Missing secrets' };
    } else {
      results.bluesky = await postToBluesky(message, handle, password);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESULTS SUMMARY');
  console.log('='.repeat(50));
  
  let successCount = 0;
  for (const [network, result] of Object.entries(results)) {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${network.toUpperCase()}: ${result.success ? 'Success' : result.error}`);
    if (result.success) successCount++;
  }
  
  console.log('='.repeat(50));
  console.log(`🎉 ${successCount}/${Object.keys(results).length} successful`);
  
  process.exit(successCount > 0 ? 0 : 1);
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});