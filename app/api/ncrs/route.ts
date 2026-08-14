import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { actions, activity, attachments, ncrs, whySteps } from "../../../db/schema";
import { actorFromRequest, apiError, workspaceFromRequest } from "../_lib";

type ActionInput = { title?: string; owner?: string; dueDate?: string; status?: string; evidence?: string };

async function seedWorkspace(workspaceId: string) {
  const db = await getDb();
  const existing = await db.select({ id: ncrs.id }).from(ncrs).where(eq(ncrs.workspaceId, workspaceId)).limit(1);
  if (existing.length) return;

  const createdAt = new Date("2026-08-14T08:00:00Z");
  const sampleNcrs = [
    {
      id: "demo-ncr-42", workspaceId, recordNumber: "NCR-2026-0042", title: "Paint adhesion below specification",
      description: "Topcoat released from the housing during cross-hatch testing after final cure.", source: "Internal",
      process: "Surface preparation & paint", area: "Paint booth", detectedAt: "2026-08-12", reportedBy: "Luis Morgan",
      owner: "Maya Chen", status: "Investigating", priority: "High", severity: 4, occurrence: 3, detectability: 3, rpn: 36,
      containment: "Quarantined the affected batch and paused release of painted housings from the same shift.", affectedQty: 8,
      disposition: "Rework", dispositionNotes: "Strip, reblast, verify profile, and repaint.", approvalStatus: "Approved",
      rootCause: "Blast-profile acceptance criteria were not defined in the released work instruction.",
      rootCauseEvidence: "Three failed housings measured below the coating supplier's minimum surface-profile recommendation.",
      effectivenessCriteria: "Ten consecutive housings pass adhesion testing with recorded blast profile.",
      effectivenessReviewDate: "2026-08-28", effectivenessResult: "Pending", customerSupplier: "", copq: 3850,
      createdAt, updatedAt: new Date("2026-08-14T07:40:00Z"), closedAt: null,
    },
    {
      id: "demo-ncr-41", workspaceId, recordNumber: "NCR-2026-0041", title: "Incorrect bearing kit received",
      description: "Supplier shipment contained an alternate bearing cage configuration not approved for the repair order.", source: "Supplier",
      process: "Incoming inspection", area: "Receiving", detectedAt: "2026-08-11", reportedBy: "Avery Brooks",
      owner: "Daniel Ruiz", status: "Containment", priority: "Medium", severity: 3, occurrence: 2, detectability: 2, rpn: 12,
      containment: "Material tagged and moved to the nonconforming-material hold area.", affectedQty: 12,
      disposition: "Return to supplier", dispositionNotes: "Awaiting supplier RMA.", approvalStatus: "Pending",
      rootCause: "", rootCauseEvidence: "", effectivenessCriteria: "Correct kit received and supplier packaging verification accepted.",
      effectivenessReviewDate: "2026-08-24", effectivenessResult: "Pending", customerSupplier: "Atlas Bearing Supply", copq: 960,
      createdAt: new Date("2026-08-11T14:20:00Z"), updatedAt: new Date("2026-08-14T06:15:00Z"), closedAt: null,
    },
    {
      id: "demo-ncr-40", workspaceId, recordNumber: "NCR-2026-0040", title: "Final inspection record incomplete",
      description: "Required runout measurement was completed but not entered on the released inspection form.", source: "Audit",
      process: "Final inspection", area: "Quality lab", detectedAt: "2026-08-08", reportedBy: "Priya Shah",
      owner: "Priya Shah", status: "Effectiveness review", priority: "Low", severity: 2, occurrence: 3, detectability: 2, rpn: 12,
      containment: "Reviewed all open inspection packets and completed an independent record check.", affectedQty: 4,
      disposition: "Use as-is", dispositionNotes: "Product measurements were confirmed acceptable; record was corrected.", approvalStatus: "Approved",
      rootCause: "The final-inspection form did not require a positive completion check before release.",
      rootCauseEvidence: "Four packets showed the same optional-looking field; interviews confirmed inconsistent interpretation.",
      effectivenessCriteria: "Thirty days with 100% completion of mandatory measurement fields.",
      effectivenessReviewDate: "2026-08-16", effectivenessResult: "Scheduled", customerSupplier: "", copq: 420,
      createdAt: new Date("2026-08-08T09:30:00Z"), updatedAt: new Date("2026-08-13T18:05:00Z"), closedAt: null,
    },
    {
      id: "demo-ncr-39", workspaceId, recordNumber: "NCR-2026-0039", title: "Shaft runout exceeded drawing limit",
      description: "Post-machining runout measured 0.0045 in. against a 0.0020 in. maximum requirement.", source: "Internal",
      process: "Machining", area: "CNC turning", detectedAt: "2026-07-29", reportedBy: "Ethan Cole",
      owner: "Maya Chen", status: "Closed", priority: "High", severity: 4, occurrence: 2, detectability: 2, rpn: 16,
      containment: "Stopped the operation, identified the last verified setup, and inspected the affected lot.", affectedQty: 3,
      disposition: "Rework", dispositionNotes: "Parts reworked with verified soft-jaw setup.", approvalStatus: "Approved",
      rootCause: "Soft-jaw setup verification was not required after jaw replacement.",
      rootCauseEvidence: "Indicator checks reproduced the error and returned within tolerance after the setup was corrected.",
      effectivenessCriteria: "Three production lots completed with documented setup verification and no runout failures.",
      effectivenessReviewDate: "2026-08-10", effectivenessResult: "Effective", customerSupplier: "", copq: 2275,
      createdAt: new Date("2026-07-29T11:10:00Z"), updatedAt: new Date("2026-08-10T16:00:00Z"), closedAt: new Date("2026-08-10T16:00:00Z"),
    },
  ];

  await db.insert(ncrs).values(sampleNcrs);
  await db.insert(actions).values([
    { id: "demo-act-1", ncrId: "demo-ncr-42", workspaceId, title: "Revise surface-preparation work instruction", owner: "Maya Chen", dueDate: "2026-08-19", status: "In progress", evidence: "", completedAt: "", createdAt },
    { id: "demo-act-2", ncrId: "demo-ncr-42", workspaceId, title: "Train paint and blast operators on profile acceptance", owner: "Luis Morgan", dueDate: "2026-08-21", status: "Open", evidence: "", completedAt: "", createdAt },
    { id: "demo-act-3", ncrId: "demo-ncr-41", workspaceId, title: "Obtain supplier RMA and replacement commitment", owner: "Daniel Ruiz", dueDate: "2026-08-17", status: "Open", evidence: "", completedAt: "", createdAt },
    { id: "demo-act-4", ncrId: "demo-ncr-40", workspaceId, title: "Verify inspection-form completion for 30 days", owner: "Priya Shah", dueDate: "2026-08-16", status: "Verification", evidence: "Twenty-three records reviewed; all complete.", completedAt: "", createdAt },
    { id: "demo-act-5", ncrId: "demo-ncr-39", workspaceId, title: "Add soft-jaw verification to setup checklist", owner: "Ethan Cole", dueDate: "2026-08-04", status: "Complete", evidence: "WI-MCH-014 Rev C and training record attached.", completedAt: "2026-08-04", createdAt },
  ]);
  await db.insert(whySteps).values([
    "Adhesion test failed because the coating did not bond to the prepared surface.",
    "The coating did not bond because the blast profile was below the supplier's recommendation.",
    "The blast profile was low because operators used visual acceptance only.",
    "Visual acceptance was used because no profile range was listed in the work instruction.",
    "The range was omitted because the document-release review did not include coating technical requirements.",
  ].map((answer, index) => ({ id: `demo-why-${index + 1}`, ncrId: "demo-ncr-42", workspaceId, position: index + 1, answer })));
  await db.insert(activity).values(sampleNcrs.map((record, index) => ({
    id: `demo-event-${index + 1}`, ncrId: record.id, workspaceId, eventType: "created",
    message: `${record.recordNumber} was opened and assigned to ${record.owner}.`, actor: record.reportedBy, createdAt: record.createdAt,
  })));
}

