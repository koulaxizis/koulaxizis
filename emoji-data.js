// === emoji-data.js - Mini Version (3 Essential Emojis) ===

window.EMOJI_MAPPING = {
    '🖼️': 'picture_frame',
    '🔥': 'fire',
    '🌲': 'evergreen_tree'
};

window.EMOJI_CATEGORIES = [
    { 
        title: '🎨 Arts & Nature', 
        emojis: ['🖼️', '🔥', '🌲'] 
    }
];

window.emojiToWord = function(emoji) {
    return window.EMOJI_MAPPING[emoji] || 'emote';
};