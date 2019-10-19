<template>
  <div class="picture-input">
    <div v-for="(picture, index) in pictures" :key="index" class="picture"
         :class="{ selected: value === picture.value }" @click="$emit('input', picture.value)">
      <img :src="picture.image" :alt="picture.value"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PictureInput',
    props: {
      value: String
    },
    data() {
      return {
        pictures: [
          {
            value: 'red',
            image: require('../assets/default_user1.png'),
          },
          {
            value: 'blue',
            image: require('../assets/default_user2.png'),
          },
          {
            value: 'yellow',
            image: require('../assets/default_user3.png'),
          }
        ]
      }
    }
  }
</script>

<style scoped>
  .picture-input {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    grid-auto-rows: minmax(100px, auto);
    margin-bottom: 10px;
  }

  .picture img {
    width: 100%;
  }

  .picture.selected {
    border: 5px solid #fff;
  }
</style>
