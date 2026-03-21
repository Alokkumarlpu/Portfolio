export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getInitials = (name) => {
  const names = name.split(' ');
  return names
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};
