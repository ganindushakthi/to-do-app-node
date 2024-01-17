import {Router} from "express";
import mysql, {ResultSetHeader, RowDataPacket} from 'mysql2/promise';
import {Request, Response} from "express-serve-static-core";
import 'dotenv/config';
import {TaskTo} from "../to/task.to.js";

const controller = Router();

controller.get("/",getAllTask);
controller.post("/",saveTask);
controller.delete("/:id",deleteTask);
controller.patch("/:id",updateTask);
export {controller as TaskHttpController};

const pool = mysql.createPool({
    database:process.env.DB_NAME,
    port: +process.env.DB_PORT!,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    connectionLimit: +process.env.DB_CONNECTION_LIMIT!
});

async function getAllTask(req:Request,res:Response) {
    if(!req.query.email) res.sendStatus(400);
    const connection = await pool.getConnection();
    const [taskList] = await connection.execute('SELECT * FROM task WHERE email = ?', [req.query.email]);
    res.json(taskList);

    pool.releaseConnection(connection);
}

async function saveTask(req:Request,res:Response) {
    const task = <TaskTo> req.body;
    const connection = await pool.getConnection();
    const [{insertId}] = await connection.execute<ResultSetHeader>('INSERT INTO task (description, status, email) VALUES (?,false,?)',[task.description,task.email]);
    pool.releaseConnection(connection);
    task.id = insertId;
    task.status=false;
    res.status(201).json(task);
}

async function deleteTask(req:Request, res:Response) {
    const taskId = +req.params.id;
    const connection = await pool.getConnection();
    const [result] = await connection.execute<RowDataPacket[]>('SELECT * FROM task WHERE id=?', [taskId]);
    if(!result.length){
        res.sendStatus(404);
        return;
    }else {
        await connection.execute("DELETE FROM task WHERE id=?", [taskId]);
        res.sendStatus(204);
    }
    pool.releaseConnection(connection);
}

async function updateTask(req:Request, res:Response) {
    const taskId = +req.params.id;
    const task = <TaskTo> req.body;
    const connection = await pool.getConnection();
    const [result] = await connection.execute<RowDataPacket[]>('SELECT * FROM task WHERE id=?', [taskId]);
    if(!result.length){
        res.sendStatus(404);
        return;
    }else {
        await connection.execute('UPDATE task SET description=?, status=? WHERE id=?',
            [task.description,task.status, taskId]);
        res.sendStatus(204);
    }

    pool.releaseConnection(connection);

}

