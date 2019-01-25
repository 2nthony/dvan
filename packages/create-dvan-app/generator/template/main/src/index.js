/* eslint-env browser */
const h = tag => document.createElement(tag)

const title = h('h1')
title.textContent = 'Hello, 😋'

const tips = h('p')
tips.textContent = 'Edit `src/index.js` and save to reload'

const App = document.querySelector('#app') || document.body
App.appendChild(title)
App.appendChild(tips)
