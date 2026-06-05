const baseUri = process.env.NEXT_PUBLIC_BASE_URI;

export const serverMutation = async (api, data) => {
    const res = await fetch(`${baseUri}${api}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return res.json();
}