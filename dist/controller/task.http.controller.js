var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import mysql from 'mysql2/promise';
const controller = Router();
controller.get("/", getAllTask);
controller.post("/", saveTask);
controller.delete("/:id", deleteTask);
controller.patch("/:id", updateTask);
const pool = mysql.createPool({
    database: process.env.DB_NAME,
    port: +process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: +process.env.DB_CONNECTION_LIMIT,
});
function getAllTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.query.email)
            res.sendStatus(400);
        const connection = yield pool.getConnection();
        const [taskList] = yield connection.execute('SELECT * FROM task WHERE email = ?', [req.query.email]);
        res.json(taskList);
        pool.releaseConnection(connection);
    });
}
function saveTask() {
}
function deleteTask() {
}
function updateTask() {
}
export { controller as TaskHttpController };
//# sourceMappingURL=task.http.controller.js.map