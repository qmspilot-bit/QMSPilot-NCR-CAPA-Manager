CREATE TABLE `actions` (
	`id` text PRIMARY KEY NOT NULL,
	`ncr_id` text NOT NULL,
	`workspace_id` text NOT NULL,
	`title` text NOT NULL,
	`owner` text DEFAULT '' NOT NULL,
	`due_date` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'Open' NOT NULL,
	`evidence` text DEFAULT '' NOT NULL,
	`completed_at` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `activity` (
	`id` text PRIMARY KEY NOT NULL,
	`ncr_id` text NOT NULL,
	`workspace_id` text NOT NULL,
	`event_type` text NOT NULL,
	`message` text NOT NULL,
	`actor` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`ncr_id` text NOT NULL,
	`workspace_id` text NOT NULL,
	`file_name` text NOT NULL,
	`object_key` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`category` text DEFAULT 'Problem evidence' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ncrs` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`record_number` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'Internal' NOT NULL,
	`process` text DEFAULT '' NOT NULL,
	`area` text DEFAULT '' NOT NULL,
	`detected_at` text NOT NULL,
	`reported_by` text DEFAULT '' NOT NULL,
	`owner` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'Open' NOT NULL,
	`priority` text DEFAULT 'Medium' NOT NULL,
	`severity` integer DEFAULT 3 NOT NULL,
	`occurrence` integer DEFAULT 3 NOT NULL,
	`detectability` integer DEFAULT 3 NOT NULL,
	`rpn` integer DEFAULT 27 NOT NULL,
	`containment` text DEFAULT '' NOT NULL,
	`affected_qty` integer DEFAULT 0 NOT NULL,
	`disposition` text DEFAULT 'Pending' NOT NULL,
	`disposition_notes` text DEFAULT '' NOT NULL,
	`approval_status` text DEFAULT 'Pending' NOT NULL,
	`root_cause` text DEFAULT '' NOT NULL,
	`root_cause_evidence` text DEFAULT '' NOT NULL,
	`effectiveness_criteria` text DEFAULT '' NOT NULL,
	`effectiveness_review_date` text DEFAULT '' NOT NULL,
	`effectiveness_result` text DEFAULT 'Pending' NOT NULL,
	`customer_supplier` text DEFAULT '' NOT NULL,
	`copq` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`closed_at` integer
);
--> statement-breakpoint
CREATE TABLE `why_steps` (
	`id` text PRIMARY KEY NOT NULL,
	`ncr_id` text NOT NULL,
	`workspace_id` text NOT NULL,
	`position` integer NOT NULL,
	`answer` text DEFAULT '' NOT NULL
);
