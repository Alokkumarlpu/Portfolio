const transformDriveUrl = (url) => {
  if (!url || !url.includes('drive.google.com')) return url;
  
  // Extract file ID: works for /d/FILE_ID or ?id=FILE_ID
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  return url;
};

module.exports = { transformDriveUrl };
