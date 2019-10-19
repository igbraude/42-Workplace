<template>
  <div class="forgot-password">
    <h3 class="forgot-password-title">Forgot Your Password</h3>

    <form @submit="submit">
      <Alert :error="error"></Alert>
      <b-alert variant="success" :show="success">
        Email sent.
      </b-alert>

      <b-form-group label="Email">
        <b-form-input v-model="email" type="text" placeholder="john.doe@example.com">
        </b-form-input>
      </b-form-group>

      <b-button variant="primary" block type="submit" class="mt-4">Send mail</b-button>
    </form>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import Alert from '@/components/Alert'

  export default {
    name: "ForgotPassword",
    data() {
      return {
        error: undefined,
        email: '',
        success: false,
      }
    },
    components: {
      Alert,
    },
    methods: {
      ...mapActions('user', ['forgotPassword']),
      async submit(event) {
        event.preventDefault()
        this.success = false
        this.error = undefined
        try {
          await this.forgotPassword({
            email: this.email,
          })
          this.success = true
          this.$router.push('/login')
        } catch (error) {
          this.error = error
        }
      }
    }
  }
</script>

<style scoped>
  .forgot-password {
    max-width: 500px;
    margin: 20px auto 40px;
    background: #000;
    color: #fff;
    padding: 45px;
    border-radius: 0.25rem;
  }

  .forgot-password-title {
    text-align: center;
    margin-bottom: 35px;
  }
</style>
