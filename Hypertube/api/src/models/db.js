import knex from 'knex'
import config from '../../knexfile'

const env = (process.env.NODE_ENV || 'development').toLowerCase()

export default knex(config[Object.keys(config).includes(env) ? env : 'development'])
