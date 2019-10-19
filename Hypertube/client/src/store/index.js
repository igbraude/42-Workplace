import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import user from './user'
import movie from './movie'

Vue.use(Vuex)

export default new Store({
  modules: {
    user,
    movie,
  },
})
