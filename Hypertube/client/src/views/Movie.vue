<template>
  <div class="movie">
    <Alert :error="error"></Alert>

    <template v-if="!loading">
      <div class="row mt-5">
        <div class="col-md-9">

          <div class="movie-title">{{movie.primaryTitle}}</div>
          <div class="movie-meta">
            Rated : {{movie.rating ? movie.rating : 'unavailable'}} /
            Category : {{movie.genres.length ? movie.genres.join(',') : 'unavailable'}} /
            Year : {{movie.year ? movie.year : 'unavailable'}} /
            Duration : {{movie.minutes ? `${movie.minutes} minutes` : 'unavailable'}}
          </div>

          <div class="movie-description">
            {{movie.description || "Description unavailable."}}
          </div>

          <h3 class="mt-3">Cast:</h3>
          <div class="actors-list">
            <div class="actor-card" v-for="(actor, index) in actors" :key="index">
              <h5>{{actor.name}}</h5>
              {{actor.category}}
            </div>
          </div>

        </div>
        <img v-if="movie.poster" class="col-md-3 py-3" :src="`https://image.tmdb.org/t/p/w500${movie.poster}`">
      </div>

      <div class="row">
        <div class="movie-torrent-list mt-5" v-if="torrents">
          <h3>Select a torrent</h3>
          <div class="movie-torrent" v-for="torrent in torrents" :key="torrent.id"
               @click="startStreaming(torrent.id)">
            {{torrent.title}} - {{torrent.quality}} - {{torrent.size}} (leechers: {{torrent.leechers}}, seeders:
            {{torrent.seeders}})
          </div>
        </div>
      </div>

      <MovieComments></MovieComments>
    </template>
    <template v-else>
      <div class="d-flex justify-content-center align-items-center">
        <b-spinner variant="danger"></b-spinner>
      </div>
    </template>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import Alert from '@/components/Alert'
  import MovieComments from '@/components/MovieComments'

  export default {
    name: 'Movie',
    data() {
      return {
        error: undefined,
        loading: true,
        actors: [],
      }
    },
    components: {
      Alert,
      MovieComments
    },
    computed: {
      ...mapState('movie', ['movie', 'torrents', 'stream'])
    },
    methods: {
      ...mapActions('movie', ['fetchMovie', 'fetchTorrents', 'startStream']),
      async startStreaming(id) {
        this.loading = true
        try {
          await this.startStream({id})
          this.$router.push(`/watch/${this.stream.id}`)
        } catch (error) {
          this.error = error
        } finally {
            this.loading = false
        }
      },
    },
    async created() {
        if (this.$route.params.id) {
            try {
                this.loading = true
                this.actors = (await this.fetchMovie({id: this.$route.params.id})).actors
                this.loading = false
                if (this.movie && this.$route.params.id) {
                    await this.fetchTorrents({imdb: this.$route.params.id})
                } else {
                    this.error = new Error('Invalid imdb id!')
                }
            } catch (error) {
                this.error = error
            }
        }
    },
  };
</script>

<style scoped>
  .movie {
    max-width: 1000px;
    margin: 20px auto 40px;
    background: #000;
    color: #fff;
    padding: 45px;
    border-radius: 0.25rem;
  }

  .movie-meta {
    color: #fff;
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 40px;
  }

  .movie-title {
    color: #fff;
    font-weight: 600;
    font-size: 38px;
    margin-bottom: 20px;
  }

  .movie-description {
    color: rgba(255, 255, 255, 0.5);
    font-size: 16px;
  }

  .movie-torrent-list {
    width: 100%;
    margin: 0 15px;
  }

  .movie-torrent {
    color: #d8d8d8;
    font-size: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    padding: 16px 0;
    cursor: pointer;
  }

  .movie-torrent:last-child {
    border-bottom: none;
  }

  .actors-list {
    display: flex;
    flex-direction: row;
    overflow: auto;
    white-space: nowrap;
    margin: 10px 0;
  }

  .actor-card {
    display: inline-block;
    border-radius: 4px;
    border: none;
    margin-left: 15px;
    margin-right: 15px;
    padding: 2%;
    cursor: pointer;
  }
</style>
