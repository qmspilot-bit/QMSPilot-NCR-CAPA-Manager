export function workspaceFromRequest(request: Request) {
  const email = request.headers.get("oai-authenticated-user-email")?.trim().toLowerCase();
  return email ? `user:${email}` : "qmspilot-demo";
}

export function actorFromRequest(request: Request) {
  const encoded = request.headers.get("oai-authenticated-user-full-name");
  const encoding = request.headers.get("oai-authenticated-user-full-name-encoding");
  if (encoded && encoding === "percent-encoded-utf-8") {
    try {
      return decodeURIComponent(encoded);
    } catch {
      // Fall through to the email-safe default.
    }
  }
  return request.headers.get("oai-authenticated-user-email") ?? "Donald Davidson";
}

export function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  const hint = message.includes("no such table")
    ? "The workspace database is still initializing. Please try again in a moment."
    : "The request could not be completed.";
  return Response.json({ error: hint, detail: message }, { status: 500 });
}
