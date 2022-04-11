import type { User, Task, Project } from "@prisma/client";
import moment from "moment";

import { prisma } from "~/db.server";

export type { Task } from "@prisma/client";

export const getTask = async ({
  id,
  userId,
}: Pick<Task, "id"> & { userId: User["id"] }) => {
  return await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });
};

export const createTask = async ({
  name,
  description,
  projectId,
  userId,
}: Pick<Task, "name" | "description"> & {
  userId: User["id"];
  projectId?: Project["id"];
}) => {
  return await prisma.task.create({
    data: {
      name,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  });
};

export const getInboxTasks = async ({ userId }: { userId: User["id"] }) => {
  return await prisma.task.findMany({
    where: {
      userId,
      projectId: null,
    },
    select: {
      id: true,
      name: true,
      description: true,
      dueDate: true,
      userId: true,
    },
  });
};

export const getTodaysTasks = async ({ userId }: { userId: User["id"] }) => {
  return await prisma.task.findMany({
    where: {
      userId,
      dueDate: moment().startOf("day").toISOString(),
    },
    select: {
      id: true,
      name: true,
      description: true,
      dueDate: true,
      userId: true,
    },
  });
};

export const deleteTask = async ({
  id,
  userId,
}: Pick<Task, "id"> & { userId: User["id"] }) => {
  return await prisma.task.deleteMany({
    where: { id, userId },
  });
};
