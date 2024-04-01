const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://<username>:<password>@cluster0.imfrvq4.mongodb.net/todoFinal"
);

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
});

const todoDb = mongoose.model("todoDb", todoSchema);

app.post("/create-todo", async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;

    const newTodo = new todoDb({
      title: title,
      description: description,
      isCompleted: false,
    });

    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    res.status(400).json({
      msg: "Error while returning",
    });
  }
});


app.get("/todos", async (req, res) => {
  try {
    const response = await todoDb.find({});
    if (!response) {
      res.status(400).json({
        msg: "No todos created yet",
      });
    }

    const allTodos = response.map((todos) => ({
      title: todos.title,
      description: todos.description,
    }));

    return res.json(allTodos);
  } catch (error) {
    res.status(500).json({
      msg: "internal server error",
    });
  }
});

app.put('/:id',async (req,res)=>{
    try {
     
    const id = req.params.id;
    const { title,description } = req.body;

    const response = await todoDb.findByIdAndUpdate(
        id,
        {
            title: title,
            description: description,
            isCompleted: false
        },
        { new: true } 
    );

    if (!response) return res.status(404).json({ error: 'Todo not found' });
    
    res.json(response);
    }catch (error) {
        res.status(500).json({
          msg: "internal server error",
        });
      }
})



app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const deletedTodo = await todoDb.findByIdAndRemove(id);

        if (!deletedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json({ msg: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error while deleting todo:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});



app.put('/todos/:id/complete', async (req, res) => {
    try {
        const id = req.params.id;

        const updatedTodo = await todoDb.findByIdAndUpdate(
            id,
            { isCompleted: true },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json(updatedTodo);
    } catch (error) {
        console.error('Error while marking todo as completed:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});


app.listen(3000, () => {
  console.log("server running");
});
