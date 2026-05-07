// generate-rss.js
const fs = require('fs');

try {
  // 1. Διαβάζουμε το JSON
  const rawData = fs.readFileSync('updates.json', 'utf8');
  const data = JSON.parse(rawData);

  if (!data.updates || !Array.isArray(data.updates)) {
    throw new Error('Το JSON δεν περιέχει πίνακα "updates"');
  }

  const updates = data.updates;
  const siteUrl = 'https://koulaxizis.gr';
  const siteTitle = 'Ενημερώσεις Χρήστου Κουλαξίζη';
  const siteDesc = 'Τελευταίες ενημερώσεις από τον Χρήστο Κουλαξίζη';

  // Escape function για XML
  const escapeXml = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;'
    })[char]);
  };

  let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDesc)}</description>
    <language>el-gr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
`;

  // Ταξινόμηση (πιο πρόσφατα πρώτα)
  const sortedUpdates = [...updates].sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedUpdates.forEach(update => {
    const date = new Date(update.date);
    const pubDate = date.toUTCString();
    const content = escapeXml(update.content || '');
    const title = escapeXml(content.length > 60 ? content.substring(0, 60) + '...' : content);

    xml += `
    <item>
      <title>${title}</title>
      <description><![CDATA[${content}]]></description>
      <link>${siteUrl}/#updates</link>
      <guid isPermaLink="false">${update.date}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>
`;
  });

  xml += `
  </channel>
</rss>`;

  // 2. Γράψιμο στο αρχείο
  fs.writeFileSync('feed.xml', xml);
  console.log('RSS Feed generated successfully!');
  process.exit(0);

} catch (err) {
  console.error('Σφάλμα:', err.message);
  process.exit(1);
}