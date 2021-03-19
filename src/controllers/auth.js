const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const prisma = new PrismaClient();

const refreshTokens = [];

async function register(req, res) {
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
    try {
      const user = await prisma.createUser({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
      });
      res.send(JSON.stringify({ status: 200, error: null, response: user.id }));
    } catch (e) {
      res.send(
        JSON.stringify({
          status: 500,
          error: "In create user " + e,
          response: null,
        })
      );
    }
  } catch (e) {
    res.send(
      JSON.stringify({ status: 500, error: "In user " + e, response: null })
    );
  }
}

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
        error: "User is found with that email",
      });
      return;
    }
    // const valid = await bcrypt.compare(req.body.password, user[0].password);

    // if (!valid){
    //     res.send(JSON.stringify({"status": 404, "error": 'Incorrect password', "token": null}));
    //     return;
    //   }

    if (user.password !== password) {
      res.status(401).json({
        status: 404,
        error: "Incorrect password",
        token: null,
      });
      return;
    }

    const token = jwt.sign(
      {
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
        { name: user.name, email: user.email, role: user.role },
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
    res.status(500).send(error);

  }

}

module.exports = {
  register,
  login,
  logout,
  token,
};
