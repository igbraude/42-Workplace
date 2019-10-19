<template>
  <div class="movie-comments mt-5" v-if="movie">
    <Alert :error="error"></Alert>

    <form class="form-row align-items-center" @submit="submit">
      <div class="col-sm-9 col-md-10">
        <b-form-textarea v-model="comment" class="text-input" placeholder="Comment..."></b-form-textarea>
      </div>
      <div class="col-sm-3 col-md-2">
        <b-button variant="primary" block type="submit" :disabled="!comment.length">Comment</b-button>
      </div>
    </form>

    <div class="movie-comments-list">
      <div v-for="comment in comments" :key="comment.id" class="row align-items-center">
        <p class="comment-user" @click="$router.push(`/user/${comment.user.id}`)">
          <b-badge pill variant="danger" style="color: white">{{comment.user.username}}</b-badge>
        </p>
        <p style="color: #fff; font-size: 12px; margin-bottom: 14px">{{comment.comment}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import Alert from '@/components/Alert'

  export default {
    name: 'MovieComments',
    components: {
      Alert,
    },
    data() {
      return {
        error: undefined,
        comment: '',
      }
    },
    computed: {
      ...mapState('movie', ['movie']),
      comments() {
        return this.movie.comments
      }
    },
    methods: {
      ...mapActions('movie', ['addComment']),
      async submit(event) {
        event.preventDefault()
        if (!this.comment.length) return
        this.error = undefined
        try {
          await this.addComment({
            id: this.movie.id,
            comment: this.comment
          })
          this.comment = ''
        } catch (error) {
          this.error = error
        }
      }
    }
  }
</script>

<style scoped>
  form {
    text-align: center;
    margin: 0 auto;
  }

  .text-input {
    display: block;
    width: 100%;
    border: 0;
    padding: 10px 5px;
    color: #fff;
    background: black no-repeat;
    background-image: linear-gradient(to bottom, #E50914, #E50914), linear-gradient(to bottom, silver, silver);
    background-size: 0 2px, 100% 1px;
    background-position: 50% 100%, 50% 100%;
    transition: background-size 0.3s cubic-bezier(0.64, 0.09, 0.08, 1);
  }

  .text-input:focus {
    background-size: 100% 2px, 100% 1px;
    outline: none;
  }

  .movie-comments-list {
    margin: 25px 20px
  }

  .comment-user {
    color: #E50914;
    font-size: 16px;
    font-weight: 600;
    margin-right: 5px
  }

  .comment-user:hover {
    cursor: pointer;
  }
</style>
