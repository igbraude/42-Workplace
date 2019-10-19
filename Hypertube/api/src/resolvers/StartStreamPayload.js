import { findStreamBy, findUserWatchTimeForStream } from '../models/streams'
import { findMovieById } from '../models/movies'

export const movie = async ({ id }) => {
  const stream = await findStreamBy('id', id)
  if (!stream) {
    return undefined
  }
  return await findMovieById(
    stream.imdb.startsWith('tt')
      ? stream.imdb
      : `tt${stream.imdb}`
  )
}

export const resumeAt = async ({ id }, _, { user }) => {
  const watchTime = await findUserWatchTimeForStream(user.id, id)
  if (watchTime) {
    return watchTime.duration
  }
  return 0
}
