import { Request, Response } from "express";
import { handleDeleteUser, handleGetAllUsers, handleGetUserByID } from "../services/users.service";
import { RegisterSchema, TRegisterSchema } from "../validation/register.schema";
import { handleRegisterUser, handleUserLogin } from "../services/users.service";

const getUsersAPI = async (req: Request, res: Response) => {
    const [users, count] = await handleGetAllUsers()
    return res.status(200).json({ users, count })
}

const loginAPI = async (req: Request, res: Response) => {
    const { username, password } = req.body
    try {
        const access_token = await handleUserLogin(username, password)
        res.status(200).json({
            accessToken: access_token,
        })
    } catch (error: any) {
        res.status(401).json({
            data: null,
            message: error.message
        })
    }
}

const registerAPI = async (req: Request, res: Response) => {

    const parsed = await RegisterSchema.safeParseAsync(req.body)
    if (!parsed.success) {
        const errors = parsed.error.issues.map(i => `${i.message} (${String(i.path[0])})`);
        return res.status(400).json({ errors });
    }

    const { name, email, username, password } = req.body as TRegisterSchema
    try {
        const user = await handleRegisterUser(name, username, email, password)
        return res.status(201).json({ user, message: "Register successfully!" })
    }
    catch (error) {
        return res.status(409).json({ error: (error as Error).message })
    }
}

const fetchAccountAPI = async (req: Request, res: Response) => {
    const user = await handleGetUserByID(req.user!.id.toString());
    res.status(200).json({
        data: { user }
    })
}


const postDeleteUser = async (req: Request, res: Response) => {
    await handleDeleteUser(req.params.id);
    return res.json({ message: "User deleted successfully" });
}



export { getUsersAPI, loginAPI, fetchAccountAPI, registerAPI, postDeleteUser } 