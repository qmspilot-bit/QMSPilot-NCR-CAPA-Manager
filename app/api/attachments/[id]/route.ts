import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { attachments } from "../../../../db/schema";
import { apiError, workspaceFromRequest } from "../../_lib";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const workspaceId = workspaceFromRequest(request);
    const db = await getDb();
    const [attachment] = await db.select().from(attachments).where(and(eq(attachments.id, id), eq(attachments.workspaceId, workspaceId))).limit(1);
    if (!attachment) return new Response("Not found", { status: 404 });
    const { env } = await import("cloudflare:workers");
    const object = await env.BUCKET.get(attachment.objectKey);
    if (!object) return new Response("File unavailable", { status: 404 });
    return new Response(object.body, { headers: { "content-type": attachment.contentType, "content-disposition": `inline; filename*=UTF-8''${encodeURIComponent(attachment.fileName)}`, "cache-control": "private, max-age=60" } });
  } catch (error) {
    return apiError(error);
  }
}
