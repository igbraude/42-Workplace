<template>
  <div class="login">
    <h3 class="login-title">Login</h3>

    <form @submit="submit">
      <Alert :error="error"></Alert>

      <b-form-group label="Username">
        <b-form-input v-model="username" type="text" placeholder="johndoe" autocomplete="username">
        </b-form-input>
      </b-form-group>

      <b-form-group label="Password">
        <b-form-input v-model="password" type="password" autocomplete="current-password">
        </b-form-input>
      </b-form-group>

      <b-row class="login-hyperlink">
        <b-col>
          <router-link to="/forgot-password">Forgot my password?</router-link>
        </b-col>
        <b-col style="padding-left: 50px">
          <router-link to="/register">Need to create an account?</router-link>
        </b-col>
      </b-row>
      <b-button variant="primary" block type="submit">Login</b-button>
      <a class="btn btn-primary btn-block" :href="`${host}/auth/github`">
        Login with Github
      </a>
      <a class="btn btn-primary btn-block" :href="`${host}/auth/42`">
        Login with 42
      </a>
    </form>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import Alert from '@/components/Alert'

  export default {
    name: 'Login',
    data() {
      return {
        username: '',
        password: '',
        error: undefined,
        host: process.env.GRAPHQL_API || 'http://localhost:4000',
      }
    },
    components: {
      Alert,
    },
    computed: {
      ...mapState('user', ['logged'])
    },
    methods: {
      ...mapActions('user', ['login']),
      async submit(event) {
        event.preventDefault()
        this.error = undefined
        try {
          await this.login({
            username: this.username,
            password: this.password
          })
          this.$router.push('/home')
        } catch (error) {
          this.error = error
        }
      },
    }
  };
</script>

<style scoped>
  .login {
    max-width: 500px;
    margin: 20px auto 40px;
    background: #000;
    color: #fff;
    padding: 45px;
    border-radius: 0.25rem;
  }

  .login-title {
    text-align: center;
    margin-bottom: 35px;
  }

  .login-hyperlink {
    text-decoration: none;
    margin-top: 15px;
    margin-bottom: 50px;
  }

  .login-hyperlink a {
    color: #fff;
  }
</style>
