import mongoose from "mongoose";

const employee_Schema = mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  department: {
    type: String,
  },
  salary: {
    type: Number,
  },
  experience: {
    type: Number,
  },
  joiningDate: {
    type: String,
  },
  projects: {
    type: [String],
  },
  manager: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
    },
    name: {
      type: String,
    },
  },
});

const employees = mongoose.model("employees", employee_Schema);
export default employees;
