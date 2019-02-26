<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Edit `src/pages/**` and save to reload</p>
    <router-link to="bar">Go to bar</router-link>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      title: 'Hello, 😋'
    }
  }
}
</script>
