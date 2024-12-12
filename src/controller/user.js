import auth from "../utils/auth.js";
import userModel from "../model/user.js";
import TeacherModel from "../model/teacher.js";
import attendanceModel from "../model/attendance.js";
import Timetable from "../model/timeTable.js";
import crypto from "crypto"
import nodemailer from "nodemailer"


const signup = async (req, res) =>{
    try {
        const user = await userModel.findOne({email:req.body.email})

        if(!user){
            req.body.password = await auth.hashPassword(req.body.password)

            await userModel.create(req.body)

            res.status(200).send({
                message:"user create successfully"
            })
        }else{
            res.status(402).send({
                message:"user already exist"
            })
        }
    } catch (error) {
        res.status(501).send({
             message:error.message||"internal error"
        })
        
    }
}

const login = async (req,res)=>{
    try {
        const user = await userModel.findOne({email:req.body.email})

        if (user) {
            if(await auth.hashCompare(req.body.password, user.password)){
                let token = await auth.createToken({
                    name:user.name,
                    email:user.email,
                    id:user._id,
                    role:user.role
                })
                res.status(200).send({
                    message:"login successful",
                    name:user.name,
                    email:user.email,
                    role:user.role,
                    id:user._id,
                    token
                })
            }
            else{
                res.status(400).send({
                    message:"password wrong"
                })
            }
            
        } else {
            res.status(400).send({
                message:"user not found"
            })
        }
        
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal server error"
        })
    }
}

const editUserById = async(req,res)=>{
    try {
        
        const updateUser = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        if (!updateUser) {
            return res.status(404).send({ message: 'user edited successfully' });
          }
      
          res.send(updateUser);
    } catch (error) {
        res.status(500).send({
            message:error.message||"server error"
    })
    }
}
const forgetPassword = async (req,res) =>{
    try {
        const user = await userModel.findOne({email:req.body.email})

        if (!user) {
            res.status(402).send({
                message:"user not found, please enter valid email"
            })
        }
        const resetToken = crypto.randomBytes(15).toString('hex')
        user.resetToken = resetToken
        user.resetTokenExpriration = Date.now()+3600000
        await user.save()

        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
            user: "gokulmuruganp@gmail.com",
            pass: "peup grbt juyr fxkj"
            }
        })

        const mailOption = {
            from: "gokulmuruganp@gmail.com",
            to: user.email,
            subject: 'Password Reset',
            text:`http://localhost:5173/resetPassword/${resetToken}`
        }
            transporter.sendMail(mailOption,(error, info)=>{
                if(error){
                    console.log(error)
                    res.status(500).json({error:"Error sending email"})
                }else{
                    console.log("Email sent: " + info.response);
                    res.json({
                        message:"reset link sent to your email"
                    })
                }
            })
        
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal server error"
        })
    }
}

const resetPassword = async (req,res)=>{
    try {
        let token = req.body.token
        console.log(token)
        if(token){
            let user = await userModel.findOne({
                resetToken:req.body.token
            })
            if (user) {
                user.password = await auth.hashPassword(req.body.password)
                await user.save()
                res.status(200).send({ 
                    message:"user password reset successfully"
                })
            } else {
                res.status(400).send({
                    message:"user not found"
                })
            }
        }
        else{
            res.status(400).send({
                message:"token not found"
            })
        }
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal server error"
        })
    }
}

const Studentdetails = async (req, res) => {
    try {
        const studentData = {
            StudentEmail: req.body.StudentEmail,
            English: req.body.English,
            Maths: req.body.Maths,
            History: req.body.History,
            Science: req.body.Science,
            Geography: req.body.Geography,
            TeacherEmail: req.body.TeacherEmail,
        };

        const Student = await TeacherModel.findOne({StudentEmail: req.body.StudentEmail})
        if (Student){
            Student.StudentEmail= req.body.StudentEmail
            Student.English= req.body.English
            Student.Maths= req.body.Maths
            Student.History= req.body.History
            Student.Science= req.body.Science
            Student.Geography=req.body.Geography
            Student.TeacherEmail= req.body.TeacherEmail

            await Student.save();
            return res.status(200).send({
                message: "Students mark updated successfully"
            });
        }
        else{
            const newStudent = await TeacherModel.create(studentData);

            res.status(200).send({
            message: "Student details successfully saved",
            student: newStudent,
            });
        }
    } catch (error) {

        res.status(500).send({
            message: error.message || "Internal server error",
        });
    }
};

const AttendanceDetails = async (req, res) => {
    try {
        const Attendance = {
        StudentEmail: req.body.StudentEmail,
        AttendancePercentage: req.body.attendancePercentage
      };
  
    
      let student = await attendanceModel.findOne({ StudentEmail: req.body.StudentEmail });
  
      if (student) {
  
        student.AttendancePercentage = req.body.attendancePercentage;
        await student.save();
  
        return res.status(200).json({
          message: 'Attendance updated successfully',
          student: student
        });
      } else {
      
        const newAttendance = await attendanceModel.create(Attendance);
  
        return res.status(200).send({
          message: "Student attendance successfully saved",
          student: newAttendance
        });
      }
      
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Internal server error"
      });
    }
  };
  

  const TimetableDetails = async (req, res) => {
    const { StudentEmail, timetable } = req.body; 
  
    try {
    
      if (!StudentEmail) {
        return res.status(400).json({ message: 'StudentEmail is required' });
      }
  
    
      if (!timetable || timetable.length === 0) {
        return res.status(400).json({ message: 'Timetable is required and cannot be empty' });
      }
  
     
      let existingTimetable = await Timetable.findOne({ StudentEmail });
  
      if (existingTimetable) {
        
        existingTimetable.timetable = timetable;
        await existingTimetable.save();
        return res.status(200).json({ message: 'Timetable updated successfully' });
      }
  
     
      const newTimetable = new Timetable({
        StudentEmail,  
        timetable,   
      });
  
      await newTimetable.save();
      return res.status(200).json({ message: 'Timetable saved successfully' });
  
    } catch (error) {
      console.error('Error saving timetable: ', error);
      res.status(500).json({ message: 'Error saving timetable' });
    }
  };
  
  
  const getDetails = async (req, res) => {
    try {

      const { StudentEmail } = req.query;
  

      const timeTable = await Timetable.findOne({ StudentEmail });
      const Attendance = await attendanceModel.findOne({ StudentEmail });
      const mark = await TeacherModel.findOne({ StudentEmail });
  
      if (!timeTable || !Attendance || !mark) {
        return res.status(404).send({ message: "Student not found" }); // Send a 404 if data is missing
      }
  
      return res.status(200).send({ timeTable, Attendance, mark }); // Send the details back to the frontend
  
    } catch (error) {
      console.error('Error fetching student details: ', error);
      return res.status(500).json({ message: 'Error fetching student details' });
    }
  };
  
  

export default {
    signup,
    login,
    forgetPassword,
    resetPassword,
    editUserById,
    Studentdetails,
    AttendanceDetails,
    TimetableDetails,
    getDetails
}