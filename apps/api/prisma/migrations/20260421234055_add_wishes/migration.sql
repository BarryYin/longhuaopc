-- CreateTable
CREATE TABLE "wishes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "source_session_id" TEXT,
    "original_context" JSONB,
    "extracted_intent" JSONB,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'needs_confirm',
    "execution_config" JSONB,
    "result" JSONB,
    "result_summary" TEXT,
    "confirmed_at" TIMESTAMP(3),
    "executed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wish_executions" (
    "id" TEXT NOT NULL,
    "wish_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "output" JSONB,
    "duration_ms" INTEGER,
    "error" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "wish_executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wishes_user_id_idx" ON "wishes"("user_id");

-- CreateIndex
CREATE INDEX "wishes_status_idx" ON "wishes"("status");

-- CreateIndex
CREATE INDEX "wish_executions_wish_id_idx" ON "wish_executions"("wish_id");

-- AddForeignKey
ALTER TABLE "wishes" ADD CONSTRAINT "wishes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wish_executions" ADD CONSTRAINT "wish_executions_wish_id_fkey" FOREIGN KEY ("wish_id") REFERENCES "wishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
