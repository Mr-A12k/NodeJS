const express = require('express');
const studentRoutes = require('./student/routes');

const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("server connected !");
});

app.use('/api/student', studentRoutes);
app.use('/api/student/:id', studentRoutes);
app.use('/addStudent',studentRoutes);

app.listen(port, () => {
    console.log("Hello world connected to the server!");
});
