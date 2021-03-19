const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getAll(req, res) {
  const allUsers = await prisma.user.findMany();
  res.send(JSON.stringify({ status: 200, error: null, response: allUsers }));
}

async function getOne(req, res) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.send(JSON.stringify({ status: 200, error: null, response: user }));

  } catch (e) {
    res.send(JSON.stringify({ status: 500, error: e, response: null }));

  }
}

async function create(req, res) {
  try {

    const user = await prisma.users({
      where: { email: req.body.email },
    });
    if (user.length != 0) {
      res.send(
        JSON.stringify({ status: 302, error: "User is found with that email" })
      );
      return;
    }
    req.body.password = await bcrypt.hash(req.body.password, 12);

    const result = await prisma.user.create({
      data: {
        ...req.body,
      },
    });

    try {
      const result = await prisma.user.create({
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
      });
      res.send(JSON.stringify({ status: 200, error: null, response: result }));
    } catch (e) {
      res.send(
        JSON.stringify({
          status: 500,
          error: "In create user " + e,
          response: null,
        })
      );
    }
    res.send(JSON.stringify({ status: 200, error: null, response: result }));
  } catch (e) {
    res.send(JSON.stringify({ status: 500, error: e, response: null }));
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: { ...req.body },
    });
    res.send(JSON.stringify({ status: 200, error: null, response: user }));
  } catch (e) {
    res.send(JSON.stringify({ status: 500, error: e, response: null }));
  }
}

async function remove(req, res) {
  try {
    const user = await prisma.deleteUser({
      id: req.params.id,
    });
    res.send(JSON.stringify({ status: 200, error: null, response: user.id }));
  } catch (e) {
    res.send(JSON.stringify({ status: 500, error: e, response: null }));
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
