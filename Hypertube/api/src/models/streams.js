import uuid from 'uuid'
import db from './db'

export const findStreamBy = (field, value) => db('streams')
    .where(field, value)
    .first()

export const insertStream = data => db('streams')
    .insert(data, '*')

export const updateStreamBy = (field, value, data) => db('streams')
    .where(field, value)
    .update(data, '*')
    .then(stream => stream.length ? stream[0] : undefined)

export const deleteStreamBy = (field, value) => db('streams')
    .where(field, value)
    .delete()

export const findDeletableStream = () => db('streams')
    .whereNotNull('file')
    .andWhere('lastView', '<', db.raw("CURRENT_TIMESTAMP - interval '1 month'"))

export const findUserWatchTime = user => db('stream_watch_times')
    .where('userId', user)

export const findUserWatchTimeForStream = (user, stream) => db('stream_watch_times')
    .where('userId', user)
    .where('streamId', stream)
    .first()

export const updateStreamWatchTime = async (user, stream, duration) => {
    const exists = await db('stream_watch_times')
        .where('userId', user)
        .where('streamId', stream)
        .first()
    const query = await (exists
        ? db('stream_watch_times')
            .where('userId', user)
            .where('streamId', stream)
            .update({ duration }, '*')
        : db('stream_watch_times')
            .insert({
                id: uuid(),
                userId: user,
                streamId: stream,
                duration,
            }, '*')
    )
    return query.length ? query[0] : undefined
}
