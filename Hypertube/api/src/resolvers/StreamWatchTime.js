import { findStreamBy } from '../models/streams'
import { findMovieById } from '../models/movies'

export const movie = async ({ streamId }) => {
  const stream = await findStreamBy('id', streamId)
  if (!stream) {
    return undefined
  }
  return await findMovieById(
    stream.imdb.startsWith('tt')
      ? stream.imdb
      : `tt${stream.imdb}`
  )
}
