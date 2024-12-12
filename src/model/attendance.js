import mongoose from "./index.js";

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const AttendanceSchema = new mongoose.Schema(
  {
    StudentEmail: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: (value) => validateEmail(value),
        message: "Invalid email format",
      },
    },
    AttendancePercentage: {
      type: Number,
      required: [true, "Attendance percentage is required"],
      min: [0, "Attendance percentage cannot be less than 0"],
      max: [100, "Attendance percentage cannot be greater than 100"],
    },
  },
  { timestamps: true }
);

const attendanceModel = mongoose.model("attendanceDetails", AttendanceSchema);

export default attendanceModel;
