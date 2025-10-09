export default async function searchAPI(query: string) {
  try {
    // Include the backend URL with port 5000
    const response = await fetch(`http://localhost:5000/api/search?query=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`Search API failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Search API response:", data);
    return data;
  } catch (error) {
    console.error("Search API error:", error);
    throw error;
  }
}
