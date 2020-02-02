import { router } from './router/index.js'
import { store } from './store/index.js'
import app from './app.js'

new Vue({
  store,
  router,
  render: h => h(app)
}).$mount('#app');
