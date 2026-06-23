-- CreateTable
CREATE TABLE "semestre" (
    "codigo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "semestre" INTEGER NOT NULL,

    CONSTRAINT "semestre_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "lecionamento" (
    "codigo" TEXT NOT NULL,
    "cod_disciplina" TEXT NOT NULL,
    "mat_professor" TEXT NOT NULL,
    "cod_semestre" TEXT NOT NULL,
    "turno" TEXT NOT NULL,
    "dia_semana" TEXT NOT NULL,

    CONSTRAINT "lecionamento_pkey" PRIMARY KEY ("codigo")
);

-- AddForeignKey
ALTER TABLE "lecionamento" ADD CONSTRAINT "lecionamento_cod_disciplina_fkey" FOREIGN KEY ("cod_disciplina") REFERENCES "disciplina"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecionamento" ADD CONSTRAINT "lecionamento_mat_professor_fkey" FOREIGN KEY ("mat_professor") REFERENCES "professor"("matricula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecionamento" ADD CONSTRAINT "lecionamento_cod_semestre_fkey" FOREIGN KEY ("cod_semestre") REFERENCES "semestre"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;
