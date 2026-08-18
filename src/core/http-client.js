export class HttpError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

export async function requestJson(url, options = {}, fetchImpl = fetch) {
  const response = await fetchImpl(url, { ...options, headers: { Accept: "application/json", ...options.headers } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new HttpError(`Request failed (${response.status}) for ${url}`, response.status, body);
  return body;
}
