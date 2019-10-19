<template>
  <div class="app">
    <b-navbar toggleable="lg" variant="dark" type="dark" fixed sticky>
      <b-navbar-brand to="/" class="navbar-brand">
        <img class="d-inline-block align-top" height="40px" src="@/assets/logo.png"/>
        Hypertube
      </b-navbar-brand>

      <template v-if="!error">

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>

          <b-navbar-nav v-if="logged" class="ml-auto mr-auto">
            <b-nav-item v-if="search !== ''" @click="search = ''">cancel</b-nav-item>
            <input id="search-bar" class="search-bar" type="text" v-model="search" placeholder="Search..."/>
          </b-navbar-nav>

          <b-navbar-nav class="d-flex align-items-center mr-0">
            <template>
              <b-nav-item v-if="user" to="/user">
                <b-img :src="pictures[user.picture]" class="user-picture mx-2"></b-img>
              </b-nav-item>
            </template>
            <template>
              <b-nav-item v-if="user" @click="submitLogout">Logout</b-nav-item>
            </template>
          </b-navbar-nav>
        </b-collapse>
      </template>
    </b-navbar>

    <div v-if="error" class="error">
      <Alert :error="error"></Alert>
    </div>
    <div v-else class="app-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Alert from '@/components/Alert'
  import {mapMutations, mapActions, mapState} from 'vuex'

  export default {
    name: 'App',
    components: {
      Alert,
    },

    data() {
      return {
        search: '',
        submit: 0,
        cancelIcon: "https://www.materialui.co/materialIcons/navigation/cancel_grey_192x192.png",
        pictures: {
          red: require('./assets/default_user1.png'),
          blue: require('./assets/default_user2.png'),
          yellow: require('./assets/default_user3.png'),
        },
        error: undefined,
      }
    },

    methods: {
      ...mapMutations('user', ['logout']),
      ...mapActions('user', ['fetchMe']),

      submitLogout() {
        localStorage.search = ''
        this.logout();
        this.$router.push('/login');
      }
    },

    computed: mapState('user', ['user', 'logged']),


    watch: {
      search: function () {
        localStorage.search = this.search
        if (this.submit === 0) {
          if (this.$route.path !== '/search') {
            this.$router.push({name: 'search'})
          }
        }
        if (this.submit === 1)
          this.submit = 0
        if (this.search === '') {
          this.$router.go(-1)
        }
      },
    },

    async created() {
      if (this.logged) {
        try {
          await this.fetchMe()
        } catch (e) {
          this.error = e
          this.logout()
          this.$router.push('/login')
        }
      }
    },

    mounted() {
      if (localStorage.search) {
        this.search = localStorage.search
        if (localStorage.route !== '/search') {
          this.submit = 1
        }
      }
    }
  }
</script>

<style>
  body {
    background: url(http://www.cinevillamorra.com.py/img/secciones/cinema_seats.jpg) no-repeat center center fixed;
    background-size: cover;
  }

  body.black {
    background: #000;
  }

  h3 {
    color: #fff;
    font-size: 24px;
  }

  .app {
    margin: 0;
    font-family: 'Asap', Arial, sans-serif;
    font-size: .875rem;
    font-weight: 400;
    color: #525f7f;
  }

  .btn:focus, .btn.focus, .form-control:focus {
    outline: none;
    box-shadow: none;
  }

  .form-control:-internal-autofill-selected {
    background: #fff;
  }

  .btn-primary {
    background: #cf0010;
    border-color: #cf0010;
  }

  .btn-primary:hover, .btn-primary:focus, .btn-primary:active {
    background: #791d20;
    border-color: #791d20;
  }

  .alert-danger {
    color: #fff;
    background-color: #e77b05;
    border-color: #e77b05;
  }

  .alert-success {
    color: #fff;
    background-color: #34a852;
    border-color: #34a852;
  }

  .bg-dark {
    background-color: rgba(0, 0, 0, 0.95) !important;
  }

  .navbar-brand {
    font-size: 25px;
    font-weight: 500;
  }

  .search-bar {
    max-width: 300px;
    height: 35px;
    box-sizing: border-box;
    border: 0px solid #ccc;
    border-radius: 50px;
    font-size: 16px;
    background-color: white;
    background-image: url('./assets/searchicon.png');
    background-position: 10px 10px;
    background-repeat: no-repeat;
    padding: 12px 20px 12px 40px;
  }

  .search-bar:focus {
    outline: none;
  }

  .user-picture {
    width: 35px;
    height: auto
  }

  .edit-logo {
    max-height: 20px;
    width: auto;
  }

  .error {
    max-width: 500px;
    margin: 20px auto 40px;
    color: #fff;
    padding: 45px;
    border-radius: 0.25rem;
  }
</style>
