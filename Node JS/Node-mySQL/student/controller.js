const pool = require('./db');
const queries = require('./queries');
const getStudents = (req, res) => {
    pool.query(queries.getStudents, (error, results) => {
        if (error) {
            console.log("Error while processing!", error);
            res.status(404).json({ message: "No data found!" });
        }
        if (results && results.rows) {
            res.status(200).json(results.rows);
        }
        res.status(500).json({ message: "error" });
    });
}

const getStudentId = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getStudentId, [id], (error, results) => {
        if (error) {
            console.log("cant get the sudent!", error);
            return res.status(404).json({ message: "Error getting the student!" });
        }
        if (results && results.rows) {
           return res.status(200).json(results.rows);
        }
        res.status(500).json({ message: "Error getting the student details by id!" });
    })
}

const addStudent=(req,res)=>{
    const {name,department,age,email}=req.body;
    pool.query(queries.addStudent,[email],(error,results)=>{
        if(results.rows.length){
            res.status(500).json({message:"Email already exist!"});
        }

    });
}
module.exports = { getStudents, getStudentId ,addStudent };