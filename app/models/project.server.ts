import type { User, Project } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Project } from "@prisma/client";

export const getProject = async ({
  id,
  userId,
}: Pick<Project, "id"> & { userId: User["id"] }) => {
  return await prisma.project.findFirst({
    where: {
      id,
      userId,
    },
  });
};

export const createProject = async ({
  name,
  userId,
}: Pick<Project, "name"> & { userId: User["id"] }) => {
  return await prisma.project.create({
    data: {
      name,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

export const deleteProject = async ({
  id,
  userId,
}: Pick<Project, "id"> & { userId: User["id"] }) => {
  return await prisma.project.deleteMany({
    where: { id, userId },
  });
};

export const getProjectsWithCounts = async ({
  userId,
}: {
  userId: User["id"];
}) => {
  const projects = await prisma.project.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      _count: {
        select: { Task: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return projects.map(({ id, name, _count: { Task } }) => ({
    id,
    name,
    count: Task,
  }));
};
