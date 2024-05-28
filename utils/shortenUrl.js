const axios = require('axios');

/**
 * Shortens a given URL using the TinyURL API.
 * 
 * This function takes a long URL and attempts to shorten it using the TinyURL API.
 * If the URL shortening fails, it returns the original URL as a fallback.
 * 
 * @param {string} longUrl - The long URL to be shortened.
 * @returns {Promise<string>} - A promise that resolves to the shortened URL or the original URL if shortening fails.
 */
async function shortenUrl(longUrl) {
  try {
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
    return response.data;
  } catch (error) {
    console.error('Error shortening URL:', error);
    return longUrl; // Fallback to the original URL if shortening fails
  }
}

module.exports = { shortenUrl };
