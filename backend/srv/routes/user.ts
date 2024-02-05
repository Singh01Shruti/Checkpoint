import express from "express";
import zod from "zod";
import { PrismaClient } from "@prisma/client";
import { cpSync } from "fs";

const route = express.Router();
const prisma = new PrismaClient();

const signUpSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

route.post("/signup", async(req, res) => {
    const {success} = signUpSchema.safeParse(req.body);

    if(!success){
        return res.status(400).json({
            msg : "Invalid Inputs"
        });
    }
    const {username, password, firstName, lastName }= req.body;

    const user = await prisma.user.create({
        data:{
            username,
            password,
            firstName,
            lastName
        }
    });
    
    res.status(200).json({
        msg : "User created successfully"
    });
});

const signinSchema = zod.object({
    username : zod.string(),
    password: zod.string()
});

route.post("/signin", async(req,res) => {
    const {success} = signinSchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            msg : "Invalid Inputs"
        });
    };
    const {username, password} = req.body;
    const user = await prisma.user.findFirst({
        where: {
            username: username,
            password: password
        }
    });
    res.status(200).json({user});
});

const todoSchema = zod.object({
    title : zod.string(),
    description: zod.string(),
    done : zod.boolean()
});

route.post("/addtodos", async(req,res) => {
    const {success} = todoSchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            msg : "Invalid Inputs"
        });
    };

    const {title, description, done, userId} = req.body;
    const todo = await prisma.todo.create({
        data:{
            title,
            description,
            done,
            userId
        }
    });
});

route.get("/todos", async(req,res) => {
    const {userId} = req.body;
    const todos = await prisma.todo.findMany({
        where:{
            userId:userId
        }
    });

    res.status(200).json(todos);
});

route.put("/update", async(req,res) => {
    const {todoId, done} = req.body;
    const updatedTodo = await prisma.todo.update({
        where: {
            id : todoId
        }, 
        data:{
            done:done
        }
    });
    res.status(200).json({
        msg : "Updated successfully"
    });
});

module.exports(route);
