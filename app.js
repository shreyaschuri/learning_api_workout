const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json()); // this for req.body

const workouts = JSON.parse(fs.readFileSync(`./data/workout.json`));

const getAllworkouts = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: workouts.length,
    data: {
      workouts
    }
  });
};

const getWorkout = (req, res) => {
  console.log(req.params);
    const id = req.params.id * 1; //this will convert string to no.
    const workout = workouts.find(el => el.id === id);

    //if(id > tours.length)
    if(!workout) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid ID'
      });
    }


  res.status(200).json({
    status: 'success',
    data: {
      workout
    }
  })
}

const createWorkout = (req, res) => {  //post to create workout
//  console.log(req.body);
  const newId = workouts[workouts.length - 1].id + 1;
  const newWorkout = Object.assign({id:newId}, req.body);

  workouts.push(newWorkout);
  fs.writeFile(`./data/workout.json`, JSON.stringify(workouts), err => {
    res.status(201).json({ // 201 stands for created
      status: 'success',
      data: {
          workout: newWorkout
      }
    });
  });
}

const updateWorkout =  (req, res) => {
  if(req.params.id * 1 > workouts.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      workout: '<Updated Workout here...>'
    }
  });
}

const deleteWorkout =  (req, res) => {
  if(req.params.id * 1 > workouts.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}




const workoutRouter = express.Router();

workoutRouter
  .route('/')
  .get(getAllworkouts)
  .post(createWorkout);

workoutRouter
  .route('/:id')
  .get(getWorkout)
  .patch(updateWorkout)
  .delete(deleteWorkout);

app.use('/api/v1/workouts', workoutRouter);

module.exports = app;
