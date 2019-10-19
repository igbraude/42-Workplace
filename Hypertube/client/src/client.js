import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import store from './store'

const origOpen = XMLHttpRequest.prototype.send
XMLHttpRequest.prototype.send = function () {
  this.withCredentials = true
  origOpen.apply(this, arguments)
}

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_API || 'http://localhost:4000',
})

const middlewareLink = new ApolloLink((operation, forward) => {
  const headers = {}
  if (store.state.user.logged) {
    headers['authorization'] = store.state.user.token
  }
  if (store.state.user.oauthToken) {
    headers['x-oauth-token'] = store.state.user.oauthToken
  }
  operation.setContext({
    headers,
  })
  return forward(operation)
});

export default new ApolloClient({
  link: middlewareLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
})
