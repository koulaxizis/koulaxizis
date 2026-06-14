# koulaxizis.gr <img src="https://koulaxizis.gr/icon-192.webp" align="right" height="50">

> **Personal Portfolio & Blog with Privacy-First Approach & Social Media Automation**  
> **Open Source • Zero Tracking • Microblogging Ready**

[License](#license) | [Setup Guide](#setup-guide) | [Social Media Features](#social-media-auto-post)

---

## 🌟 Performance Metrics ⚡

| Metric | Desktop | Mobile | Status |
| :--- | :---: | :---: | :---: |
| **Performance** | 98 | 78 | ✅ Excellent |
| **Accessibility** | 92 | 92 | ✅ Excellent |
| **Best Practices** | 92 | 92 | ✅ Excellent |
| **SEO** | 100 | 100 | ✅ Perfect |

Source: Google PageSpeed Insights

---

## 🔒 Privacy & Security Transparency

This project is built with a strong commitment to user privacy and data security. No third-party tracking or data collection occurs.

| Feature | Status | Details |
| :--- | :--- | :--- |
| **Cookies** | ❌ None | No HTTP cookies used anywhere |
| **Analytics** | ❌ None | Zero Google Analytics, Matomo, or similar |
| **Tracking Scripts** | ❌ None | No user behavior tracking |
| **Third-party Scripts** | ⚠️ Minimal | Font Awesome CDN only |
| **Local Storage** | ✅ Used | Theme preference only |
| **Data Collection** | ❌ None | Nothing sent to server |
| **Ads / Sponsors** | ❌ None | Completely ad-free |

---

## 📦 About The Project

A vanilla-coded, high-performance personal portfolio and blog system focused on privacy, speed, and autonomy. Now featuring **advanced Social Media Automation** for direct publishing to BlueSky and Mastodon.

### Key Technologies

*   **HTML5 Semantic** with JSON-LD structured data (Schema.org)
*   **CSS3 Custom Properties** for dynamic theming (Dark/Light mode)
*   **Vanilla JavaScript** (Zero dependencies) for all functionality
*   **Service Worker** for offline-first PWA support
*   **GitHub Actions** for automated social media deployment

### Open Source Philosophy

This project follows strict open culture principles:

*   **MIT License**: Free to use, modify, distribute
*   **No Vendor Lock-in**: Everything runs on standard web technologies
*   **Privacy-First Design**: User data never leaves their browser unless explicitly shared
*   **Self-Hostable**: Full control over your content and infrastructure

---

## 🚀 Quick Start Guide

### Step 1: Clone the Repository

git clone https://github.com/koulaxizis/koulaxizis.git
cd koulaxizis

### Step 2: File Structure

Main Files:
index.html - Main portfolio page
style.css - Global styles and variables
script.js - Core functionality updates theme search
sw.js - Service Worker PWA caching
manifest.json - PWA configuration
updates.json - Dynamic content feed
sitemap.xml - Site indexing map
404.html - Custom error page
LICENSE - MIT License
README.md - This file

Automation Files:
.github/workflows/social-post.yml - Social automation workflow
.github/workflows/scripts/bluesky_post.py - Python post handler

Configuration Files:
emoji_map.json - Emoji to hashtag mapping

### Step 3: Local Development Server

npx serve .

Or use any static server Apache Nginx Vercel Netlify.

**Note**: Service Worker requires HTTPS or localhost.

---

## 🤖 SOCIAL MEDIA AUTO-POST SYSTEM (NEW!)

Automated posting to **BlueSky** and **Mastodon** directly from GitHub Actions, with intelligent emoji-to-hashtag conversion and image scraping from URLs.

### ✨ Features Overview

| Feature | Description |
| :--- | :--- |
| **BlueSky Auto-Post** | Automated posting with clickable links and hashtags |
| **Mastodon Auto-Post** | Automated posting with hashtag support |
| **Emoji → Hashtag Map** | Convert emojis via JSON configuration |
| **Image Scraping** | Extract OG Image from URLs and upload as media attachment |
| **Rich Text Facets** | Clickable URLs and hashtags in BlueSky posts |
| **Draft Saving** | Save content locally before publication |
| **Character Counter** | Real-time 280-character limit monitoring |
| **Microblogging Panel** | Lightweight admin interface embedded in website |

### 🛠️ Complete Setup Guide

#### Part 1: Create GitHub Personal Access Token PAT

Required for triggering workflows and repository access.

1. Go to: GitHub Settings > Developer settings > Personal access tokens
2. Click Generate new token classic
3. Set expiration date recommended: 90 days
4. Select Scopes Critical:
   - repo - Full control of private repositories
   - workflow - Update GitHub Actions workflows
   - user - Read-only profile info optional
5. Click Generate token
6. COPY TOKEN IMMEDIATELY You cannot view it again after closing the window

#### Part 2: Add GitHub Secrets

Required for BlueSky and Mastodon authentication.

Go to: Repository > Settings > Secrets and variables > Actions > New repository secret

Add the following 4 secrets:

| Secret Name | Value Example | Where to Get It |
| :--- | :--- | :--- |
| BLUESKY_USERNAME | at-yourname.bsky.social | Your BlueSky handle |
| BLUESKY_PASSWORD | app-password-xxx | See BlueSky Section below |
| MASTODON_INSTANCE_URL | https://mastodon.social | Your Mastodon server URL |
| MASTODON_ACCESS_TOKEN | mk_xxxxx | See Mastodon Section below |

⚠️ **BlueSky App Password Instructions:**

1. Log into BlueSky
2. Navigate to: Settings > App Passwords
3. Click Create New App Password
4. Name it: github-actions
5. Copy the generated password immediately you cannot see it again
6. Paste this value into the BLUESKY_PASSWORD secret field

⚠️ **Mastodon Access Token Instructions:**

1. Log into your Mastodon account
2. Navigate to: Settings > Developer > Applications or Settings > Apps
3. Click New Application or Register New Application
4. Application name: Github Actions Bot
5. Select scopes: write for posting status
6. Generate and copy the Access Token
7. Paste this value into the MASTODON_ACCESS_TOKEN secret field

#### Part 3: Create emoji_map.json

In your repository root folder, create a file named emoji_map.json:

{
  "😀": "Smile",
  "😃": "Laugh",
  "😊": "Happy",
  "📚": "Books",
  "🎥": "Cinema",
  "🎬": "Movies",
  "🎵": "Music",
  "🔥": "Trending",
  "💡": "Idea",
  "✍️": "Writing",
  "❤️": "Love",
  "✨": "Sparkle",
  "🇬🇷": "Greece",
  "🇮🇹": "Italy"
}

Edit this file to include all emojis you want to convert to hashtags.

#### Part 4: Configure Admin Panel Optional Local Testing

For testing without GitHub Actions:

1. Run local server: npx serve .
2. Open admin.html in browser
3. Navigate to GitHub Token Settings
4. Paste your PAT from Part 1 for local workflow dispatch

**Note**: For automated production deployment, GitHub Secrets are sufficient no local token needed.

#### Part 5: Test Workflow

1. Go to repository Actions tab
2. Find Social Media Auto-Post workflow
3. Click Run workflow
4. Fill in the form:
   - Content: New film release example.com/myfilm
   - Tags: 📚 🔥
   - Hashtags Convert: ON
   - Bluesky Post: ON
   - Mastodon Post: OFF for first test
5. Click Run workflow
6. Monitor logs for success messages SUCCESS Posted to

---

## 📝 Admin Panel Usage

Accessible through admin.html when running locally or deployed.

### Input Fields

| Field | Example | Notes |
| :--- | :--- | :--- |
| **Content** | New update example.com 📚 🔥 | Max 280 chars. URL required for image preview |
| **Tags** | 📚 🔥 💡 | Select from emoji palette dropdown |
| **Date/Time** | Auto-filled | Current timestamp |
| **Emoji Conversion** | ON/OFF | Converts emojis to hashtags if enabled |
| **Post to Bluesky** | ON/OFF | Requires secrets configured |
| **Post to Mastodon** | ON/OFF | Requires secrets configured |

### Admin Features

*   **Draft Saving**: Content auto-saves to localStorage prevents data loss
*   **Character Counter**: Real-time count with color warnings yellow/red
*   **Palette Selector**: Scrollable emoji palette organized by category
*   **Recent Emojis**: Automatically tracks recently used tags
*   **Special Characters**: Quick-insert buttons for common symbols
*   **Clear Button**: Reset all fields instantly
*   **Token Management**: Secure GitHub credentials section optional for local testing

---

## 📑 Detailed Functional Breakdown

### 1. Updates System Dynamic Content Engine

*   **JSON-Based Loading**: All blog/news entries stored in updates.json
*   **No Database Required**: Static content with dynamic fetching
*   **Smart Filtering**: Filter by Tag emoji icons plus full-text search
*   **Pagination**: Load More button with progressive rendering
*   **Share Functionality**: 
  *   Mobile: Native Web Share API
  *   Desktop: Clipboard copy with one click
*   **Timestamp Sorting**: Newest entries appear first automatically

### 2. Theme Management System

*   **Auto-Detect**: Respects system prefers-color-scheme setting
*   **Manual Toggle**: Switch between Dark/Light modes instantly
*   **Persistence**: Choice saved to localStorage survives browser restart
*   **CSS Variables**: Runtime variable switching without page reload
*   **Smooth Transitions**: Animated theme change no flash

### 3. PWA Integration

*   **Install Prompt**: Automatic install banner when supported
*   **Offline Support**: Pages load without internet connection
*   **App Shell Model**: Fast initial shell loading async data fetching
*   **Cache Strategy**: Stale-while-revalidate for optimal performance
*   **Manifest Config**: Custom icon name start URL display mode

### 4. SEO and AI Optimization

*   **Structured Data**: JSON-LD schemas for Person Organization WebPage
*   **Semantic HTML**: Proper use of article aside nav header tags
*   **Anchor Sitemap**: Comprehensive link map for crawlers
*   **Meta Tags**: Title description og:image twitter:card prepared
*   **Robots.txt**: Configured for proper indexing

### 5. Error Handling

*   **Custom 404 Page**: Shows latest update instead of dead-end
*   **Graceful Degradation**: Fallback UI if JavaScript fails
*   **Network Retry**: Failed fetch attempts retry automatically
*   **Log Console**: Debug information available in browser console

---

## 🔧 Customization Guide

### Color Theme style.css

Modify CSS variables to match your brand:

:root {
  --bg-color: #121212;
  --text-color: #e0e0e0;
  --primary: #bb86fc;
  --border-color: #444;
  --success: #4CAF50;
  --error: #f44336;
  --warning: #ffc107;
}

### Content Updates

*   **index.html**: Edit layout structure and static content sections
*   **updates.json**: Add/edit/remove blog/news entries dynamically
*   **manifest.json**: Change app name short_name theme_color icons

### SEO Meta Tags

Update head in index.html:

<meta property="og:title" content="Your Page Title Here">
<meta property="og:description" content="Your description here">
<meta property="og:image" content="https://yoursite.com/thumbnail.jpg">
<meta property="og:url" content="https://yoursite.com/page-url">
<meta name="twitter:card" content="summary_large_image">

### Emoji Mapping Expansion

Add more emojis to emoji_map.json following the same JSON key-value pattern. Use consistent English words for hashtags better international discoverability.

---

## ❓ Troubleshooting

### Problem: Social Media Post Fails

| Check | Solution |
| :--- | :--- |
| **GitHub Secrets** | Verify all 4 secrets exist with correct values |
| **PAT Scopes** | Ensure repo and workflow scopes are selected |
| **Emoji Map** | Check all posted emojis exist in emoji_map.json |
| **Workflow Logs** | Read execution logs for specific error messages |
| **Token Validity** | PAT may have expired regenerate if needed |

### Problem: Link Preview Image Not Showing BlueSky

| Cause | Solution |
| :--- | :--- |
| **Missing og:image** | Target URL must have meta og:image tag |
| **Test with Known Site** | Try apple.com to confirm system works |
| **Crawler Delay** | BlueSky may take 5-10 minutes to cache first preview |
| **Invalid Image URL** | Ensure scraped image returns valid image Content-Type |

### Problem: Workflow Not Triggering

| Check | Solution |
| :--- | :--- |
| **Actions Tab** | Enable Actions if disabled in repository settings |
| **Workflow Syntax** | Check .github/workflows/social-post.yml for YAML errors |
| **Trigger Event** | Verify workflow_dispatch event is correctly configured |
| **Secrets Missing** | Ensure required environment variables are defined |

### Problem: Images Don't Upload

| Cause | Solution |
| :--- | :--- |
| **Image Size** | Keep images under 4MB BlueSky limit |
| **Format Support** | Use JPEG PNG WEBP formats only |
| **Network Timeout** | Increase timeout values in Python script if needed |
| **Blob Upload** | Check upload endpoint response in logs |

---

## 📄 License and Contributing

### License Information

This project is released under the **MIT License**, giving you complete freedom to:

*   **Use** the code commercially or personally
*   **Modify** the code to fit your needs
*   **Distribute** copies of the original or modified versions
*   **Sublicense** without restriction

Copyright © 2026 Christos Koulaxizis

Full license text included in LICENSE file in repository root.

### Contribution Guidelines

Contributions are welcome To contribute:

1. Fork the repository
2. Create feature branch git checkout -b featureAmazingFeature
3. Commit changes git commit -m Add AmazingFeature
4. Push to branch git push origin featureAmazingFeature
5. Open Pull Request

Please follow these guidelines:
*   Maintain privacy-first philosophy in all new features
*   Keep dependencies minimal vanilla preferred
*   Document all new configurations in README
*   Test thoroughly before submitting PR

---

## 📞 Contact and Support

*   **Issues**: Report bugs or request features on GitHub Issues


---

<div align="center">

**Built with ❤️ by Christos Koulaxizis**  
*Privacy • Minimalism • Open Source • Social Media Automation v2.0*

</div>

---

<div style="page-break-after: always;"></div>

---

## Changelog

### v2.0 Social Media Ready 2026

*   Added BlueSky and Mastodon auto-post automation
*   Implemented emoji-to-hashtag conversion system
*   Built image scraping for OG Image extraction
*   Created admin panel with draft saving
*   Added Rich Text Facets support for clickable links
*   Integrated character counter and validation
*   Enhanced GitHub Actions workflow system

### v1.0 Privacy First 2025

*   Initial release with vanilla stack
*   Dark/Light theme system
*   Offline PWA support
*   JSON-based content management
*   Zero-tracking architecture
*   Performance optimized Lighthouse 98+

---

## Acknowledgments

*   BlueSky AT Protocol team for modern social API
*   Mastodon community for federated social standards
*   Web Standards community for privacy-respecting technologies
*   Open Source community for sustainable software practices

---

<div align="center">

Made with ❤️ by Christos Koulaxizis  
Privacy • Minimalism • Open Source • Social Media Automation

</div>