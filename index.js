const express = require('express');
const mongoose = require("mongoose")
const users = require("./model/model.js");
require('dotenv').config();
const app = express();

app.use(express.json());//Middleware
const PORT = process.env.PORT || 3000;
const MONGO_DB = process.env.MONGO_DB ||MONGO_DB;

// DB Conncet:
mongoose.connect(MONGO_DB)
.then(()=>{
    console.log("DataBase Connected SuccuesFully..!")
})
.catch((err)=>{
    console.log({err:"DB Not Connected..!"});
    
})

// GET

// GET users with pagination
app.get("/users", async (req, res) => {
    try {
        const user = await users.find({});
        const { page = 1, limit = 10 } = req.query;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        // previous & next page:-
        const pagination={};
        if(endIndex < user.length){
            pagination.next={
                page:parseInt(page)+1,
                limit:parseInt(limit)
            }
        };
        if(startIndex > 0){
            pagination.previous ={
                page:parseInt(page)-1,
                limit:parseInt(limit)
            }
        }
        const resultUser = user.slice(startIndex, endIndex);
        res.status(200).json(
            {data: resultUser, 
             page: parseInt(page),
             limit: parseInt(limit),
             pagination:pagination});
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// POST:-
app.post("/post",async (req,res)=>{
    try {
        const posts=users.create(req.body);
        res.status(201).json(posts)
    } catch (error) {
        res.status(401).json({message:"User Not created..!"})
    }

});

// DELETE:-
app.delete("/delete/:id",async (req,res)=>{
    try {
        const {id} = req.params;
        await users.findByIdAndDelete(id);
        res.status(200).json(`User with id ${id} deleted successfully`)
    } catch (error) {
        res.status(404).json({message:"User Not Found..!"})
    }
})

app.listen(PORT,()=>{
    console.log(`app listening At http://localhost:${PORT}`);
    
});