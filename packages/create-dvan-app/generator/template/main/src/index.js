/* eslint-env browser */

const title = document.createElement('h1')
title.textContent = 'Hello, 😋'

const tips = document.createElement('div')
tips.textContent = 'Edit `src/index.js` and save to reload'

const App = document.querySelector('#app') || document.body
App.appendChild(title)
App.appendChild(tips)
