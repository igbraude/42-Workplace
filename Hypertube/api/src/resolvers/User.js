import { findUserWatchTime } from '../models/streams'

export const email = ({ id, email }, _, { user }) =>
  user && user.id === id ? email : undefined

export const watchTime = ({ id }) => findUserWatchTime(id)
