import {findMovieComments} from '../models/movies'
import db from '../models/db'

export const comments = ({id}) => findMovieComments(id)

export const actors = async ({id}) => {
  const result = await db.raw(`
    SELECT category, name FROM movies_actors
    INNER JOIN actors ON actors.id = movies_actors."actorId"
    WHERE "movieId" = ?
  `, [id])
  return result.rows
}
