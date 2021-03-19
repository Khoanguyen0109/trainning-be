const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getAll(req, res) {
  const allProjects = await prisma.project.findMany();
  res.status(200).json({ projects: allProjects });
}

async function getOne(req, res) {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ project });
  } catch (error) {
    console.log(`error`, error);
  }
}

async function create(req, res) {
  try {
    const { name, description, users } = req.body;
    const userCreate = users.map(user =>{ return {userId:user}})
    const result = await prisma.project.create({
      data: {
        name,
        description: description|| '',
        users:{
                // create: [...users],
                create: [...userCreate],

        },
      },
    });
    res.status(200).json({project: {
        name:result.name,
        description: result.description
    }});
  } catch (error) {
    console.log(`error`, error);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const userCreate = users.map(user =>{ return {id:req.body.user}})
    const result = await prisma.project.update({
      where: { id: Number(id) },
       data: {
        ...req.body,
        users:{
            create: [...userCreate],

        },
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(`error`, error);
  }
}

async function remove(req, res) {
    try {
        const { id } = req.params
        const post = await prisma.project.delete({
            where: {
              id: Number(id),
            },
          })
          res.status(200).json(id);

    } catch (error) {
        console.log(`error`, error);

    }

}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
