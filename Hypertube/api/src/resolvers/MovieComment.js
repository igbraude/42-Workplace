import { findUserBy } from '../models/users'

export const user = ({ userId }) => findUserBy('id', userId)
