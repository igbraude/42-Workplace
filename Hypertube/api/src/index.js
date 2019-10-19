import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { decodeJwt } from './utils/jwt'
import { findUserBy } from './models/users'
import resolvers from './resolvers'
import router from './router'
import * as schemaDirectives from './directives'

const SCHEMA_DIRECTORY = join(__dirname, '..', 'schema')

const app = express()
const server = new ApolloServer({
  typeDefs: readdirSync(SCHEMA_DIRECTORY)
    .map(file => readFileSync(join(SCHEMA_DIRECTORY, file), 'utf8')),
  resolvers,
  schemaDirectives,
  playground: process.env.NODE_ENV !== 'production',
  async context({ req }) {
    const result = { host: req.header('host') }
    const token = req.header('authorization')
    if (token) {
      const {id} = await decodeJwt(token)
      if (id) {
        result['user'] = await findUserBy('id', id)
      }
    }
    const oauthToken = req.header('x-oauth-token')
    if (oauthToken) {
      const { githubId, fourtyTwoId } = await decodeJwt(oauthToken)
      if (githubId || fourtyTwoId) {
        result['oauth'] = { githubId, fourtyTwoId }
      }
    }
    return result
  }
})

app.use(router)
server.applyMiddleware({ app, path: '/' })

export default app
