import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ncrs = sqliteTable("ncrs", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  recordNumber: text("record_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  source: text("source").notNull().default("Internal"),
  process: text("process").notNull().default(""),
  area: text("area").notNull().default(""),
  detectedAt: text("detected_at").notNull(),
  reportedBy: text("reported_by").notNull().default(""),
  owner: text("owner").notNull().default(""),
  status: text("status").notNull().default("Open"),
  priority: text("priority").notNull().default("Medium"),
  severity: integer("severity").notNull().default(3),
  occurrence: integer("occurrence").notNull().default(3),
  detectability: integer("detectability").notNull().default(3),
  rpn: integer("rpn").notNull().default(27),
  containment: text("containment").notNull().default(""),
  affectedQty: integer("affected_qty").notNull().default(0),
  disposition: text("disposition").notNull().default("Pending"),
  dispositionNotes: text("disposition_notes").notNull().default(""),
  approvalStatus: text("approval_status").notNull().default("Pending"),
  rootCause: text("root_cause").notNull().default(""),
  rootCauseEvidence: text("root_cause_evidence").notNull().default(""),
  effectivenessCriteria: text("effectiveness_criteria").notNull().default(""),
  effectivenessReviewDate: text("effectiveness_review_date").notNull().default(""),
  effectivenessResult: text("effectiveness_result").notNull().default("Pending"),
  customerSupplier: text("customer_supplier").notNull().default(""),
  copq: integer("copq").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  closedAt: integer("closed_at", { mode: "timestamp_ms" }),
});

export const whySteps = sqliteTable("why_steps", {
  id: text("id").primaryKey(),
  ncrId: text("ncr_id").notNull(),
  workspaceId: text("workspace_id").notNull(),
  position: integer("position").notNull(),
  answer: text("answer").notNull().default(""),
});

export const actions = sqliteTable("actions", {
  id: text("id").primaryKey(),
  ncrId: text("ncr_id").notNull(),
  workspaceId: text("workspace_id").notNull(),
  title: text("title").notNull(),
  owner: text("owner").notNull().default(""),
  dueDate: text("due_date").notNull().default(""),
  status: text("status").notNull().default("Open"),
  evidence: text("evidence").notNull().default(""),
  completedAt: text("completed_at").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const attachments = sqliteTable("attachments", {
  id: text("id").primaryKey(),
  ncrId: text("ncr_id").notNull(),
  workspaceId: text("workspace_id").notNull(),
  fileName: text("file_name").notNull(),
  objectKey: text("object_key").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  category: text("category").notNull().default("Problem evidence"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const activity = sqliteTable("activity", {
  id: text("id").primaryKey(),
  ncrId: text("ncr_id").notNull(),
  workspaceId: text("workspace_id").notNull(),
  eventType: text("event_type").notNull(),
  message: text("message").notNull(),
  actor: text("actor").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});
