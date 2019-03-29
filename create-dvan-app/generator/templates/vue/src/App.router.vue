<template>
  <div id="app">
    <h1>{{ title }}</h1>
    <p>Edit `src/views/**` and save to reload</p>

    <p>
      <router-link to="/">Home</router-link>
      <router-link to="bar">Bar</router-link>
    </p>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello, 😋'
    }
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