async function loadWorkspace(workspaceId: string) {
  const db = await getDb();
  const [records, allActions, allWhys, allAttachments, allActivity] = await Promise.all([
    db.select().from(ncrs).where(eq(ncrs.workspaceId, workspaceId)).orderBy(desc(ncrs.updatedAt)),
    db.select().from(actions).where(eq(actions.workspaceId, workspaceId)),
    db.select().from(whySteps).where(eq(whySteps.workspaceId, workspaceId)),
    db.select().from(attachments).where(eq(attachments.workspaceId, workspaceId)),
    db.select().from(activity).where(eq(activity.workspaceId, workspaceId)).orderBy(desc(activity.createdAt)),
  ]);
  return records.map((record) => ({
    ...record,
    actions: allActions.filter((action) => action.ncrId === record.id),
    whySteps: allWhys.filter((why) => why.ncrId === record.id).sort((a, b) => a.position - b.position),
    attachments: allAttachments.filter((attachment) => attachment.ncrId === record.id),
    activity: allActivity.filter((event) => event.ncrId === record.id),
  }));
}

export async function GET(request: Request) {
  try {
    const workspaceId = workspaceFromRequest(request);
    await seedWorkspace(workspaceId);
    return Response.json({ records: await loadWorkspace(workspaceId), workspaceId });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const workspaceId = workspaceFromRequest(request);
    const actor = actorFromRequest(request);
    const payload = await request.json() as Record<string, unknown> & { actions?: ActionInput[]; whySteps?: string[] };
    const title = String(payload.title ?? "").trim();
    if (!title) return Response.json({ error: "A concise issue title is required." }, { status: 400 });

    const db = await getDb();
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(ncrs).where(eq(ncrs.workspaceId, workspaceId));
    const year = new Date().getUTCFullYear();
    const recordNumber = `NCR-${year}-${String(Number(count) + 39).padStart(4, "0")}`;
    const id = crypto.randomUUID();
    const now = new Date();
    const severity = Number(payload.severity ?? 3);
    const occurrence = Number(payload.occurrence ?? 3);
    const detectability = Number(payload.detectability ?? 3);

    await db.insert(ncrs).values({
      id, workspaceId, recordNumber, title,
      description: String(payload.description ?? ""), source: String(payload.source ?? "Internal"),
      process: String(payload.process ?? ""), area: String(payload.area ?? ""),
      detectedAt: String(payload.detectedAt ?? now.toISOString().slice(0, 10)), reportedBy: String(payload.reportedBy ?? actor),
      owner: String(payload.owner ?? actor), status: String(payload.status ?? "Investigating"), priority: String(payload.priority ?? "Medium"),
      severity, occurrence, detectability, rpn: severity * occurrence * detectability,
      containment: String(payload.containment ?? ""), affectedQty: Number(payload.affectedQty ?? 0),
      disposition: String(payload.disposition ?? "Pending"), dispositionNotes: String(payload.dispositionNotes ?? ""),
      approvalStatus: String(payload.approvalStatus ?? "Pending"), rootCause: String(payload.rootCause ?? ""),
      rootCauseEvidence: String(payload.rootCauseEvidence ?? ""), effectivenessCriteria: String(payload.effectivenessCriteria ?? ""),
      effectivenessReviewDate: String(payload.effectivenessReviewDate ?? ""), effectivenessResult: "Pending",
      customerSupplier: String(payload.customerSupplier ?? ""), copq: Number(payload.copq ?? 0), createdAt: now, updatedAt: now, closedAt: null,
    });

    const whys = (payload.whySteps ?? []).map(String).filter(Boolean);
    if (whys.length) await db.insert(whySteps).values(whys.map((answer, index) => ({ id: crypto.randomUUID(), ncrId: id, workspaceId, position: index + 1, answer })));
    const actionRows = (payload.actions ?? []).filter((item) => item.title?.trim()).map((item) => ({
      id: crypto.randomUUID(), ncrId: id, workspaceId, title: item.title!.trim(), owner: item.owner ?? "", dueDate: item.dueDate ?? "",
      status: item.status ?? "Open", evidence: item.evidence ?? "", completedAt: "", createdAt: now,
    }));
    if (actionRows.length) await db.insert(actions).values(actionRows);
    await db.insert(activity).values({ id: crypto.randomUUID(), ncrId: id, workspaceId, eventType: "created", message: `${recordNumber} was created and assigned.`, actor, createdAt: now });

    return Response.json({ record: (await loadWorkspace(workspaceId)).find((record) => record.id === id) }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
