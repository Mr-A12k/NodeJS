const getStudents ="SELECT * FROM students";
const getStudentId = "SELECT * FROM students where id=$1";



module.exports= {getStudents,getStudentId};