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
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  // Λειτουργία για αφαίρεση HTML tags (ΔΙΟΡΘΩΜΕΝΗ για Node.js)
  // Χρησιμοποιεί Regex αντί για document.createElement
  const stripHtml = (html) => {
    if (typeof html !== 'string') return '';
    // Αφαιρεί τα tags (<a>, <b>, <br>, κλπ.) και κρατάει μόνο το κείμενο
    return html.replace(/<[^>]*>?/gm, '');
  };

  // RFC 822 Date Format
  const toRFC822Date = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return new Date().toUTCString();
    return date.toUTCString();
  };

  // Ταξινόμηση
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

  sortedUpdates.forEach((update, index) => {
    const pubDate = toRFC822Date(update.date);
    
    // Καθαρισμός κειμένου από HTML tags για το RSS
    let content = update.content || '';
    const cleanContent = stripHtml(content); // Τώρα δουλεύει στο Node.js!
    
    const title = escapeXml(cleanContent.length > 60 ? cleanContent.substring(0, 60) + '...' : cleanContent);
    const guid = `${siteUrl}/update-${Date.now()}-${index}`;

    xml += `    <item>
      <title>${title}</title>
      <description><![CDATA[${escapeXml(cleanContent)}]]></description>
      <link>${siteUrl}/#updates</link>
      <guid isPermaLink="false">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>
`;
  });

  xml += `  </channel>
</rss>`;

  fs.writeFileSync('feed.xml', xml, 'utf8');
  console.log('RSS Feed generated successfully!');
  process.exit(0);

} catch (err) {
  console.error('Σφάλμα:', err.message);
  process.exit(1);
}