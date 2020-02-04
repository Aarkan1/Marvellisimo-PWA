import './services/registerServiceWorker.js'
import './services/stitch.js'
import { router } from './router/index.js'
import { store } from './store/index.js'
import app from './app.js'

export const eventBus = new Vue()

new Vue({
  store,
  router,
  render: h => h(app)
}).$mount('#app');
