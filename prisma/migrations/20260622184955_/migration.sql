-- CreateTable
CREATE TABLE "curso" (
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "periodos" INTEGER NOT NULL,

    CONSTRAINT "curso_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "disciplina" (
    "codigo" TEXT NOT NULL,
    "cod_curso" TEXT NOT NULL,
    "periodo" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "carga_horaria" INTEGER NOT NULL,

    CONSTRAINT "disciplina_pkey" PRIMARY KEY ("codigo")
);

-- CreateIndex
CREATE UNIQUE INDEX "curso_nome_key" ON "curso"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "disciplina_cod_curso_nome_key" ON "disciplina"("cod_curso", "nome");

-- AddForeignKey
ALTER TABLE "disciplina" ADD CONSTRAINT "disciplina_cod_curso_fkey" FOREIGN KEY ("cod_curso") REFERENCES "curso"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;
