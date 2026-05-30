const BASE_URL = "https://promptbuilder-five.vercel.app/";

export function createClient(apiKey) {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  async function get(path) {
    const response = await fetch(`${BASE_URL}${path}`, { headers });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Request failed: ${response.status}`);
    }
    return response.json();
  }
  return { get };
}
