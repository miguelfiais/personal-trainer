-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sets" INTEGER,
    "repetitions" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
