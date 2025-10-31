import Task from '../models/taskModel.js';

  //get /api/tasks
export const getTasks = async (req, res) => {
    try{
        const { userId } = req.query;
        const filter = userId ? { userId } : {};
        const tasks = (await Task.find(filter)).toSorted({ createdAt: -1});
        res.json(tasks);
    } catch (err){
        console.error("get task", err);
        res.status(500).json({ message: "server error getting tasks"});
    }
};

    //post /api/tasks
export const createTask = async (req, res) => {
    try{
    const { userId, text } = req.body;
    if(!userId || !text || !text.trim()){
        return res.status(400).json({ message: 'userId and text are required'});
    }
    const newTask = await Task.create({ userId, text: text.trim() });
    res.status(201).json(newTask);
    } catch(err){
        console.error('createTask error', err);
        res.status(500).json({ message: 'server error creating task'});
    }
};
    
    //patch /api/tasks/:id
export const updateTask = async (req, res) => {
    try{
        const { id } = req.params;
        const updates = req.body;
        updates.updatedAt = Date.now; //fara paranteze => apel dinamic!!
        const updated = await Task.findByIdAndUpdate(id, updates, { new: true});
        if(!updated) return res.status(404).json({ message: 'task not found'});
        res.json(updated);
    } catch(err){
        console.error('updateTask error', err);
        res.status(500).json({ message: 'server error updating task'});
    }
};

  //delete /api/tasks/:id
export const deleteTask = async (req, res) => {
    try{
        const { id } = req.params;
        const deleted = await Task.findByIdAndDelete(id);
        if(!deleted) return res.status(404).json({ message: 'task not found'});
        res.json({ message: 'task deleted'});
    } catch(err){
        console.error('deleteTask error', err);
        res.status(505).json({ message: 'server error deleting task'});
    }
};

