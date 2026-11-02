
async function getNews(query) {
  if (!process.env.NEWS_API_KEY) {
    throw new Error("NEWS_API_KEY is missing from .env");
  }

  if (typeof query !== "string" || !query.trim()) {
    throw new Error("A news search query is required");
  }

  const url = new URL(
    "https://newsapi.org/v2/top-headlines"
  );

  url.searchParams.set("q", query.trim());
  url.searchParams.set("pageSize", "5");
  url.searchParams.set("apiKey", process.env.NEWS_API_KEY);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`News API HTTP error: ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== "ok") {
    throw new Error(data.message || "News API request failed");
  }

  return {
    query,
    totalResults: data.totalResults,
    articles: data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      source: article.source?.name,
      publishedAt: article.publishedAt,
      url: article.url,
    })),
    fetchedAt: new Date().toISOString(),
  };
}

module.exports = { getNews };
