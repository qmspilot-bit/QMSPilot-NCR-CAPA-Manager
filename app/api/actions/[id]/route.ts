import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { actions, activity } from "../../../../db/schema";
import { actorFromRequest, apiError, workspaceFromRequest } from "../../_lib";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const workspaceId = workspaceFromRequest(request);
    const payload = await request.json() as Record<string, unknown>;
    const changes: Record<string, unknown> = {};
    for (const field of ["title", "owner", "dueDate", "status", "evidence"] as const) if (field in payload) changes[field] = payload[field];
    if (payload.status === "Complete") changes.completedAt = new Date().toISOString().slice(0, 10);
    const db = await getDb();
    const [updated] = await db.update(actions).set(changes).where(and(eq(actions.id, id), eq(actions.workspaceId, workspaceId))).returning();
    if (!updated) return Response.json({ error: "Action not found." }, { status: 404 });
    await db.insert(activity).values({ id: crypto.randomUUID(), ncrId: updated.ncrId, workspaceId, eventType: "action", message: `Corrective action “${updated.title}” moved to ${updated.status}.`, actor: actorFromRequest(request), createdAt: new Date() });
    return Response.json({ action: updated });
  } catch (error) {
    return apiError(error);
  }
}
