type SupabaseFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  params?: Record<string, string>;
  body?: unknown;
  prefer?: string;
  range?: {
    from: number;
    to: number;
  };
};

type SupabaseFetchResult<T> = {
  data: T;
  count?: number;
};

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Falta configurar SUPABASE_URL en .env.local.");
  }

  if (!serviceRoleKey) {
    throw new Error("Falta configurar SUPABASE_SERVICE_ROLE_KEY en .env.local.");
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

function parseCount(contentRange: string | null): number | undefined {
  if (!contentRange) return undefined;

  const match = contentRange.match(/\/(\d+)$/);
  if (!match) return undefined;

  return Number(match[1]);
}

export async function supabaseFetch<T>(
  table: string,
  options: SupabaseFetchOptions = {}
): Promise<SupabaseFetchResult<T>> {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();

  const url = new URL(`${supabaseUrl}/rest/v1/${table}`);

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    Accept: "application/json",
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.prefer) {
    headers.Prefer = options.prefer;
  }

  if (options.range) {
    headers["Range-Unit"] = "items";
    headers.Range = `${options.range.from}-${options.range.to}`;
  }

  const response = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers,
    body:
      options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `Error consultando Supabase REST: ${response.status} ${response.statusText}. ${text}`
    );
  }

  if (response.status === 204) {
    return {
      data: null as T,
      count: parseCount(response.headers.get("content-range")),
    };
  }

  const text = await response.text();

  return {
    data: text ? (JSON.parse(text) as T) : (null as T),
    count: parseCount(response.headers.get("content-range")),
  };
}