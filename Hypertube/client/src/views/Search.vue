<template>
  <div>

    <div v-if="error" class="error">
      <Alert :error="error"></Alert>
    </div>

    <b-row v-if="!error">
      <b-col class="col-sm-3 pl-5" style="z-index: 1000">

        <b-row>
          <b-col>
            <h3 style="color: #fff; margin-top: 1rem">Sort By</h3>
          </b-col>
          <b-col>
            <b-button class="m-2" variant="link" style="color: grey" @click="setSort('', '')">Clear
            </b-button>
          </b-col>
        </b-row>
        <form class="multi-range-field">
          <b-row class="my-2 mx-1">
            <b-col>
              <button type="button"
                      :class="(sort.year === 'ASC'  ? 'btn-danger' : 'btn-outline-danger') + ' btn btn-block '"
                      @click="setSort('year', 'ASC')">oldest release
              </button>
            </b-col>
            <b-col>
              <button type="button"
                      :class="(sort.year === 'DESC' ? 'btn-danger' : 'btn-outline-danger') + ' btn btn-block '"
                      @click="setSort('year', 'DESC')">latest release
              </button>
            </b-col>
          </b-row>
          <b-row class="my-2 mx-1">
            <b-col>
              <button type="button"
                      :class="(sort.rating === 'ASC' ? 'btn-danger' : 'btn-outline-danger') + ' btn btn-block '"
                      @click="setSort('rating', 'ASC')">most controverted
              </button>
            </b-col>
            <b-col>
              <button type="button"
                      :class="(sort.rating === 'DESC' ? 'btn-danger' : 'btn-outline-danger') + ' btn btn-block '"
                      @click="setSort('rating', 'DESC')">most liked
              </button>
            </b-col>
          </b-row>
        </form>

        <form class="multi-range-field my-2 mt-5">
          <b-row>
            <b-col>
              <h3 style="color: #fff; margin-top: 1rem">Genres</h3>
            </b-col>
            <b-col>
              <b-button class="m-2" variant="link" style="color: grey" @click="clearFilters(vm)">Clear
                All
              </b-button>
            </b-col>
          </b-row>
          <b-button class="m-2" pill :variant="genres[key] ? 'danger' : 'outline-danger'"
                    v-for="(value, key, index) in genres" :key="index" :disabled="(!isUserAdult && key === 'adult')"
                    @click="setGenre(key)" :id="key">
            {{key}}
          </b-button>

          <h3 style="color: #fff" class="mb-2 mt-4">Year Production Range</h3>
          <section class="production-year-range">
            1894
            <vue-slider :min="1894" :max="2019" v-model="yearRange" adsorb></vue-slider>
            2019
          </section>

          <h3 style="color: #fff" class="mb-2 mt-4">Notation Range</h3>
          <section class="rating-range">
            0
            <vue-slider :min="0" :max="10" v-model="ratingRange" adsorb></vue-slider>
            10
          </section>

          <b-row>
            <b-col>
              <b-button class="m-2" block variant="danger" @click="applyGenres()">Apply</b-button>
            </b-col>
          </b-row>

        </form>

      </b-col>
      <b-col class="col-sm-9" v-if="requestDone">
        <div v-if="!movies.length">
          <b-row class="justify-content-center mt-5" style="color: #fff; margin-right: 25%">
            <h3 style="color: lightgrey; font-size: 3vw;">NO MOVIE FOUND</h3>
          </b-row>
        </div>
        <div v-else id="search-content" class="search-content">
          <MovieCard v-for="(movie, index) in movies" :key="index" :movie="movie"></MovieCard>
        </div>
      </b-col>

    </b-row>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import MovieCard from '@/components/MovieCard'
  import Alert from '@/components/Alert'


  export default {
    name: "Search",

    components: {
      Alert,
      MovieCard,
    },

    data() {
      return {
        requestDone: false,
        userSet: false,
        isUserAdult: false,
        movies: [],
        search: localStorage.search,
        language: 'English',
        page: 0,
        sort: {
          first: '',
          year: '',
          rating: '',
        },
        genres: {
          animation: false,
          history: false,
          sport: false,
          horror: false,
          adult: false,
          family: false,
          music: false,
          adventure: false,
          thriller: false,
          comedy: false,
          romance: false,
          war: false,
          action: false,
          fantasy: false,
          biography: false,
          drama: false,
          crime: false,
          western: false,
          mystery: false,
          musical: false,
          documentary: false,
          sciFi: false,
        },
        yearRange: [1894, 2019],
        ratingRange: [0, 10],
        func: undefined,
        error: undefined,
        moviesStop: false,
      }
    },

    mounted() {
      this.func = this.debounce(() => {
        this.inputValue()
      }, 500)
      document.getElementById('search-bar').addEventListener('keyup', this.func)
      window.addEventListener('scroll', this.handleScroll);
      if (this.currentUser !== undefined) {
        this.setIsUserAdult()
      }
      this.requestDone = true
    },

    methods: {
      ...mapActions('movie', ['findMoviesTitle']),
      ...mapMutations('user', ['logout']),

      inputValue() {
        this.search = document.getElementById('search-bar').value;
      },

      debounce(func, wait, immediate) {
        let timeout;
        return () => {
          let context = this, args = arguments
          const later = () => {
            timeout = null
            if (!immediate) func.apply(context, args)
          }
          let callNow = immediate && !timeout
          clearTimeout(timeout)
          timeout = setTimeout(later, wait)
          if (callNow) func.apply(context, args)
        }
      },

      async handleScroll() {

        if (this.movies !== undefined) {
          if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && (this.movies.length % 20 === 0) && this.moviesStop === false) {
            this.page++
            const currentSearch = await this.getMovies(this)
            if (currentSearch.length >= 0 && currentSearch.length < 20) {
              this.moviesStop = true
            }
            this.movies = this.movies.concat(currentSearch)
          }
        }
      },

      setGenre(genre) {
        this.genres[genre] = !this.genres[genre]
      },

      async setIsUserAdult() {
        this.isUserAdult = this.currentUser.isAdult
        this.movies = await this.getMovies(this)
        this.requestDone = true
      },

      clearFilters: async (vm) => {
        Object.keys(vm.genres).map(function (key, index) {
          vm.genres[key] = false
        })
        vm.yearRange = [1894, 2019]
        vm.ratingRange = [0, 10]
        vm.page = 0
        vm.movies = await vm.getMovies()
      },

      async applyGenres() {
        this.page = 0
        this.movies = await this.getMovies()
      },

      async getMovies() {
        try {
          let data = await this.findMoviesTitle({
            title: this.search,
            language: this.language,
            page: this.page,
            isAdult: this.isUserAdult,
            genresFilter: this.genres,
            yearFilter: {min: this.yearRange[0], max: this.yearRange[1]},
            notationFilter: {min: this.ratingRange[0], max: this.ratingRange[1]},
            sort: this.sort,
          })
          return data;

        } catch (error) {
          this.error = error
          this.logout()
          this.$router.push('/login')
        }
      },

      async setSort(option, orderBy) {
        if (option === '' || orderBy === '') {
          this.sort.year = ''
          this.sort.rating = ''
          this.sort.first = ''
          return;
        } else if (orderBy === 'ASC' && option === 'year') {
          this.sort[option] === '' || this.sort[option] === 'DESC' ? this.sort[option] = 'ASC' : this.sort[option] = ''
        } else if (orderBy === 'DESC' && option === 'year') {
          this.sort[option] === '' || this.sort[option] === 'ASC' ? this.sort[option] = 'DESC' : this.sort[option] = ''
        } else if (orderBy === 'ASC' && option === 'rating') {
          this.sort[option] === '' || this.sort[option] === 'DESC' ? this.sort[option] = 'ASC' : this.sort[option] = ''
        } else if (orderBy === 'DESC' && option === 'rating') {
          this.sort[option] === '' || this.sort[option] === 'ASC' ? this.sort[option] = 'DESC' : this.sort[option] = ''
        }

        /*
          Check which one of the sort as been clicked first
         */

        if (this.sort.first === '' && this.sort[option] !== '') {
          this.sort.first = option
        } else if (this.sort.first === option && this.sort[option] === '') {
          this.sort.first = ''
          if (this.sort.year !== '') {
            this.sort.first = 'year'
          } else if (this.sort.rating !== '') {
            this.sort.first = 'rating'
          }
        }
      },
    },

    watch: {
      search: async function () {
        this.page = 0
        this.requestDone = false
        this.movies = await this.getMovies(this)
        this.requestDone = true
      },

      'currentUser': async function () {
        this.isUserAdult = this.currentUser.isAdult
        this.movies = await this.getMovies(this)
        this.requestDone = true
      },

      'sort.year': async function () {
        this.page = 0
        this.movies = await this.getMovies(this)
      },

      'sort.rating': async function () {
        this.page = 0
        this.movies = await this.getMovies(this)
      },
    },

    computed: {
      ...mapGetters('user', ['currentUser'])
    },

    beforeDestroy() {
      if (document.getElementById('search-bar')) {
        document.getElementById('search-bar').removeEventListener('keyup', this.debounce())
        window.removeEventListener('scroll', this.handleScroll);
      }
    },

  }

</script>

<style scoped>
  .search-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr));
    grid-gap: 15px;
    margin: auto;
    max-width: 1462px;
  }
</style>
