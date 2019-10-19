import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import { appUrl } from './mail'

export const GITHUB_AUTHORIZE_LINK = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${appUrl}/oauth/github`

export const FOURTY_TWO_AUTHORIZE_LINK = process.env.FOURTY_TWO_AUTHORIZE_LINK || `https://api.intra.42.fr/oauth/authorize?client_id=8e35cad2a7d81658a9e7f2d75b9db9c5465a0fac0c6b6d4d1415d86fe847bde5&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth%2F42&response_type=code`

export const getGithubUser = async code => {
  const params = new URLSearchParams();
  params.append('client_id', process.env.GITHUB_CLIENT_ID)
  params.append('client_secret', process.env.GITHUB_CLIENT_SECRET)
  params.append('code', code)
  const resToken = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: params,
    headers: {
      Accept: 'application/json',
    },
  })
  if (resToken.status !== 200) {
    throw new Error('Invalid github response.')
  }
  const dataToken = await resToken.json()
  const resUser = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${dataToken.access_token}`
    },
  })
  if (resUser.status !== 200) {
    throw new Error('Invalid github response.')
  }
  const dataUser = await resUser.json()
  return dataUser
}

export const get42User = async code => {
  const params = new URLSearchParams();
  params.append('client_id', process.env.FOURTY_TWO_CLIENT_ID)
  params.append('client_secret', process.env.FOURTY_TWO_CLIENT_SECRET)
  params.append('grant_type', 'authorization_code')
  params.append('code', code)
  params.append('redirect_uri', process.env.FOURTY_TWO_REDIRECT || 'http://localhost:8080/oauth/42')
  const resToken = await fetch('https://api.intra.42.fr/oauth/token', {
    method: 'POST',
    body: params,
  })
  if (resToken.status !== 200) {
    throw new Error('Invalid 42 response.')
  }
  const dataToken = await resToken.json()
  const resUser = await fetch('https://api.intra.42.fr/v2/me', {
    headers: {
      Authorization: `Bearer ${dataToken.access_token}`
    },
  })
  if (resUser.status !== 200) {
    throw new Error('Invalid 42 response.')
  }
  const dataUser = await resUser.json()
  return dataUser
}
