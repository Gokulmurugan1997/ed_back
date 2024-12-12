import mongoose from 'mongoose';

// Email validation regex function
const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Timetable Schema definition
const TimetableSchema = new mongoose.Schema(
  {
    StudentEmail: {
      type: String,
      required: [true, 'Email is required'],
      validate: {
        validator: (value) => validateEmail(value),
        message: 'Please provide a valid email address',  // Custom message for invalid email
      },
    },
    timetable: [
      {
        subject: {
          type: String,
          required: [true, 'Subject is required'],
        },
        date: {
          type: String,
          required: [true, 'Date is required'],
        },
        time: {
          type: String,
          required: [true, 'Time is required'],
        },
      },
    ],
  },
  { timestamps: true }  // Adds createdAt and updatedAt fields automatically
);

// Creating the model
const Timetable = mongoose.model('Timetable', TimetableSchema);

export default Timetable;
