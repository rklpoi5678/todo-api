import express from "express";
import mongoose from 'mongoose';
import { DATABASE_URL } from "./env.js";
import mockTasks from './data/mock.js';
import Task from './models/Task.js';

mongoose.connect(DATABASE_URL).then(() => console.log('Connected DB!'));

const app = express();
app.use(express.json())


function asyncHandler(handle) {
  return async function(req,res) {
    try {
      await handle(req,res);
    } catch (e) {
      if(e.name === 'ValidationError') {
        res.status(404).send({ message: e.message });
      } else if (e.name === 'CastError') {
        res.status(404).send({ message: 'Cannnot find given id'});
      } else {
        res.status(500).sned({ message: e.message})
      }
    }
  }
}

app.get('/tasks', async (req,res) => {

  const sort = req.query.sort;
  const count = Number(req.query.count) || 0;
  
  const sortOption = { createAt: sort === 'oldest' ? 'asc':'desc'};
  const tasks = await Task.find().sort(sortOption).limit(count);
  
  res.send(tasks);
});

app.get('/tasks/:id', asyncHandler(async(req,res) => {
  const id = req.params.id;
  const task = await Task.findById(id);

  if(task) {
    res.send(task); 
  } else {
    res.status(404).send({ message: 'Cannot find given id'});
  }
}));

app.post('/tasks', asyncHandler(async (req,res) => {
  const newTask = await Task.create(req.body);
  res.status(201).send(newTask);
}));

app.patch('/tasks/:id',asyncHandler(async(req,res) => {
  const id = req.params.id;
  const task = await Task.findById(id);

  // exceptionCase: id x
  if(task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });
    await task.save();
    res.send(task);
  } else {
    res.status(401).send({ message: 'Cannot find given id'});
  }
}));

app.delete('/tasks/:id', asyncHandler(async(req,res) => {
  const id = req.params.id;
  const task = await Task.findByIdAndDelete(id);
  if(task) {
    res.sendStatus(204);
  } else {
    res.status(404).send({ message:'Cannot find given id'})
  }
}));

app.listen(3000, () => console.log('Server Started'));
