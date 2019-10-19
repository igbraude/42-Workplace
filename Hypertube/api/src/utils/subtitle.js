import uuid from "uuid"
import xmlrpc from "xmlrpc"
import srt2vtt from "srt-to-vtt"
import fetch from "node-fetch"
import { createWriteStream, mkdirp } from "fs-extra"
import { join } from "path"
import { createGunzip } from "zlib"
import { insertSubtitle, findSubtitleBy } from "../models/subtitles"

const DATA_DIRECTORY = join(__dirname, "..", "..", "..", "data", "subtitles")
const USER_AGENT = "yghurewe8970-re"

const client = xmlrpc.createSecureClient({
    host: "api.opensubtitles.org",
    port: 443,
    path: "/xml-rpc",
    headers: {
        "User-Agent": USER_AGENT,
    },
})

const clientCall = (method, params) =>
    new Promise((resolve, reject) => {
        client.methodCall(method, params, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

const downloadSubtitle = (name, format, url) =>
    new Promise((resolve, reject) => {
        mkdirp(DATA_DIRECTORY, (err) => {
            if (err) {
                reject(err)
            } else {
                const gunzip = createGunzip()
                gunzip
                    .on("error", reject)
                    .on("close", resolve)
                if (format === "vtt") {
                    gunzip.pipe(createWriteStream(join(DATA_DIRECTORY, name)))
                } else {
                    gunzip
                        .pipe(srt2vtt())
                        .pipe(createWriteStream(join(DATA_DIRECTORY, name)))
                }
                fetch(url)
                    .then((res) => res.body.pipe(gunzip).on("error", reject))
                    .catch(reject)
            }
        })
    })

export const isValidIMDBId = id => id.match(/(^|tt)\d{7}/)

export const setupSubtitles = async id => {
  if (!isValidIMDBId(id)) {
        return null
    }
    id = id.startsWith("tt") ? id.slice(2) : id
    let subtitle = await findSubtitleBy('imdb', id)
    if (subtitle && subtitle.length) {
        return subtitle
    }
    const { token } = await clientCall("LogIn", ["", "", "en", "TemporaryUserAgent"])
    if (token) {
        const { data } = await clientCall("SearchSubtitles", [
            token,
            [
                {
                    imdbid: id,
                    sublanguageid: "all",
                },
            ],
        ])
        const filteredData = data
            .filter(s => (s.SubFormat === "srt") &&
                (s.ISO639 === "en" || s.ISO639 === "fr"))
            .reduce((subtitles, curr) => {
                if (!subtitles[curr.ISO639] || subtitles[curr.ISO639].Score < curr.Score) {
                    subtitles[curr.ISO639] = curr
                }
                return subtitles
            }, {})
        return await Promise.all(
            Object.values(filteredData)
                .map(async data => {
                    const sid = uuid()
                    const file = `${sid}.vtt`
                    await downloadSubtitle(file, data.SubFormat, data.SubDownloadLink)
                    const subtitle = {
                        id: sid,
                        imdb: id,
                        lang: data.ISO639 === "fr" ? "french" : "english",
                        file: join(DATA_DIRECTORY, file),
                    }
                    await insertSubtitle(subtitle)
                    return subtitle
                }),
        )
    }
    return null
}
