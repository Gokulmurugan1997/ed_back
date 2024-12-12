
import mongoose from 'mongoose';

const validateEmail= (email)=>{
  return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}
const studentSchema = new mongoose.Schema(
  {
    StudentEmail: {
      type: String,
      required:[true, "email is required "],
      validate:{
          validator: (value)=>validateEmail(value)
      }
    },
    English: {
      type: Number,
      required: true,
    },
    Maths: {
      type: Number,
      required: true,
    },
    History: {
      type: Number,
      required: true,
    },
    Science: {
      type: Number,
      required: true,
    },
    Geography: {
      type: Number,
      required: true,
    },
    TeacherEmail: {
      type: String,
      required:[true, "TeacherEmail is required "],
      validate:{
          validator: (value)=>validateEmail(value)
      }
    },
  },
  {
    timestamps: true,
  }
);

const TeacherModel = mongoose.model('Studentmarks', studentSchema);

export default TeacherModel;
