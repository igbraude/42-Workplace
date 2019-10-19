import { createHash } from 'crypto'
import db from './db'

export const findUserBy = (field, value) => db('users')
    .where(field, value)
    .first()

export const insertUser = data => db('users')
    .insert(data, '*')

export const updateUserBy = (field, value, data) => db('users')
    .where(field, value)
    .update(data, '*')
    .then(user => user.length ? user[0] : undefined)

export const hashPassword = password =>
    createHash('sha512').update(password).digest().toString('hex')
