CREATE TABLE `models` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text,
	`name` text NOT NULL,
	`provider` text NOT NULL,
	`context_length` integer,
	`input_price` text,
	`output_price` text,
	`modality` text,
	`synced_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_models_provider` ON `models` (`provider`);