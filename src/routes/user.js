import express from "express"
import userController from "../controller/user.js"
import TeacherGaurd from "../middleware/TeacherGaurd.js"
let router = express.Router()

router.post("/signup",userController.signup)
router.post("/login", userController.login)
router.post("/forgetPassword", userController.forgetPassword)
router.post("/resetPass", userController.resetPassword)
router.post('/student',userController.Studentdetails);
router.post('/attendance', userController.AttendanceDetails)
router.post('/timetable', userController.TimetableDetails)
router.get('/getDetails', userController.getDetails)

export default router