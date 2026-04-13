export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  filename = 'export.csv'
) => {
  if (data.length === 0) return;

  // Get all unique keys from all objects
  const allKeys = Array.from(new Set(data.flatMap(item => Object.keys(item))));

  // Create CSV header
  const headers = allKeys.map(
    key => key.replace(/([A-Z])/g, ' $1').trim() // Convert camelCase to readable format
  );

  // Create CSV rows
  const rows = data.map(item =>
    allKeys.map(key => {
      const value = item[key];
      if (value === null || value === undefined) {
        return '';
      }

      // Handle nested objects
      if (typeof value === 'object' && !Array.isArray(value)) {
        // For objects like { name: 'John', email: 'john@example.com' }
        if (value.name && value.email) {
          return `${value.name} (${value.email})`;
        }
        // For other objects, stringify them
        return JSON.stringify(value);
      }

      // Handle arrays
      if (Array.isArray(value)) {
        return value.join(', ');
      }

      // Handle dates
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }

      // Convert to string and escape quotes
      return String(value).replace(/"/g, '""');
    })
  );

  // Combine headers and rows
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
