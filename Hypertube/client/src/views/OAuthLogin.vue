<template>
  <div class="login">
    <h3 class="login-title">Login</h3>
    <Alert :error="error"></Alert>
    <div v-if="needLogin">
      Please login or register to link this oauth provider.
      <router-link class="btn btn-block btn-primary" to="/login">
        Ok
      </router-link>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import Alert from '@/components/Alert'

  export default {
    name: 'OAuthLogin',
    components: {
      Alert,
    },
    data() {
      return {
        error: undefined,
        needLogin: false,
      }
    },
    methods: mapActions('user', ['loginFromOAuth']),
    async mounted() {
      try {
        let provider = this.$route.params.provider.toUpperCase()
        if (provider === '42') {
          provider = 'FOURTY_TWO'
        }
        const res = await this.loginFromOAuth({
          provider,
          code: this.$route.query.code,
        })
        if (res.token) {
          this.$router.push('/home')
        } else {
          this.needLogin = true
        }
      } catch (error) {
        this.error = error
      }
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
