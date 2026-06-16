import { getUserToken } from "./session";

const baseUri = process.env.NEXT_PUBLIC_BASE_URI;


export const authHeader = async ()=>{
  const token = await getUserToken()
  const header = token ? {
    authorization : `Bearer ${token}`
  }: {}; 
  return header 
}

export const serverFetch = async (path) => {
  const url = `${baseUri}${path}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  const text = await res.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Invalid JSON response from:", url);
    console.error("Response was:", text);

    throw new Error("API did not return valid JSON.");
  }
};

export const serverMutation = async (api, data, method= "POST") => {
  const url = `${baseUri}${api}`;

  const res = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ... await authHeader()
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Invalid JSON response from:", url);
    console.error("Response was:", text);

    throw new Error("API did not return valid JSON.");
  }
};

export const protectedFetch = async(path)=>{
    const res = await fetch(`${baseUri}${path}`, 
      {
        headers: await authHeader()
      }
    )


    return res.json()
}