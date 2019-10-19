import client from '../client'
import gql from 'graphql-tag'

const initialState = {
  torrents: undefined,
  stream: undefined,
  movie: undefined,
}

export default {
  namespaced: true,
  state: initialState,
  mutations: {
    setTorrents(state, torrents) {
      state.torrents = torrents
    },
    setStream(state, stream) {
      state.stream = stream
    },
    setMovie(state, movie) {
      state.movie = movie
    },
    setMovieComments(state, comments) {
      state.movie.comments = comments
    },
  },
  getters: {
    currentUser(state) {
      return state.user
    }
  },
  actions: {
    async addComment({commit}, {id, comment}) {
      const {data} = await client.mutate({
        mutation: gql`
            mutation ($input: CommentMovieInput!) {
                commentMovie(input: $input) {
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
        `,
        variables: {input: {id, comment}}
      });
      commit("setMovieComments", data.commentMovie)
      return data.commentMovie
    },
    async fetchTorrents({commit}, {imdb}) {
      const {data} = await client.query({
        query: gql`
            query ($imdb: String!) {
                searchTorrent(imdb: $imdb) {
                    id
                    title
                    hash
                    quality
                    size
                    seeders
                    leechers
                    downloaded
                }
            }
        `,
        variables: {imdb}
      });
      commit("setTorrents", data.searchTorrent);
      return data.searchTorrent
    },
    async setStreamWatchTime({commit}, {id, duration}) {
      const {data} = await client.mutate({
        mutation: gql`
            mutation ($input: StreamWatchTimeInput!) {
                setStreamWatchTime(input: $input) {
                    id
                    duration
                }
            }
        `,
        variables: {
          input: {id, duration},
        }
      });
      return data.setStreamWatchTime
    },
    async startStream({commit}, {id}) {
      const {data} = await client.mutate({
        mutation: gql`
            mutation($id: ID!) {
                startStream(input: { id: $id }) {
                    id
                    duration
                    resumeAt
                    sources {
                        src
                        type
                        label
                    }
                    subtitles {
                        id
                        src
                        lang
                        label
                    }
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
        `,
        variables: {id}
      });
      commit("setStream", data.startStream);
      commit("setMovie", data.startStream.movie);
      return data.startStream
    },
    async fetchMovie({commit}, {id}) {
      const {data} = await client.query({
        query: gql`
            query ($id: ID!) {
                movie(id: $id) {
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
                    actors {
                        category
                        name
                    }
                }
            }
        `,
        variables: {id}
      });
      commit("setMovie", data.movie);
      return data.movie
    },
    async findMoviesTitle({commit}, {title, language, page, isAdult, genresFilter, yearFilter, notationFilter, sort}) {
      const {data} = await client.query({
        query: gql`
            query ($input: SearchMoviesInput!) {
                searchMovies(input: $input) {
                    id
                    primaryTitle
                    originalTitle
                    adult
                    year
                    minutes
                    genres
                    rating
                    votes
                    description
                    poster
                }
            }
        `,
        variables: {
          input: {
            title,
            language,
            page,
            isAdult,
            genresFilter,
            yearFilter,
            notationFilter,
            sort
          }
        }
      })
      return data.searchMovies
    },

    async fetchPopularMovies({commit}) {
      const {data} = await client.query({
        query: gql`
            query {
                populars {
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
                }
            }
        `,
      })
      return data.populars
    },

    async fetchDiscoverMovie({commit}) {
      console.log('start query')

      console.log('end query')
    },
  }
};
