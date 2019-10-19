import uuid from 'uuid'
import {ValidationError} from 'apollo-server-express'
import {signJwt} from '../utils/jwt'
import {randomBytes} from 'crypto'
import {transport, passwordRecoveryContent, emailConfirmationContent} from '../utils/mail'
import {
  hashPassword, insertUser,
  findUserBy, updateUserBy
} from '../models/users'
import {findStreamBy, updateStreamWatchTime} from '../models/streams'
import {findSubtitleBy} from '../models/subtitles'
import {findMovieComments, addMovieComment} from '../models/movies'
import {setupStream, QUALITY} from '../utils/stream'
import {setupSubtitles} from '../utils/subtitle'
import {getGithubUser, get42User} from '../utils/oauth';
import {validateUser, PASSWORD_REGEX, UUID_REGEX} from '../utils/validation';

export const login = async (_, {input: {username, password}}, {oauth}) => {

  const user = await findUserBy('username', username)
  if (!user || user.password !== hashPassword(password)) {
    throw new ValidationError('Invalid username or password.')
  } else if (!user.emailVerified) {
    throw new ValidationError("Your account hasn't been verified yet, go and check your emails")
  }
  if (oauth) {
    await updateUserBy('id', user.id, oauth)
  }
  const id = user.id
  return {
    id,
    token: signJwt({id}),
  }
}

export const loginFromOAuth = async (_, {input: {provider, code}}) => {
  if (provider.toLowerCase() === 'github') {
    const {id} = await getGithubUser(code)
    let user = await findUserBy('githubId', id)
    if (user) {
      if (!user.emailVerified) {
        throw new ValidationError("Your account hasn't been verified yet, go and check your emails")
      }
      return {
        token: signJwt({id: user.id}),
        oauthToken: null
      }
    }
    return {
      token: null,
      oauthToken: signJwt({githubId: id}),
    }
  } else if (provider.toLowerCase() === 'fourty_two') {
    const {id} = await get42User(code)
    let user = await findUserBy('fourtyTwoId', id)
    if (user) {
      if (!user.emailVerified) {
        throw new ValidationError("Your account hasn't been verified yet, go and check your emails")
      }
      return {
        token: signJwt({id: user.id}),
        oauthToken: null
      }
    }
    return {
      token: null,
      oauthToken: signJwt({fourtyTwoId: id}),
    }
  }
  throw new ValidationError('Invalid provider.')
}

export const createUser = async (_, {input}, {oauth}) => {
  await validateUser(input)
  const emailToken = randomBytes(16).toString('hex')
  await insertUser({
    id: uuid(),
    ...input,
    emailToken,
    password: hashPassword(input.password),
    isAdult: false,
    ...oauth,
  })
  await transport.sendMail({
    to: input.email,
    from: 'Hypertube <noreply@hypertube.io>',
    ...emailConfirmationContent(emailToken)
  })
  return true
}

export const updateUser = async (_, {input}, {user}) => {
  await validateUser(input, user)
  return await updateUserBy('id', user.id, input)
}

export const updatePassword = async (
  _,
  {input: {oldPassword, newPassword}},
  {user: {id, password}}
) => {
  if (!PASSWORD_REGEX.test(newPassword)) {
    throw new ValidationError('Invalid password')
  }
  if (password !== hashPassword(oldPassword)) {
    throw new ValidationError('Invalid current password!')
  }
  await updateUserBy('id', id, {password: hashPassword(newPassword)})
  return true
}

export const forgotPassword = async (_, {input: {email}}) => {
  const code = randomBytes(16).toString('hex')
  const user = await updateUserBy('email', email, {passwordToken: code})
  if (user) {
    await transport.sendMail({
      to: email,
      from: 'Hypertube <noreply@hypertube.io>',
      ...passwordRecoveryContent(code)
    })
  }
  return true
}

export const recoverPassword = async (_, {input: {token, newPassword}}) => {
  if (!PASSWORD_REGEX.test(newPassword)) {
    throw new ValidationError('Invalid password')
  }
  const user = await updateUserBy('passwordToken', token, {
    passwordToken: null,
    password: hashPassword(newPassword),
  })
  if (!user) {
    throw new ValidationError('Invalid password recover token.')
  }
  return true
}

export const accountConfirmation = async (_, {input: {token}}) => {
  const user = await updateUserBy('emailToken', token, {
    emailToken: null,
    emailVerified: true
  })
  if (!user) {
    throw new ValidationError('Invalid email token.')
  }
  return true
}

export const startStream = async (_, {input: {id}}, {host}) => {
  if (!UUID_REGEX.test(id)) {
    throw new ValidationError('Invalid stream id.')
  }
  const data = await findStreamBy('id', id)
  if (!data) {
    throw new ValidationError('Invalid stream id.')
  }
  const stream = await setupStream(data)
  if (typeof stream === "string") {
    throw new ValidationError(stream)
  }
  let subtitles = await findSubtitleBy('imdb', stream.imdb)
  if (!subtitles || !subtitles.length) {
    subtitles = await setupSubtitles(data.imdb)
  }
  return {
    id: stream.id,
    duration: stream.duration,
    sources: [
      {
        src: `http://${host}/stream/${stream.id}/original`,
        type: "video/mp4",
        label: "Original",
      },
      ...Object.keys(QUALITY)
        .filter((key) => Number.parseInt(key.slice(0, -1)) <= (stream.resolution || 0))
        .map((key) => ({
          src: `http://${host}/stream/${stream.id}/${key}`,
          type: "video/mp4",
          label: key,
        })),
    ],
    subtitles: (subtitles || [])
      .map((subtitle) => ({
        id: subtitle.id,
        lang: subtitle.lang,
        label: subtitle.lang === "french" ? "Français" : "English",
        src: `http://${host}/subtitle/${subtitle.id}`,
      })),
  }
}

export const commentMovie = async (
  _,
  {input: {id: movieId, comment}},
  {user}
) => {
  if (comment.length > 250) {
    throw new ValidationError('Comment too long.')
  }
  await addMovieComment(movieId, user.id, comment)
  return await findMovieComments(movieId)
}

export const setStreamWatchTime = async (
  _,
  {input: {id, duration}},
  {user}
) => {
  if (!UUID_REGEX.test(id)) {
    throw new ValidationError('Invalid stream id.')
  }
  const stream = await findStreamBy('id', id)
  if (!stream) {
    throw new ValidationError('Invalid stream id!')
  }
  if (duration > stream.duration) {
    throw new ValidationError('Invalid duration!')
  }
  return await updateStreamWatchTime(user.id, stream.id, duration)
}
