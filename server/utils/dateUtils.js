const parseMonthYear = (dateString) => {
  if (!dateString) return new Date(0);
  
  const months = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11,
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
  };

  const parts = dateString.trim().split(' ');
  let month = 0;
  let year = new Date().getFullYear();

  if (parts.length >= 2) {
    // Handle "Nov 2025" or "November 2025"
    const m = parts[0];
    month = months[m] !== undefined ? months[m] : 0;
    year = parseInt(parts[1]) || new Date().getFullYear();
  } else if (parts.length === 1) {
    // Handle "2025"
    year = parseInt(parts[0]) || new Date().getFullYear();
  }

  return new Date(year, month, 1);
};

module.exports = { parseMonthYear };
