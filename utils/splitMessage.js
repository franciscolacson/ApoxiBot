/**
 * Splits a long message into smaller chunks that fit within a specified maximum length.
 * 
 * This function splits a given message into smaller chunks, ensuring that each chunk
 * does not exceed the specified maximum length. It preserves line breaks in the message.
 * 
 * @param {string} message - The long message to be split.
 * @param {number} [maxLength=2000] - The maximum length of each message chunk (default is 2000 characters).
 * @returns {Array<string>} - An array of message chunks.
 */
function splitMessage(message, maxLength = 2000) {
  // If the message is short enough, return it as a single chunk
  if (message.length <= maxLength) {
    return [message];
  }

  const lines = message.split('\n');
  const chunks = [];
  let currentChunk = '';

  // Split the message into chunks, preserving line breaks
  for (const line of lines) {
    if (currentChunk.length + line.length + 1 > maxLength) {
      chunks.push(currentChunk);
      currentChunk = '';
    }
    currentChunk += (currentChunk ? '\n' : '') + line;
  }

  // Add any remaining content as the last chunk
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

module.exports = { splitMessage };
