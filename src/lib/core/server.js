const baseUri = process.env.NEXT_PUBLIC_BASE_URI;

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUri}${path}`, {
    cache: "no-store",
  });

  const text = await res.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
};

export const serverMutation = async (api, data) => {
  const res = await fetch(`${baseUri}${api}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
};
