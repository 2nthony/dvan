import { createApp } from './core'

const { app<% if (VueRouter) { %>, router<% } %> } = createApp()

<% if (VueRouter) { -%>
router.onReady(() => <% } %>app.$mount('#app')<% if (VueRouter) { %>)<% } %>
