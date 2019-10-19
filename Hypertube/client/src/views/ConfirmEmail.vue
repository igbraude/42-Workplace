<template>
  <div class="confirm-email">
    <h3 class="confirm-email-title">Activate your account</h3>
    <Alert :error="error"></Alert>

    <b-row>
      <b-button variant="primary" block @click="submit" class="mt-4">Activate</b-button>
    </b-row>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import Alert from '@/components/Alert'

  export default {
    name: "ConfirmEmail",
    data() {
      return {
        error: undefined,
      }
    },
    components: {
      Alert,
    },
    methods: {
      ...mapActions('user', ['confirmAccount']),
      async submit() {
        this.error = undefined
        try {
          await this.confirmAccount({
            token: this.$route.params.id
          })
          this.$router.push('/login')
        } catch (error) {
          this.error = error
        }
      }
    }
  }
</script>

<style scoped>
  .confirm-email {
    max-width: 500px;
    margin: 20px auto 40px;
    background: #000;
    color: #fff;
    padding: 45px;
    border-radius: 0.25rem;
  }

  .confirm-email-title {
    text-align: center;
    margin-bottom: 35px;
  }
</style>
