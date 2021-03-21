const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getAll(req, res) {
  try {
    console.log("req.user :>> ", req.user);
    // const allProjects = await prisma.projectUser.findMany({
    //   where: {
    //     userId: Number(req.user.id),
    //   },
    //   include: {
    //     project: true,
    //   },
    // });
    // res
    // .status(200)
    // .json({ projects: allProjects.map((project) => project.project) });
    const allProjects = await prisma.project.findMany();
    console.log("object :>> ", allProjects);
    res.status(200).json({ projects: allProjects });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(404).json({ error: "Not Found" });
  }
}

async function getOne(req, res) {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });
    res.status(200).json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        users: project.users.map((user) => {
          return user.userId;
        }),
      },
    });
  } catch (error) {
    res.status(404).json({ error: "Not Found" });
  }
}

async function create(req, res) {
  try {
    const { name, description, users } = req.body;
    const userCreate = users.map((user) => {
      return { userId: user };
    });
    const project = await prisma.project.create({
      data: {
        name,
        description: description || "",
        users: {
          create: [...userCreate],
        },
      },
      include: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });

    res.status(200).json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        users: project.users.map((user) => {
          return user.userId;
        }),
      },
    });
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json({ error: "Create  Failed" });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { name, description, users } = req.body;
    const userCreate = users.map((user) => {
      return { id: user };
    });
    console.log("userCreate :>> ", userCreate);

    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        ...req.body,
        users: {
          connect: [...userCreate],
        },
      },
      include: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });

    res.status(200).json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        users: project.users.map((user) => {
          return user.userId;
        }),
      },
    });
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json({ error: "Update  Failed" });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const project = await prisma.project.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(id);
  } catch (error) {
    console.log(`error`, error);
    res.status(500).json({ error: "Delete  Failed" });
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
