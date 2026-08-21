 
export function extractErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  const data = err?.response?.data;
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data.join(' ');
  if (data.non_field_errors) {
    return Array.isArray(data.non_field_errors) ? data.non_field_errors.join(' ') : data.non_field_errors;
  }
  if (data.detail) return data.detail;

  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const val = data[firstKey];
    return Array.isArray(val) ? val.join(' ') : String(val);
  }
  return fallback;
}