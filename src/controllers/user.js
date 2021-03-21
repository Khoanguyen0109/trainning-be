const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function getAll(req, res) {
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  res.status(200).json({ users: allUsers });
}

async function getOne(req, res) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        password: false,
      },
    });
    res.status(200).json({ user });
  } catch (e) {
    res.status(404).json({ error: "Not Found" });
  }
}

async function create(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (user) {
      res.status(302).json({ error: "Email have already been used" });
      return;
    }
    req.body.password = await bcrypt.hash(req.body.password, 12);

    const result = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
      },
    });
    res.status(200).json({ user: result });
  } catch (e) {
    res.status(500).json({ error: "Create  Failed" });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: { ...req.body },
    });
    res.status(200).json({ user });
  } catch (e) {
    console.log(`e`, e);
    res.status(500).json({ error: "Update  Failed" });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    if (parseInt(req.user.id) === parseInt(id)) {
      res.status(403).json({ error: "Can not delete your self" });
      return;
    }
    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(id);
  } catch (e) {
    console.log("e :>> ", e);
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
