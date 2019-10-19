<template>

  <div class="card" v-if="movie.id" @click="$router.push(`/movie/${movie.id}`)">
    <img :src="movie.poster
    ? `https://image.tmdb.org/t/p/w500/${movie.poster}`
    : 'https://todaytix-web-static.imgix.net/hero-placeholder.jpg?format=auto'" class="image">
    <div class="overlay">
      <div class="content">
        <h3>{{movie.primaryTitle ? movie.primaryTitle : '¯\\_(ツ)_/¯ Movie Not Found'}}</h3>
        <h3>
          <b-badge pill variant="light" class="mr-2">{{movie.year ? movie.year : ''}}</b-badge>
          <b-badge pill variant="light">{{movie.rating ? `${movie.rating}/10` : ''}}</b-badge>
        </h3>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'MovieCard',

    props: ['movie'],
  }
</script>

<style scoped>
  .card {
    min-width: 17.5rem;
    max-width: 17.5rem;
    min-height: 400px;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    border: none;
    margin-left: 10px;
    margin-right: 10px;
    width: 50%;
    cursor: pointer;
  }

  .card:hover .overlay {
    opacity: 0.85;
  }

  .image {
    display: block;
    width: 100%;
    height: 400px;
  }

  .overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: .4s ease;
    background-color: #000;
  }

  .content {
    color: white;
    font-size: 20px;
    position: absolute;
    white-space: normal;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    text-align: center;
  }
</style>
