const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getAllTasks(req, res) {
  try {
    const { projectId } = req.params;

    const allTask = await prisma.task.findMany({
      where: {
        projectId: parseInt(projectId),
      },
    });
    res.status(200).json({ tasks: allTask });
  } catch (error) {
    res.status(404).json({ error: "Not Found" });
  }
}

async function getOneTask(req, res) {
  try {
    const { projectId, id } = req.params;
    const task = await prisma.project.findUnique({
      where: {
        AND: [
          {
            projectId: {
              equals: praseInt(projectId),
            },
          },
          {
            id: {
              equals: praseInt(id),
            },
          },
        ],
      },
    });
    res.status(200).json({ task });
  } catch (error) {
    res.status(404).json({ error: "Not Found" });
  }
}

async function createTask(req, res) {
  try {
    const { projectId } = req.params;
    const task = await prisma.task.create({
      data: {
        ...req.body,
        status: false,
        project: {
          connect: {
            id: Number(projectId),
          },
        },
      },
    });
    res.status(200).json({ task });
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json({ error: "Create  Failed" });
  }
}

async function updateTask(req, res) {
  try {
    const { projectId, taskId } = req.params;
    const task = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        ...req.body,
      },
    });
    res.status(200).json({ task });
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json({ error: "Update  Failed" });
  }
}

async function removeTask(req, res) {
  try {
    const { projectId, taskId } = req.params;
    const task = await prisma.task.delete({
      where: {
        id: Number(taskId),
      },
    });
    console.log("task :>> ", task);
    res.status(200).json(task.id);
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json({ error: "Delete  Failed" });
  }
}

module.exports = {
  getAllTasks,
  getOneTask,
  createTask,
  updateTask,
  removeTask,
};
