import ffmpeg from "fluent-ffmpeg"
import pump from "pump"
import rangeParser from "range-parser"
import cors from "cors"
import cookieParser from "cookie-parser"
import { Router } from 'express'
import { decodeJwt } from './utils/jwt'
import { findUserBy } from './models/users'
import { findStreamBy } from "./models/streams"
import { findSubtitleBy } from "./models/subtitles"
import { createVideoStream, getTorrentFile, isStreamable, KEY, QUALITY } from "./utils/stream"
import { GITHUB_AUTHORIZE_LINK, FOURTY_TWO_AUTHORIZE_LINK } from "./utils/oauth";

const router = new Router()

router.use(cookieParser())
router.use(cors({credentials: true, origin: 'http://localhost:8080'}))

router.get('/auth/github', (req, res) => {
  res.redirect(GITHUB_AUTHORIZE_LINK)
});

router.get('/auth/42', (req, res) => {
  res.redirect(FOURTY_TWO_AUTHORIZE_LINK)
});

const handleError = (res, err) => {
  res.json({ error: "An error occurred." })
}

const auth = async (req, res, next) => {
  try {
    if (req.cookies.token) {
      const { id } = await decodeJwt(req.cookies.token)
      if (id) {
        const user = await findUserBy('id', id)
        if (user) {
          next()
          return
        }
      }
    }
  } catch (e) {
  }
  res.status(403).json({ message: 'Forbidden.' })
}

router.get("/stream/:id/:quality", auth, async (req, res) => {
  try {
    const { params: { id, quality }, query: { time } } = req
    if (!id || !id.match(/^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/)) {
      res.status(404).json({ error: "Stream not found." })
      return
    }
    if (!quality || ![...Object.keys(QUALITY), "original"].includes(quality)) {
      res.status(400).json({ error: "Invalid stream quality." })
      return
    }
    if (!(await isStreamable(id))) {
      res.status(404).json({ error: "Stream not found." })
      return
    }
    res.setHeader("Content-Type", "video/webm")
    const cmd = ffmpeg(`http://localhost:${process.env.PORT || 4000}/_internal/stream/${id}/${KEY}`)
      .withVideoCodec("libvpx")
    if (quality !== "original") {
      cmd
        .withVideoBitrate(QUALITY[quality].videoBitrate)
        .withSize(QUALITY[quality].size)
    }
    cmd
      .withAudioCodec("libvorbis")
      .withAudioBitrate("256k")
      .audioChannels(2)
      .outputOptions([
        "-deadline realtime",
        "-error-resilient 1",
        "-movflags +faststart",
      ])
      .format("matroska")
      .seekInput(time ? Number.parseFloat(time) : 0)
    res.on("close", () => cmd.kill("SIGTERM"))
    pump(cmd, res)
  } catch (e) {
    handleError(res, e)
  }
})

router.get("/subtitle/:id", auth, async (req, res) => {
  try {
    const { params: { id } } = req
    if (!id || !id.match(/^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/)) {
      res.status(404).json({ error: "Subtitle not found." })
      return
    }
    const subtitle = await findSubtitleBy('id', id)
    if (!subtitle || !subtitle.length) {
      res.status(404).json({ error: "Subtitle not found." })
      return
    }
    res.sendFile(subtitle[0].file)
  } catch (e) {
    handleError(res, e)
  }
})

router.get("/_internal/:id/:key", async (req, res) => {
  try {
    const { params: { id, key } } = req
    if (!id || !id.match(/^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/) || key !== KEY) {
      res.status(404).json({ error: "Stream not found." })
      return
    }
    const data = await getTorrentFile(id)
    if (!data) {
      res.status(404).json({ error: "Stream not found." })
      return
    }
    const range = rangeParser(data.length, req.headers.range || "")
    if (range === -1 || range === -2) {
      res.status(404).json({ error: "Invalid range." })
      return
    }
    const [{ start, end }] = range
    const stream = data.createReadStream({ start, end })
    if (!stream) {
      res.status(404).json({ error: "Stream not found." })
      return
    }
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${data.length}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "application/octet-stream",
      Connection: "keep-alive",
    })
    pump(stream, res)
  } catch (e) {
    handleError(res, e)
  }
})

router.get("/_internal/stream/:id/:key", async (req, res) => {
  try {
    const { params: { id, key } } = req
    if (!id || !id.match(/^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/) || key !== KEY) {
      res.status(404).json({ error: "Stream not found." })
      return
    }
    const data = await findStreamBy('id', id)
    if (!data) {
      res.status(404).json({ error: "Stream not found." })
      return
    }
    const range = rangeParser(data.size || 0, req.headers.range || "")
    if (range === -1 || range === -2) {
      res.status(404).json({ error: "Invalid range." })
      return
    }
    const [{ start, end }] = range
    const stream = await createVideoStream(data, start, end)
    if (!stream) {
      res.status(404).json({ error: "Stream not found." })
      return
    }
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${data.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "application/octet-stream",
      Connection: "keep-alive",
    })
    pump(stream, res)
  } catch (e) {
    handleError(res, e)
  }
})

export default router
