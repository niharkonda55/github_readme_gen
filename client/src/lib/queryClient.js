import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey, signal }) => {
        const res = await fetch(queryKey[0], {
          signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          if (res.status >= 500) {
            throw new Error(`${res.status}: ${res.statusText}`);
          }

          if (res.status === 404) {
            throw new Error(`${res.status}: ${res.statusText}`);
          }

          if (res.status >= 400) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `${res.status}: ${res.statusText}`);
          }
        }

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        }

        return res.text();
      },
    },
  },
});

export async function apiRequest(method, url, data) {
  const config = {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const res = await fetch(url, config);

  if (!res.ok) {
    if (res.status >= 500) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }

    if (res.status >= 400) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `${res.status}: ${res.statusText}`);
    }
  }

  return res;
}