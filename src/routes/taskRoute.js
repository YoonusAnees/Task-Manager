import express from 'express';
import Task from '../models/Task.js';
import '../db/mongoose.js';
const router = express.Router();


//Interface//

router.get("/task",(req,res)=>{
    res.render("task")
})


// End point of API

router.post("/api/tasks",async(req,res)=>{
    const task = new Task(req.body);
    try {
        await task.save();
        res.send(task);
        
    } catch (e) {
        res.send({error:message});
    }
});


/// Read Task

router.get("/api/tasks",async(req,res)=>{
    try {
        const task = await Task.find({});
        if(task){
            return res.send(task)
        }

        res.send({error:"No Tasks Available"})
        
    } catch (e) {
        res.send({error:e.message})
    }
});

//Read a task

router.get("/api/tasks/:id",async(req,res)=>{
    try {
        const task = await Task.findById(req.params.id);
        if(task){
            return res.send(task);
        }

         res.send({error:"No Task Available"});
    } catch (e) {
        res.send({error:e.message})
        
    }
});

// Update a task
router.patch("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
            return res.send({ error: "Task not found" });
        }
        res.send(task);
    } catch (e) { res.send({ error: e.message }); } });

    // Delete a task

router.delete("/api/tasks/:id", async (req, res) => {
    
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send({ error: "Task not found" });
        }

        res.send({ message: "Task deleted successfully", task });
    }
     catch (e) {
        
        res.send({ error: e.message });
    }
});

export default router;
