import client from '../client'
import Cookies from 'js-cookie'
import gql from 'graphql-tag'

const initialState = {
  logged: !!Cookies.get('token'),
  token: Cookies.get('token') || undefined,
  user: undefined,
  oauthToken: undefined,
}

export default {
  namespaced: true,
  state: initialState,
  mutations: {
    login(state, {token}) {
      state.logged = true;
      state.token = token;
      state.user = {};
      Cookies.set("token", token);
    },
    logout(state) {
      state.logged = false;
      state.token = undefined;
      state.user = undefined;
      Cookies.remove("token");
    },
    setUser(state, user) {
      state.user = user;
    },
    setOAuthToken(state, token) {
      state.oauthToken = token
    },
  },
  getters: {
    currentUser(state) {
      return state.user
    }
  },
  actions: {
    async register({commit}, {email, username, picture, firstName, lastName, password}) {
      await client.mutate({
        mutation: gql`
            mutation($input: CreateUserInput!) {
                createUser(input: $input)
            }
        `,
        variables: {
          input: {
            email,
            username,
            picture,
            firstName,
            lastName,
            password
          }
        }
      });
      commit('setOAuthToken', undefined)
    },
    async login({commit, dispatch}, {username, password}) {
      const {data} = await client.mutate({
        mutation: gql`
            mutation($input: LoginInput!) {
                login(input: $input) {
                    token
                }
            }
        `,
        variables: {
          input: {
            username,
            password
          }
        }
      });
      commit("login", data.login);
      commit('setOAuthToken', undefined)
      await dispatch('fetchMe')
      return data.login
    },
    async loginFromOAuth({commit, dispatch}, {provider, code}) {
      const {data} = await client.mutate({
        mutation: gql`
            mutation($input: OAuthLoginInput!) {
                loginFromOAuth(input: $input) {
                    token
                    oauthToken
                }
            }
        `,
        variables: {
          input: {
            provider,
            code
          }
        }
      });
      if (data.loginFromOAuth.token) {
        commit("login", data.loginFromOAuth);
        await dispatch('fetchMe')
      } else {
        commit('setOAuthToken', data.loginFromOAuth.oauthToken)
      }
      return data.loginFromOAuth
    },
    async fetchMe({commit}) {
      const {data} = await client.query({
        query: gql`
            query {
                me {
                    id
                    isAdult
                    email
                    username
                    picture
                    firstName
                    lastName
                    lang
                    isAdult
                    watchTime {
                        movie {
                            id
                            primaryTitle
                            originalTitle
                            description
                            poster
                            adult
                            year
                            minutes
                            rating
                            votes
                            genres
                            comments {
                                id
                                user {
                                    id
                                    username
                                    picture
                                }
                                comment
                                createdAt
                            }
                        }
                    }
                }
            }
        `
      });
      commit("setUser", data.me);
      return data.me
    },
    async fetchUser(_, {id}) {
      const {data} = await client.query({
        query: gql`
            query ($id: ID!) {
                user(id: $id) {
                    id
                    email
                    username
                    picture
                    firstName
                    lastName
                    lang
                    isAdult
                    watchTime {
                        movie {
                            id
                            primaryTitle
                            originalTitle
                            description
                            poster
                            adult
                            year
                            minutes
                            rating
                            votes
                            genres
                            comments {
                                id
                                user {
                                    id
                                    username
                                    picture
                                }
                                comment
                                createdAt
                            }
                        }
                    }
                }
            }
        `,
        variables: {id}
      });
      return data.user
    },
    async updateUser(
      {commit},
      {email, username, picture, firstName, lastName, lang, isAdult}
    ) {
      const {data} = await client.mutate({
        mutation: gql`
            mutation($input: UpdateUserInput!) {
                updateUser(input: $input) {
                    id
                    email
                    username
                    picture
                    firstName
                    lastName
                    lang
                    isAdult
                    watchTime {
                        movie {
                            id
                            primaryTitle
                            originalTitle
                            description
                            poster
                            adult
                            year
                            minutes
                            rating
                            votes
                            genres
                            comments {
                                id
                                user {
                                    id
                                    username
                                    picture
                                }
                                comment
                                createdAt
                            }
                        }
                    }
                }
            }
        `,
        variables: {
          input: {
            email,
            username,
            picture,
            firstName,
            lastName,
            lang,
            isAdult,
          }
        }
      });
      commit("setUser", data.updateUser);
      return data.updateUser
    },
    updatePassword(_, {oldPassword, newPassword}) {
      return client.mutate({
        mutation: gql`
            mutation($input: UpdatePasswordInput!) {
                updatePassword(input: $input)
            }
        `,
        variables: {
          input: {oldPassword, newPassword}
        }
      });
    },
    forgotPassword(_, {email}) {
      return client.mutate({
        mutation: gql`
            mutation($input: ForgotPasswordInput!) {
                forgotPassword(input: $input)
            }
        `,
        variables: {
          input: {email}
        }
      });
    },
    recoverPassword(_, {token, newPassword}) {
      return client.mutate({
        mutation: gql`
            mutation($input: RecoverPasswordInput!) {
                recoverPassword(input: $input)
            }
        `,
        variables: {
          input: {token, newPassword}
        }
      });
    },
    confirmAccount(_, {token}) {
      return client.mutate({
        mutation: gql`
            mutation($input: AccountConfirmationInput!) {
                accountConfirmation(input: $input)
            }
        `,
        variables: {
          input: {token}
        }
      });
    }
  }
};
