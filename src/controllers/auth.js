const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const prisma = new PrismaClient();

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: String(email),
      },
    });
    if (!user) {
      res.status(302).json({
        error: "User is not found with that email",
      });
      return;
    }
    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) {
      res.status(302).json({
        error: "Password Incorrect",
        token: null,
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20m",
      }
    );
    res.status(200).json({
      status: 200,
      error: null,

      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    res.status(500).json({
      error: "In user " + e,
    });
  }
}

async function logout(req, res) {
  try {
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
}

function token(req, res) {
  try {
    const { access_token } = req.body;

    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json("Invalid Token");
      }
      const accessToken = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "20m" }
      );

      res.json({
        status: 200,
        error: null,
        access_token: accessToken,
        user: {
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    res.status(500).send({ error: "Expired" });
  }
}

module.exports = {
  login,
  logout,
  token,
};
