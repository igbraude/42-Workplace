<template>
  <div class="forgot-password">
    <h3 class="forgot-password-title">Recover Your Password</h3>
    <Alert :error="error"></Alert>

    <form @submit="submit">
      <b-form-input type="text" autocomplete="username" style="display: none"></b-form-input>
      <b-form-input type="password" class="mb-1 mt-3" v-model="newPassword"
                    placeholder="Enter your new password" autocomplete="current-password"></b-form-input>
      <b-form-input type="password" class="mt-1 mb-3" v-model="confirmation"
                    placeholder="Confirm your password" autocomplete="new-password"></b-form-input>
      <b-button variant="primary" block type="submit" class="mt-4">Set new password</b-button>
    </form>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import Alert from '@/components/Alert'

  export default {
    name: "RecoveryPassword",
    data() {
      return {
        error: undefined,
        newPassword: '',
        confirmation: ''
      }
    },
    components: { Alert },
    methods: {
      ...mapActions('user', ['recoverPassword']),
      async submit(event) {
        event.preventDefault()
        this.error = undefined
        if (this.newPassword === this.confirmation) {
          try {
            await this.recoverPassword({
              token: this.$route.params.id,
              newPassword: this.newPassword
            })
            this.$router.push('/login')
          } catch (error) {
            this.error = error
          }
        } else {
          this.error = new Error("Passwords don't match")
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
