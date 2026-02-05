export interface BlogMetadata {
  title: string;
  description: string;
  image: string;
  author?: string;
  url: string;
}

const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
];

async function fetchWithProxy(url: string): Promise<string> {
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(proxy + encodeURIComponent(url), {
        headers: {
          Accept: "text/html",
        },
      });
      if (response.ok) {
        return await response.text();
      }
    } catch {
      continue;
    }
  }
  throw new Error("Failed to fetch URL through all proxies");
}

function extractMetaContent(html: string, selectors: string[]): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  for (const selector of selectors) {
    const element = doc.querySelector(selector);
    if (element) {
      const content = element.getAttribute("content") || element.textContent;
      if (content?.trim()) {
        return content.trim();
      }
    }
  }
  return "";
}

export async function fetchBlogMetadata(url: string): Promise<BlogMetadata> {
  const html = await fetchWithProxy(url);

  const title = extractMetaContent(html, [
    'meta[property="og:title"]',
    'meta[name="twitter:title"]',
    "title",
  ]);

  const description = extractMetaContent(html, [
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
    'meta[name="description"]',
  ]);

  const image = extractMetaContent(html, [
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
    'meta[name="image"]',
  ]);

  const author = extractMetaContent(html, [
    'meta[property="article:author"]',
    'meta[name="author"]',
    'meta[property="og:site_name"]',
  ]);

  return {
    title: title || "Untitled",
    description: description || "",
    image: image || "",
    author: author || undefined,
    url,
  };
}
