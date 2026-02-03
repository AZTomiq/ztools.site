const crypto = require('crypto');

// Helper: Calculate MD5 Hash
function getHash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// Helper to parse Frontmatter
function parseFrontmatter(content) {
  // Regex to match frontmatter:
  // Starts with ---
  // Followed by optional content
  // Ends with ---
  // Followed by remaining content
  const match = content.match(/^---\n([\s\S]*?)\n?---\n([\s\S]*)$/);
  if (!match) return { attributes: {}, body: content };

  const yaml = match[1];
  const body = match[2].trim();
  const attributes = {};

  yaml.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts.shift().trim();
      let value = parts.join(':').trim();
      // Strip surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      attributes[key] = value;
    }
  });

  return { attributes, body };
}

module.exports = {
  getHash,
  parseFrontmatter
};
