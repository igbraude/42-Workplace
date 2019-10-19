import db from './db'

export const findSubtitleBy = (field, value) => db('subtitles')
    .where(field, value)

export const insertSubtitle = data => db('subtitles')
    .insert(data, '*')
