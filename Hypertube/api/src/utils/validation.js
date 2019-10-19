import { ValidationError } from 'apollo-server-express'
import { findUserBy } from '../models/users'

export const UUID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

export const IMDB_REGEX = /(^|tt)\d{7,8}/

export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{7,})/

export const USERNAME_REGEX = /^([a-zA-Z0-9-_]{3,10})$/

export const NAME_REGEX = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/

export const validateUser = async (user, currentUser) => {
  if (user.username !== undefined && !USERNAME_REGEX.test(user.username)) {
    throw new ValidationError('Invalid username')
  }
  if (!(currentUser && currentUser.username === user.username) && user.username !== undefined && await findUserBy('username', user.username)) {
    throw new ValidationError('Username already taken!')
  }
  if (user.email !== undefined && !EMAIL_REGEX.test(user.email)) {
    throw new ValidationError('Invalid email address')
  }
  if (!(currentUser && currentUser.email === user.email) && user.email !== undefined && await findUserBy('email', user.email)) {
    throw new ValidationError('Email address already taken!')
  }
  if (user.picture !== undefined && !['red', 'blue', 'yellow'].includes(user.picture)) {
    throw new ValidationError('Invalid picture')
  }
  if (user.firstName !== undefined && !NAME_REGEX.test(user.firstName)) {
    throw new ValidationError('Invalid first name')
  }
  if (user.lastName !== undefined && !NAME_REGEX.test(user.lastName)) {
    throw new ValidationError('Invalid last name')
  }
  if (user.password !== undefined && !PASSWORD_REGEX.test(user.password)) {
    throw new ValidationError('Invalid password')
  }
}
