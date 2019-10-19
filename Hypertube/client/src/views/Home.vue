<template>
  <b-container fluid class="p-3">
    <Alert :error="error"></Alert>
    <b-row>
      <b-col>
        <h2 class="mt-5 mb-3 m-2">Most popular</h2>
        <div class="movie-list">
          <MovieCard v-for="(movie, index) in popularMovies" :key="index" :movie="movie">
          </MovieCard>
        </div>
      </b-col>
      <b-col>
        <h2 class="mt-5 mb-3 m-2">From your history</h2>
        <div class="movie-list" v-if="user && user.watchTime && user.watchTime.length">
          <MovieCard v-for="(movie, index) in user.watchTime.reduce((all, movie) => [
            ...all,
            ...(all.find(a => a.movie.id === movie.movie.id) ? [] : [movie])
          ], [])" :key="index" :movie="movie.movie">
          </MovieCard>
        </div>
        <div v-else class="m-2">
          <h3 style="color: #525f7f">No watched movies to display</h3>
        </div>
      </b-col>
    </b-row>
  </b-container>

</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import MovieCard from '@/components/MovieCard'
  import Alert from '@/components/Alert'

  export default {
    name: 'Home',
    components: {
      MovieCard,
      Alert,
    },
    data() {
      return {
        error: undefined,
        popularMovies: [],
      }
    },
    computed: mapState('user', ['user']),
    methods: {
      ...mapActions('movie', ['fetchPopularMovies']),
      ...mapActions('user', ['fetchMe'])
    },
    async mounted() {
      try {
        await this.fetchMe()
        this.popularMovies = await this.fetchPopularMovies()
      } catch (e) {
        this.error = e
      }
    },
  };
</script>

<style scoped>
  .movie-list {
    display: flex;
    flex-direction: row;
    overflow: auto;
    white-space: nowrap;
    margin: 10px 0;
  }

  h2 {
    color: #fff
  }
</style>
