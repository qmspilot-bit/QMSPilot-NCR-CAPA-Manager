import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { activity, ncrs } from "../../../../db/schema";
import { actorFromRequest, apiError, workspaceFromRequest } from "../../_lib";

const allowedFields = [
  "title", "description", "source", "process", "area", "detectedAt", "reportedBy", "owner", "status", "priority",
  "severity", "occurrence", "detectability", "containment", "affectedQty", "disposition", "dispositionNotes", "approvalStatus",
  "rootCause", "rootCauseEvidence", "effectivenessCriteria", "effectivenessReviewDate", "effectivenessResult", "customerSupplier", "copq",
] as const;

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const workspaceId = workspaceFromRequest(request);
    const payload = await request.json() as Record<string, unknown>;
    const changes: Record<string, unknown> = { updatedAt: new Date() };
    for (const field of allowedFields) if (field in payload) changes[field] = payload[field];
    if ("severity" in changes || "occurrence" in changes || "detectability" in changes) {
      changes.rpn = Number(payload.severity ?? 3) * Number(payload.occurrence ?? 3) * Number(payload.detectability ?? 3);
    }
    if (payload.status === "Closed") changes.closedAt = new Date();
    const db = await getDb();
    const [updated] = await db.update(ncrs).set(changes).where(and(eq(ncrs.id, id), eq(ncrs.workspaceId, workspaceId))).returning();
    if (!updated) return Response.json({ error: "Record not found." }, { status: 404 });
    await db.insert(activity).values({ id: crypto.randomUUID(), ncrId: id, workspaceId, eventType: "updated", message: `Record updated: ${Object.keys(changes).filter((key) => key !== "updatedAt").join(", ")}.`, actor: actorFromRequest(request), createdAt: new Date() });
    return Response.json({ record: updated });
  } catch (error) {
    return apiError(error);
  }
}
