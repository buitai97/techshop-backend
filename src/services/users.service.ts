import { prisma } from '../config/client'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import { JwtPayload } from '../types/jwt';
import { ACCOUNT_TYPE } from '../config/constant';

const saltRounds = 10;
const handleGetAllUsers = async () => {
    const users = await prisma.user.findMany({ omit: { password: true, phone: true, addressId: true, roleId: true, accountType: true }, include: { role: true } })
    const count = await prisma.user.count()
    return [users, count]
}

const hashPassword = async (plainText: string) => {
    return await bcrypt.hash(plainText, saltRounds)
}

const comparePassword = async (plainText: string, hashPassword: string) => {
    return await bcrypt.compare(plainText, hashPassword)
}

const handleGetUserByID = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id: +id },
        include: {
            role:
                { select: { name: true } },
            cart: true
        },
        omit: { password: true }
    })
}

const handleDeleteUser = async (id: string) => {
    const result = await prisma.user.delete({ where: { id: +id } })
    return result
}

const handleGetUserById = async (id: string) => {
    const user = prisma.user.findUnique({
        where: {
            id: +id
        }
    })
    return user
}

const handleGetRoleDetail = async (roleId: string) => {
    const result = await prisma.role.findUnique({
        where: {
            id: +roleId
        }
    })
    return result
}

const handleGetRoles = async () => {
    const result = await prisma.role.findMany()
    return result
}

const handleUserLogin = async (username: string, password: string) => {

    const user = await prisma.user.findUnique({ where: { username: username }, include: { role: true } })
    if (!user) {
        throw new Error(`Username: ${username} not found`)
    }
    const isMatch = await comparePassword(password, user.password!)
    if (!isMatch) {
        throw new Error(`Invalid password`)
    }
    const payload: JwtPayload = {
        id: user.id,
        username: user.username ? user.username : '',
        avatar: user.avatar ? user.avatar : '',
        role: { id: user.role.id, name: user.role.name, description: user.role.description },
        name: user.name ? user.name : ''
    }

    const secret = process.env.JWT_SECRET
    const access_token = jwt.sign(payload, secret!, {
        expiresIn: process.env.JWT_EXPIRE as any
    })
    return access_token
}
const getRoles = () => {
    const roles = prisma.role.findMany()
    return roles
}


const isEmailExist = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { username: email }
    })
    if (user) { return true }
    return false
}


const handleRegisterUser = async (name: string, username: string, email: string, password: string) => {
    const hashedPassword = await hashPassword(password)
    return await prisma.user.create({ data: { accountType: ACCOUNT_TYPE.SYSTEM, email, name, username, password: hashedPassword, roleId: 1 } })
}

export {
    handleGetRoleDetail,
    handleDeleteUser, handleGetUserById, hashPassword, handleGetRoles,
    comparePassword, handleGetAllUsers, handleGetUserByID, handleUserLogin, isEmailExist, handleRegisterUser,
    getRoles
}