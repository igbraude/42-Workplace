<template>
  <div class="container">
    <Alert :error="error"></Alert>

    <template v-if="currentUser">
      <b-row class="my-3 mt-5 justify-content-center">
        <h1 v-if="user.lang === 'FRENCH'">🇫🇷</h1>
        <h1 v-if="user.lang === 'ENGLISH'">🇬🇧</h1>
      </b-row>

      <h1 class="b-row user-title d-flex justify-content-center">
        <img class="user-avatar mx-3" :src="pictures[currentUser.picture]"/>
        {{currentUser.firstName}} {{currentUser.lastName}} ({{currentUser.username}})
        <img class="edit-logo mx-4 mt-2" v-if="user.id === currentUser.id" @click="$router.push('/update-user')"
             src="https://cdn4.iconfinder.com/data/icons/ui-actions/16/pencil-512.png"/>
      </h1>
      <h3 class="b-row user-title d-flex justify-content-center">{{currentUser.email}}</h3>
      <div class="mt-5">
        <template v-if="currentUser.watchTime.length">
          <h2>Movies watched: </h2>
          <div class="movie-list">
            <MovieCard v-for="(movie, index) in currentUser.watchTime" :key="index" :movie="movie.movie">
            </MovieCard>
          </div>
        </template>
        <template v-else>
          <h2>No movies watched yet, go try one ^^</h2>
        </template>
      </div>
    </template>

  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import PictureInput from '@/components/PictureInput'
  import MovieCard from '@/components/MovieCard'
  import Alert from '@/components/Alert'

  export default {
    name: 'User',
    components: {
      Alert,
      PictureInput,
      MovieCard,
    },
    data() {
      return {
        error: undefined,
        currentUser: undefined,
        pictures: {
          red: require('../assets/default_user1.png'),
          blue: require('../assets/default_user2.png'),
          yellow: require('../assets/default_user3.png')
        },
      }
    },
    computed: mapState('user', ['user']),
    methods: {
      ...mapActions('user', ['fetchMe', 'fetchUser']),
    },


    async mounted() {
      try {
        const {id} = this.$route.params
        if (id) {
          this.currentUser = await this.fetchUser({id})
        } else {
          this.currentUser = await this.fetchMe()
        }
      } catch (error) {
        this.error = error
      }
    },


    watch: {
      '$route.path': async function () {
        try {
          const {id} = this.$route.params
          if (id) {
            this.currentUser = await this.fetchUser({id})
          } else {
            this.currentUser = await this.fetchMe()
          }
        } catch (error) {
          this.error = error
        }
      },
    },
  }
</script>

<style scoped>
  .user-title {
    color: #fff;
  }

  .user-avatar {
    height: 64px;
    border-radius: .25rem;
  }

  .edit-logo {
    max-height: 25px;
    width: auto;
  }

  .edit-logo:hover {
    cursor: pointer
  }

  .movie-list {
    display: flex;
    flex-direction: row;
    overflow: auto;
    white-space: nowrap;
    margin: 10px 0;
  }
</style>
