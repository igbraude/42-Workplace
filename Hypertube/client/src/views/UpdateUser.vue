<template>
  <div class="container">
    <Alert :error="error"></Alert>
    <b-alert variant="success" :show="!!success">{{success}}</b-alert>

    <div class="d-flex flex-row-reverse">
      <img class="edit-logo mx-4 mt-2" @click="$router.push('/user')" src="https://www.materialui.co/materialIcons/navigation/cancel_grey_192x192.png"/>
    </div>

    <div class="row">

      <div class="col-md-6">
        <h2>Edit my profile</h2>
        <form @submit="submitEdit">
          <PictureInput v-model="picture"></PictureInput>
          <b-form-group label="Username">
            <b-form-input v-model="username" type="text" placeholder="johndoe">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Email">
            <b-form-input v-model="email" type="email" placeholder="john.doe@example.com">
            </b-form-input>
          </b-form-group>
          <b-form-group label="First name">
            <b-form-input v-model="firstName" type="text" placeholder="John">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Last name">
            <b-form-input v-model="lastName" type="text" placeholder="Doe">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Lang">
              <b-form-select :options="langValues" text-field="label" value-field="value"
                v-model="lang">
              </b-form-select>
            </b-form-group>
          <b-form-group>
            <b-form-checkbox v-model="isAdult" :value="true" :unchecked-value="false">
              Adult ?
            </b-form-checkbox>
          </b-form-group>
          <b-button variant="primary" block type="submit">
            Edit
          </b-button>
        </form>
      </div>

      <div class="col-md-6" style="margin-top: 16%">
        <h2>Change my password</h2>
        <form @submit="submitPassword">
          <input type="text" autocomplete="username" name="username" :value="username || 'hello'" style="display: none"/>
          <b-form-group label="Old password">
            <b-form-input v-model="oldPassword" type="password" autocomplete="current-password">
            </b-form-input>
          </b-form-group>
          <b-form-group label="New password">
            <b-form-input v-model="newPassword" type="password" autocomplete="new-password">
            </b-form-input>
          </b-form-group>
          <b-button variant="primary" block type="submit">
            Change
          </b-button>
        </form>
      </div>

    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import PictureInput from '@/components/PictureInput'
import Alert from '@/components/Alert'

export default {
  name: 'UpdateUser',
  components: {
    Alert,
    PictureInput,
  },
  data() {
    return {
      picture: 'red',
      email: '',
      firstName: '',
      lastName: '',
      username: '',
      lang: '',
      isAdult: '',
      oldPassword: '',
      newPassword: '',
      langValues: [
        {
          label: 'English',
          value: 'ENGLISH',
        },
        {
          label: 'Français',
          value: 'FRENCH',
        },
      ],
      error: undefined,
      success: undefined,
    }
  },
  computed: mapState('user', ['user']),
  methods: {
    ...mapActions('user', ['fetchMe', 'updateUser', 'updatePassword']),
    async submitEdit(event) {
      event.preventDefault()
      this.error = undefined
      this.success = undefined
      try {
        await this.updateUser({
          email: this.email,
          username: this.username,
          picture: this.picture,
          firstName: this.firstName,
          lastName: this.lastName,
          lang: this.lang,
          isAdult: this.isAdult,
          lang: this.lang,
        })
        this.success = 'Profile edited.'
      } catch (error) {
        this.error = error
      }
    },
    async submitPassword(event) {
      event.preventDefault()
      this.error = undefined
      this.success = undefined
      try {
        await this.updatePassword({
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        })
        this.oldPassword = ''
        this.newPassword = ''
        this.success = 'Password changed.'
      } catch (error) {
        this.error = error
      }
    },
  },
  async mounted() {
    try {
      await this.fetchMe()
      this.email = this.user.email
      this.firstName = this.user.firstName
      this.lastName = this.user.lastName
      this.username = this.user.username
      this.picture = this.user.picture
      this.lang = this.user.lang
      this.isAdult = this.user.isAdult
    } catch (error) {
      this.error = error
    }
  },
}
</script>

<style scoped>
  .edit-logo {
    max-height: 35px;
    width: auto;
  }
  .edit-logo:hover {
    cursor: pointer
  }
</style>
