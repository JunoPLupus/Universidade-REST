-- CreateTable
CREATE TABLE "usuario" (
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "professor" (
    "matricula" TEXT NOT NULL,
    "email_usuario" TEXT NOT NULL,
    "especialidade" TEXT,
    "titulacao" TEXT,

    CONSTRAINT "professor_pkey" PRIMARY KEY ("matricula")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cpf_key" ON "usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "professor_email_usuario_key" ON "professor"("email_usuario");

-- AddForeignKey
ALTER TABLE "professor" ADD CONSTRAINT "professor_email_usuario_fkey" FOREIGN KEY ("email_usuario") REFERENCES "usuario"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
