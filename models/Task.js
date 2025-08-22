import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  // mongoose auto createAt,updateAt
  {
    timeseries: true,
  }
);

// model dms scheam rlqksdmfh whghl,update,delete interface
// first argument firstLetter.upperCase + Single -> MongoDB Collection Name
const Task = mongoose.model('Task', TaskSchema);

export default Task;