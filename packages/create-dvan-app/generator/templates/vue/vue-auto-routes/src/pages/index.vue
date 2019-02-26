<template>
  <div>
    <h1>{{ title }}</h1>
    <router-link to="bar">bar</router-link>
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
