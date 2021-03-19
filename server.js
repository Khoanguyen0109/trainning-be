const express = require("express");
var cors = require('cors')

const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");


var authRoute = require('./src/routes/authRoutes')
var projectRoute = require('./src/routes/projectRoutes')
var userRoute = require('./src/routes/userRoute')

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors())


app.get("/", (req, res) => {
  res.status(200).send("Invalid username supplied");
});

// app.post("/login", login);
// app.get("/register", register);

app.use('/auth' , authRoute)
app.use('/projects' , projectRoute)
app.use('/users' , userRoute)

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get("/", (req, res) => {
  res.send(`Listening on ${PORT}`);
});



