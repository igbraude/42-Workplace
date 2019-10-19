import uuid from "uuid"
import torrentStream from "torrent-stream"
import { ffprobe } from "fluent-ffmpeg"
import { createReadStream, remove } from "fs-extra"
import { extname, join } from "path"
import {
    findStreamBy, deleteStreamBy,
    findDeletableStream, updateStreamBy
} from "../models/streams"

const FORMATS = ["avi", "mp4", "mkv", "mov", "wmv"]
const DATA_DIRECTORY = join(__dirname, "..", "..", "..", "data", "streams")
const { PORT = 4000 } = process.env
const streams = {}

const getMovieMetadata = id =>
    new Promise((resolve, reject) => {
        ffprobe(`http://localhost:${PORT}/_internal/${id}/${KEY}`, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

const setupTorrentEngine = (id, magnet) =>
    new Promise((resolve, reject) => {
        const engine = torrentStream(magnet, {
            path: join(DATA_DIRECTORY, id),
        })
        engine.on("ready", () => {
            resolve(engine)
        })
    })

export const KEY = uuid()

export const QUALITY = {
    "240p": {
        size: "?x240",
        videoBitrate: "500k",
    },
    "480p": {
        size: "?x480",
        videoBitrate: "1000k",
    },
    "720p": {
        size: "?x720",
        videoBitrate: "2500k",
    },
    "1080p": {
        size: "?x1080",
        videoBitrate: "4500k",
    },
}

export const setupStream = async stream => {
    if (stream && stream.file) {
        return stream
    }
    const id = stream.id
    const magnet = `magnet:?xt=urn:btih:${stream.magnet}`
    const engine = await setupTorrentEngine(id, magnet)
    const file = engine.files
        .reduce((prev, curr) => {
            if (FORMATS.includes(extname(curr.name).slice(1))) {
                if (!prev || prev.length < curr.length) {
                    return curr
                }
            }
            return prev
        }, null)
    if (!file) {
        return "Invalid torrent."
    }
    file.select()
    if (!stream.resolution || !stream.duration) {
        try {
            streams[id] = file
            const metadata = await getMovieMetadata(id)
            const mstream = metadata.streams.find(s => s.height)
            stream.resolution = Object.keys(QUALITY)
                .reverse()
                .map(key => Number.parseInt(key.slice(0, -1)))
                .find((key) => key <= mstream.height + 100) || 240
            stream.duration = metadata.format.duration
        } catch (e) {
            throw e
        } finally {
            delete stream[id]
        }
    }
    if (!stream.size) {
        stream.size = file.length
    }
    engine.once("idle", async () => {
        if (stream) {
            stream.file = join(DATA_DIRECTORY, id, file.path)
            await updateStreamBy('id', stream.id, stream)
            delete streams[stream.id]
            engine.destroy(() => ({}))
        }
    })
    stream.lastView = new Date()
    await updateStreamBy('id', stream.id, stream)
    streams[stream.id] = file
    return stream
}

export const getTorrentFile = async id => {
    return streams[id] ? streams[id] : null
}

export const createVideoStream = async (stream, start, end) => {
    if (stream.file) {
        return createReadStream(stream.file, { start, end })
    }
    return streams[stream.id] ?
        streams[stream.id].createReadStream({ start, end }) : null
}

export const isStreamable = async id => {
    const stream = await findStreamBy('id', id)
    return stream && (stream.file || streams[stream.id])
}

setInterval(async () => {
    try {
        const deletable = await findDeletableStream()
        await Promise.all(deletable.map(async (del) => {
            try {
                await remove(join(DATA_DIRECTORY, del.id))
            } catch (e) {
            }
            await deleteStreamBy('id', del.id)
        }))
    } catch (e) {
    }
}, 1000)
