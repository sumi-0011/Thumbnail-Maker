export interface BlogMetadata {
  title: string;
  description: string;
  image: string;
  author?: string;
  url: string;
}

// CORS_PROXIES를 환경변수에서 읽기 (쉼표로 구분된 문자열)
function getCorsProxies(): string[] {
  const envProxies = import.meta.env.VITE_CORS_PROXIES;
  if (envProxies && typeof envProxies === "string") {
    return envProxies
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
  }

  // 기본값 (fallback)
  const defaultProxies = [
    "https://api.allorigins.win/raw?url=",
    "https://corsproxy.io/?",
  ];

  if (!envProxies) {
    console.warn(
      "VITE_CORS_PROXIES is not configured. Using default proxies. For production, configure a self-hosted proxy endpoint.",
    );
  }

  return defaultProxies;
}

const CORS_PROXIES = getCorsProxies();

// URL 스키마 검증
function validateUrl(url: string): void {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error("URL must start with http:// or https://");
  }
}

async function fetchWithProxy(url: string, timeoutMs = 5000): Promise<string> {
  validateUrl(url);

  for (const proxy of CORS_PROXIES) {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const response = await fetch(proxy + encodeURIComponent(url), {
        headers: {
          Accept: "text/html",
        },
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return await response.text();
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        // 타임아웃 - 다음 프록시 시도
        continue;
      }
      // 다른 에러도 다음 프록시 시도
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
  // URL 검증 (방어적 체크)
  validateUrl(url);

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
