// === generate-rss.js ===

const fs = require('fs');
const path = require('path');

// --- ΡΥΘΜΙΣΕΙΣ ---
const baseUrl = 'https://koulaxizis.gr';
const feedPath = path.join(__dirname, 'feed.xml');
const updatesPath = path.join(__dirname, 'updates.json');

// --- ΑΝΑΓΝΩΣΗ UPDATES.JSON ---
let updates = [];
try {
    const rawData = fs.readFileSync(updatesPath, 'utf8');
    const data = JSON.parse(rawData);
    updates = data.updates || [];
} catch (err) {
    console.error('❌ Σφάλμα ανάγνωσης updates.json:', err.message);
    process.exit(1);
}

// --- ΤΑΞΙΝΟΜΗΣΗ (Νεότερα πρώτα) ---
updates.sort((a, b) => new Date(b.date) - new Date(a.date));

// --- ΔΗΜΙΟΥΡΓΙΑ RSS XML ---
let xml = '';

xml += `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n`;
xml += `  <channel>\n`;
xml += `    <title>Ενημερώσεις από το koulaxizis.gr</title>\n`;
xml += `    <link>${baseUrl}</link>\n`;
xml += `    <description>Τελευταίες ενημερώσεις από τον Χρήστο Κουλαξίζη</description>\n`;
xml += `    <language>el-gr</language>\n`;
xml += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
xml += `    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>\n`;

// --- ITEMS ---
updates.forEach(update => {
    const content = update.content || '';
    const title = content.length > 80 ? content.substring(0, 80) + '...' : content;
    const pubDate = new Date(update.date).toUTCString();
    
    // GUID: Μοναδικό αναγνωριστικό
    const guidRaw = `${baseUrl}/update/${encodeURIComponent(update.date)}|${encodeURIComponent(content)}`;
    const guid = guidRaw.replace(/%20/g, '%20');

    // Καθαρό περιεχόμενο για description (χωρίς emojis στην αρχή)
    const cleanDescription = content;

    xml += `    <item>\n`;
    xml += `      <title>${escapeXml(title)}</title>\n`;
    xml += `      <description><![CDATA[${cleanDescription}]]></description>\n`;
    xml += `      <content:encoded><![CDATA[${cleanDescription}]]></content:encoded>\n`;
    xml += `      <link>${baseUrl}/#updates</link>\n`;
    xml += `      <guid isPermaLink="false">${guidRaw}</guid>\n`;
    xml += `      <pubDate>${pubDate}</pubDate>\n`;

    // Categories (tags/emojis)
    if (update.tags && Array.isArray(update.tags)) {
        update.tags.forEach(tag => {
            xml += `      <category>${escapeXml(tag)}</category>\n`;
        });
    }

    xml += `    </item>\n`;
});

xml += `  </channel>\n`;
xml += `</rss>`;

// --- ΕΓΓΡΑΦΗ FEED.XML ---
try {
    fs.writeFileSync(feedPath, xml, 'utf8');
    console.log(`✅ feed.xml δημιουργήθηκε (${updates.length} ενημερώσεις)`);
} catch (err) {
    console.error('❌ Σφάλμα εγγραφής feed.xml:', err.message);
    process.exit(1);
}

// --- ΒΟΗΘΗΜΑΤΙΚΗ ΣΥΝΑΡΤΗΣΗ ---
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}