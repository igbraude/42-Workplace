import uuid from 'uuid'
import {ValidationError} from 'apollo-server-express'
import {findUserBy} from '../models/users'
import {findStreamBy, insertStream} from '../models/streams'
import {findMovieById, findMovies, findPopulars} from '../models/movies'
import {search} from '../utils/search'
import { UUID_REGEX, IMDB_REGEX } from '../utils/validation';

export const user = async (_, {id}) => {
  if (!UUID_REGEX.test(id)) {
    throw new ValidationError('Invalid user id!')
  }
  return findUserBy('id', id)
}

export const me = (_, args, {user}) => user

export const searchTorrent = async (_, {imdb}) => {
  if (!IMDB_REGEX.test(imdb)) {
    throw new ValidationError('Invalid imdb id!')
  }
  const result = await search(imdb.startsWith("tt") ? imdb : `tt${imdb}`)
  return await Promise.all(
    result.map(async torrent => {
      const stream = await findStreamBy('magnet', torrent.hash)
      const id = stream ? stream.id : uuid()
      if (!stream) {
        await insertStream({
          id,
          magnet: torrent.hash,
          imdb: imdb.startsWith("tt") ? imdb.slice(2) : imdb,
        })
      }
      return {id, ...torrent, downloaded: !!(stream && stream.file)}
    })
  )
}

export const movie = async (_, {id}) => {
  if (!IMDB_REGEX.test(id)) {
    throw new ValidationError('Invalid imdb id!')
  }
  return await findMovieById(id)
}

export const populars = async () => {
  return await findPopulars()
}

export const searchMovies = async (_, {input}) => {
  if (input.page) {
    input.page *= 20
  }
  const { rows } = await findMovies(
    input.title,
    input.language,
    input.page,
    input.isAdult,
    input.genresFilter,
    input.yearFilter,
    input.notationFilter,
    input.sort
  )
  return rows
}
