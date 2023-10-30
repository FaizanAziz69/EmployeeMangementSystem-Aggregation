import mongoose from "mongoose";

const managerSchema = mongoose.Schema({
  managerName: {
    type: String,
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
});

const managerModel = mongoose.model("Manager", managerSchema);

export default managerModel;
