const express=require('express')
const Students=require('./models/students')
const Personal=require('./models/personal')
const Educational=require('./models/educational')

const router=express.Router()

//create a new user with personal details and educational information
router.post('/createuser',async(req,res)=>{
    const {student,personal,educational}=req.body
    try{
        //create a user deatils
        //console.log("Entered..")
        const stud=new Students({
            name:student.name,
            email:student.email,
            password:student.password,
            mobile:student.mobile,
            role:student.role
        })
        await stud.save()
        console.log('Student created:',stud)
        
        //add persoanl deatils
        //console.log('creating personal details...')
        const pers=new Personal({
            address:{
                doorno:personal.address.doorno,
                street:personal.address.street,
                city:personal.address.city,
                pin:personal.address.pin
            },
            biodata:{
                name:personal.biodata.name,
                dob:personal.biodata.dob,
                gender:personal.biodata.gender,
                native:personal.biodata.native
            },
            student:stud._id
        })
        await pers.save()
        //console.log("personal details created...",pers)
        
        stud.personaldet=pers._id
        await stud.save()

        //console.log("Student updated with personal details",stud)


        //add educational details

        //console.log("Creating educational details..")

        const edu=new Educational({
            current:educational.current,
            education:{
                level:educational.education.level,
                institute:{
                    name:educational.education.institute.name,
                    location:educational.education.institute.location
                },
                marks:educational.education.marks
            },
            student:stud._id
        }) 
        await edu.save()
        //console.log('educational details created..')


        

        stud.educationaldet.push(edu._id)
        await stud.save()
      //  console.log("Student updated with eduactional details",stud)
        //displaying success message
        res.status(201).json({
            message:"User created with personal and educational data",
            user:stud,
            personal_details:pers,
            educational_details:edu

        })
    }
    catch(error){
        console.error("Error in creation"),
        res.status(500).json({error:"Failed"})
    }
})


// Get eduactional details for specific user id
router.get('/education/:userId',async(req,res)=>{
    try{
    const {userId}=req.params

    const edu = await Students.findById(userId).select('name educationaldet')
               .populate('educationaldet').lean() 
    if(!edu || edu===0){
        return res.status(404).send({message:"Student Not found"})
    }
    edu.educationaldet.forEach(item => {
        delete item.student;
        delete item.__v;
    })
  //  console.log(edu)
    res.send(edu)}
    catch(error){
        console.error(error)
        res.status(500).send({message:"Server error"})
    }
})

//post a education for an existing student
router.post('/educationpost/:userId',async(req,res)=>{
    try{
        const {userId}=req.params
        const {educational}=req.body

        const user=await Students.findById(userId)
        if(!user){
            return res.status(404).send({message:"Student Not found"})
        }
        //add education
        const edu=new Educational({
            current:educational.current,
            education:{
                level:educational.education.level,
                institute:{
                    name:educational.education.institute.name,
                    location:educational.education.institute.location
                },
                marks:educational.education.marks
            },
            student:user._id
        })

        await edu.save()
      //  console.log("Education added to the given user")
        //education linked with student
        user.educationaldet.push(edu._id)
        await user.save()
      
        res.status(201).send({
            message:"Education Added to the user",
            user
        })
    }
    catch(error){
        console.error(error),
        res.status(500).send({message:"Server Error"})
    }
})

//get all students
router.get('/students',async(req,res)=>{
    try{
        const students=await Students.find({}).populate('personaldet').populate('educationaldet')

        if(!students){
            res.status(404).send({message:"No Students found"})
        }
    //    console.log(students)
        res.status(200).send({message:"All student details are fetched successfully",students})
    }
    catch(error){
        console.error(error)
        res.status(500).send({message:"Internal Server error"})
    }
})

//Get one student details
router.get('/students/:userId',async(req,res)=>{
    try{
        const {userId}=req.params
        const student=await Students.findById(userId).select('personaldet educationaldet').populate('personaldet').populate('educationaldet').lean()
        if(!student){
            res.status(404).send({message:"Student Not found"})
        }
        student.educationaldet.forEach(item => {
            delete item.student;
            delete item.__v;
            delete item._id;
        })
        delete student.personaldet.student
        delete student.personaldet.__v
        delete student.personaldet._id

  //      console.log(student)
        res.status(200).send({message:"Given Student detail is fetched",student})
    }
    catch(error){
        console.error(error)
        res.status(500).send({message:"Internal Server Error"})
    }
})


//update one student
router.put('/studentsupdate/:id',async(req,res)=>{
    try{
        const {id}=req.params
    const {student}=req.body;
    const stud=await Students.findByIdAndUpdate(id,student,
        
        {new: true,runValidators:true}
    )

    if(!stud){
        return res.status(404).send('Student not found')
    }
    await stud.save()
//    console.log(stud)
    res.status(200).send({message:"Updated",stud})
}
catch(error){
    console.error(error)
    res.status(500).send({message:"Internal server error"})
}
})


//Delete one student details
router.delete('/studentdelete/:userId',async(req,res)=>{
 try{
    const { userId }=req.params
    const stud=await Students.findById(userId)
    if(!stud){
        return res.status(404).json({error:"Studnet not found"})

    }
    await Personal.deleteOne({student:userId})
    await Educational.deleteMany({student:userId})

    await Students.findByIdAndDelete(userId)

    res.status(200).json({
        mesaage:"Student details were deleted successfully"
    })
}
catch(error){
    console.error(error)
    res.status(500).send({message:"Internal Server Error"})
}
})

//Delete the student education
router.delete('/educationdelete/:userId',async(req,res)=>{
    const {userId}=req.params
    try{
        const stud=await Students.findById(userId)
        if (!stud){
            return res.status(404).json({error:"Student not found"})

        }
        await Educational.deleteMany({student:userId})

        stud.educationaldet=[]
        await stud.save()
        
        res.status(200).json({message:"Educational details of given student is deleted successfully" })
    }
    catch(error){
        console.error(error)
        res.status(500).json({error:"Internal Server Error"})
    }
})

//Get the specific education details of given userId student by Level

router.get('/specificeducation/:userId',async(req,res)=>{
    try{
        const {userId}=req.params
    const {level}=req.query
    const user=await Educational.findOne({student:userId,'education.level':level})
    if (!user){
        return res.status(404).json({error:"Student not found"})

    }
    
    res.json({mesaage:"Fetched Successfully",user})
    }
    catch(error){
        console.error(error)
        res.status(500).json({error:"Internal Server Error"})
    }

})

//update the education by thenuser id and their level
router.put('/educationupdate/:userId',async(req,res)=>{
    try{
        const {userId}=req.params
    const {level}=req.query
    const {data}=req.body
    const user=await Educational.findOneAndUpdate({student:userId,'education.level':level},{$set:data},{new:true,runValidators:true})
    if (!user){
        return res.status(404).json({error:"Student not found"})

    }
    
    res.status(200).json({message:"Updated Successfully",user})
    }
    catch(error){
        console.error(error)
        res.status(500).json({error:"Internal Server Error"})
    }

})

module.exports=router