<!--
  Borrow from vuepress
  https://github.com/vuejs/vuepress
  vuepress/lib/default-theme/NotFound.vue
-->
<template>
  <div class="content">
    <h1>404</h1>
    <blockquote>{{ getMsg() }}</blockquote>
    <router-link to="/">Take me home!</router-link>
  </div>
</template>

<script>
const msgs = [
  `There's nothing here.`,
  `How did we get here?`,
  `That's a Four-Oh-Four.`,
  `Looks like we've got some broken links.`
]

export default {
  methods: {
    getMsg () {
      return msgs[Math.floor(Math.random() * msgs.length)]
    }
  }
}
</script>

<style scoped>
blockquote {
  font-size: 1.2rem;
  color: #999;
  border-left: .25rem solid #dfe2e5;
  margin-left: 0;
  padding-left: 1rem;
}
h1 {
  color: #2c3e50;
  font-weight: 600;
  line-height: 1.25;
  font-size: 2.2rem;
  margin-top: 4.6rem;
  margin-bottom: 1rem;
}
a {
  color: #3eaf7c;
  font-weight: 500;
  text-decoration: none;
}
.content {
  padding: 2rem;
  max-width: 740px;
  margin: 0 auto;
}
</style>
