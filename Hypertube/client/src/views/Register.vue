<template>
  <div class="register">
    <h3 class="register-title">Register</h3>

    <form @submit="submit">
      <Alert :error="error"></Alert>

      <PictureInput v-model="picture"></PictureInput>

      <b-form-group label="Username">
        <b-form-input v-model="username" type="text" name="username" autocomplete="username" placeholder="johndoe">
        </b-form-input>
      </b-form-group>

      <b-form-group label="Email">
        <b-form-input v-model="email" type="email" placeholder="john.doe@example.com">
        </b-form-input>
      </b-form-group>

      <b-form-group label="First name">
        <b-form-input v-model="firstName" type="text" placeholder="John" autocomplete="name">
        </b-form-input>
      </b-form-group>

      <b-form-group label="Last name">
        <b-form-input v-model="lastName" type="text" placeholder="Doe" autocomplete="name">
        </b-form-input>
      </b-form-group>

      <b-form-group label="Password">
        <b-form-input v-model="password" type="password" autocomplete="new-password">
        </b-form-input>
      </b-form-group>

      <div class="register-hyperlink">
        <router-link to="/login">already have an account?</router-link>
      </div>

      <b-button variant="primary" block type="submit">Register</b-button>
    </form>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import Alert from '@/components/Alert'
  import PictureInput from '@/components/PictureInput'

  export default {
    name: 'Register',
    data() {
      return {
        picture: 'red',
        email: '',
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        error: undefined,
      }
    },
    components: {
      Alert,
      PictureInput,
    },
    computed: {
      ...mapState('user', ['logged'])
    },
    methods: {
      ...mapActions('user', ['register']),
      async submit(event) {
        event.preventDefault()
        this.error = undefined
        try {
          await this.register({
            email: this.email,
            username: this.username,
            picture: this.picture,
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password
          })
          this.$router.push('/login')
        } catch (error) {
          this.error = error
        }
      }
    },
  };
</script>

<style scoped>
  .register {
    max-width: 500px;
    margin: 20px auto 40px;
    background: #000;
    color: #fff;
    padding: 45px;
    border-radius: 0.25rem;
  }

  .register-title {
    text-align: center;
    margin-bottom: 35px;
  }

  .register-hyperlink {
    text-decoration: none;
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .register-hyperlink a {
    color: #fff;
  }
</style>
