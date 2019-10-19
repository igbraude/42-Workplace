import uuid from 'uuid'
import db from './db'

export const findMovieById = id => db('movies')
  .where('id', id)
  .first()

export const addMovieComment = (movieId, userId, comment) => db('movie_comments')
  .insert({
    id: uuid(),
    movieId,
    userId,
    comment,
    createdAt: new Date()
  })

export const findMovieComments = id => db('movie_comments')
  .where('movieId', id)
  .orderBy('createdAt', 'desc')

export const findPopulars = () => db('movies')
  .whereNotNull('votes')
  .orderBy('votes', 'desc')
  .orderBy('rating', 'desc')
  .limit(20)

export const findMovies = (title, language, page, isAdult, genresFilter, yearFilter, notationFilter, sort) => {
  genresFilter = selectedGenres(genresFilter)
  let sorting = selectedSort(sort)

  const data = (db.raw(`
    SELECT *
    FROM movies
    WHERE to_tsvector('English', "primaryTitle") || to_tsvector('French', "primaryTitle") || to_tsvector('simple', "primaryTitle") @@ plainto_tsquery('English', ?)
    ` + sqlGenres(genresFilter) + (!isAdult ? 'AND "adult" = false'  : '' ) + `
    AND year BETWEEN ? AND ?
    AND rating BETWEEN ? AND ?
    ORDER BY ` + sqlSort(sorting, sort) + `"primaryTitle" ASC
    OFFSET ?
    LIMIT 20`, [title, ...genresFilter, yearFilter.min, yearFilter.max, notationFilter.min, notationFilter.max, ...sorting, page]))
    return data
}

function selectedGenres(genres) {
  return Object.entries(genres).reduce((acc, [key, value]) => {
    if (value) {
      if (key !== 'sciFi') {
       acc = [...acc, key]
      } else {
       acc = [...acc, 'sci-fi']
      }
    }
    return acc
  }, [])
}

function selectedSort(sort) {
  let temp = []
  if (sort.first === '') return temp

  if (!sort.year) {
    temp.push(sort.first)
  }
  else if (!sort.rating) {
    temp.push(sort.first)
  }
  else {
    if (sort.first === 'rating') {
      temp.push(sort.first, 'year')
    } else {
      temp.push(sort.first, 'rating')
    }
  }
  return temp
}

const sqlSort = (sorting, sort) => {
    if (sorting.length === 0) return ""
    if (sorting.length === 1) {
      if (sort.first === 'rating')
        return "?? " + sort.rating + ", "
      else if (sort.first === 'year')
        return "?? " + sort.year + ", "
    }
    if (sorting.length === 2){
      if (sort.first === 'rating')
        return "?? " + sort.rating + ", ?? " + sort.year + ", "
      else if (sort.first === 'year')
        return "?? " + sort.year + ", ?? " + sort.rating + ", "
    }
}

const sqlGenres = (genres) => {
  if (genres.length === 0) return ""
  return "AND (" +
    genres.reduce((acc, _, i) => i === 0 ? acc + ' ? = ANY(genres) ' : acc + ' AND ? = ANY(genres) ', '')
  + ")"
}
