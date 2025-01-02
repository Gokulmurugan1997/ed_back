import express from "express"
import userController from "../controller/user.js"
import validate from "../middleware/validate.js"
let router = express.Router()

router.post("/signup",userController.signup)
router.post("/login", userController.login)
router.post("/forgetPassword", userController.forgetPassword)
router.post("/resetPass", userController.resetPassword)
router.post('/student',validate, userController.Studentdetails);
router.post('/attendance',validate, userController.AttendanceDetails)
router.post('/timetable', validate, userController.TimetableDetails)
router.get('/getDetails', validate, userController.getDetails)

export default router