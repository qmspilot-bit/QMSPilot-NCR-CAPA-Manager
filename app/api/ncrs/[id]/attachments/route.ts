import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { attachments, ncrs } from "../../../../../db/schema";
import { apiError, workspaceFromRequest } from "../../../_lib";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf", "text/plain", "text/csv", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: ncrId } = await context.params;
    const workspaceId = workspaceFromRequest(request);
    const db = await getDb();
    const [record] = await db.select({ id: ncrs.id }).from(ncrs).where(and(eq(ncrs.id, ncrId), eq(ncrs.workspaceId, workspaceId))).limit(1);
    if (!record) return Response.json({ error: "Record not found." }, { status: 404 });
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ error: "Choose a file to upload." }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return Response.json({ error: "Files must be 10 MB or smaller." }, { status: 400 });
    if (!allowedTypes.has(file.type)) return Response.json({ error: "This file type is not supported." }, { status: 400 });
    const attachmentId = crypto.randomUUID();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const objectKey = `${workspaceId.replace(/[^a-zA-Z0-9_-]+/g, "-")}/${ncrId}/${attachmentId}-${safeName}`;
    const { env } = await import("cloudflare:workers");
    await env.BUCKET.put(objectKey, await file.arrayBuffer(), { httpMetadata: { contentType: file.type }, customMetadata: { originalName: file.name, ncrId } });
    const [attachment] = await db.insert(attachments).values({ id: attachmentId, ncrId, workspaceId, fileName: file.name, objectKey, contentType: file.type, size: file.size, category: String(form.get("category") ?? "Problem evidence"), createdAt: new Date() }).returning();
    return Response.json({ attachment }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
