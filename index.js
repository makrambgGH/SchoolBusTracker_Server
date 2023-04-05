const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const DB = require("./database").connectDB; //we are refering it 

// Routes 

const studentRouter = require("./Routers/studentRouter");
const driverRouter = require("./Routers/driverRouter");
const schoolRouter = require("./Routers/schoolRouter");
const uploadRouter = require("./Routers/uploadRouter");

//Connect to our database
DB();

app.use(express.json());
app.use("/student", studentRouter);
app.use("/driver", driverRouter);
app.use("/school", schoolRouter);
app.use("/upload", uploadRouter);

app.get("/", (req, res) => res.send("Hi"))

// The signup path: http://localhost:3000/signup

server.listen(process.env.PORT, () => {
    console.log(`Listening on Port: ${process.env.PORT}`);
});

// const { Server } = require("socket.io");
// const io = new Server(server);

// io.on('connection', (socket) => {
//     console.log('user Connected');
// });

