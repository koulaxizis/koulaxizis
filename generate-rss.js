// generate-rss.js
const fs = require('fs');

// ΑΦΑΙΡΕΣΗ: Το TAG_LABELS δεν χρειάζεται πια

try {
  // 1. Διαβάζουμε το JSON
  const rawData = fs.readFileSync('updates.json', 'utf8');
  const data = JSON.parse(rawData);

  if (!data.updates || !Array.isArray(data.updates)) {
    throw new Error('Το JSON δεν περιέχει πίνακα "updates"');
  }

  const updates = data.updates;
  const siteUrl = 'https://koulaxizis.gr';
  const siteTitle = 'Ενημερώσεις από το koulaxizis.gr';
  const siteDesc = 'Τελευταίες ενημερώσεις από τον Χρήστο Κουλαξίζη';

  // Escape function για XML
  const escapeXml = (str) => {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  // Λειτουργία για αφαίρεση HTML tags και whitespace
  const cleanContent = (html) => {
    if (typeof html !== 'string') return '';
    let text = html.replace(/<[^>]*>?/gm, '');
    return text.replace(/\s+/g, ' ').trim();
  };

  // RFC 822 Date Format
  const toRFC822Date = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return new Date().toUTCString();
    return date.toUTCString();
  };

  // Συνάρτηση για δημιουργία string με Tags (για το description)
  // ΑΦΑΙΡΕΣΗ: Εμφανίζει μόνο τα emojis
  const formatTagsForDescription = (tags) => {
    if (!tags || !Array.isArray(tags) || tags.length === 0) return '';
    return tags.join(' ');
  };

  // Συνάρτηση για δημιουργία λίστας κατηγοριών (για το <category>)
  // ΑΦΑΙΡΕΣΗ: Επιστρέφει μόνο τα emojis
  const getCategories = (tags) => {
    if (!tags || !Array.isArray(tags)) return [];
    return tags;
  };

  // Ταξινόμηση: Πιο πρόσφατα πρώτα
  const sortedUpdates = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date));

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDesc)}</description>
    <language>el-gr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
`;

  sortedUpdates.forEach((update) => {
    const pubDate = toRFC822Date(update.date);
    
    const rawContent = update.content || '';
    const cleanText = cleanContent(rawContent);
    
    // Δημιουργία Title (πρώτα 60 χαρακτήρες)
    const title = escapeXml(cleanText.length > 60 ? cleanText.substring(0, 60) + '...' : cleanText);
    
    // --- ΕΝΣΩΜΑΤΩΣΗ TAGS (ΜΟΝΟ EMOJIS) ---
    // 1. Προσθήκη Tags στο Description (ως κείμενο)
    const tagsString = formatTagsForDescription(update.tags);
    const fullDescription = tagsString ? `${tagsString}\n\n${cleanText}` : cleanText;
    
    // 2. Λίστα Categories για το RSS
    const categories = getCategories(update.tags);

    // Unique Key για GUID
    const uniqueKey = `${update.date}|${cleanText}`;
    const guid = `${siteUrl}/update/${encodeURIComponent(uniqueKey)}`;

    xml += `    <item>
      <title>${title}</title>
      <description><![CDATA[${escapeXml(fullDescription)}]]></description>
      <link>${siteUrl}/#updates</link>
      <guid isPermaLink="false">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
`;

    // Προσθήκη <category> για κάθε tag (μόνο emoji)
    categories.forEach(cat => {
        xml += `      <category>${escapeXml(cat)}</category>\n`;
    });

    xml += `    </item>
`;
  });

  xml += `  </channel>
</rss>`;

  fs.writeFileSync('feed.xml', xml, 'utf8');
  console.log('✅ RSS Feed generated successfully!');
  console.log(`   - Περιλαμβάνει ${sortedUpdates.length} αναρτήσεις.`);
  console.log(`   - Τα Tags εμφανίζονται ως emojis.`);
  process.exit(0);

} catch (err) {
  console.error('❌ Σφάλμα:', err.message);
  process.exit(1);
}