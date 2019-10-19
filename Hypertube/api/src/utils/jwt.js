import JWT from 'jsonwebtoken'

const SECRET = process.env.SECRET || 'thisismysecretwow'

export const decodeJwt = token => new Promise((resolve, reject) => {
  JWT.verify(token, SECRET, (error, data) => {
    if (error) reject(error)
    else resolve(data)
  })
})

export const signJwt = payload => new Promise((resolve, reject) => {
  JWT.sign(payload, SECRET, (error, data) => {
    if (error) reject(error)
    else resolve(data)
  })
})
