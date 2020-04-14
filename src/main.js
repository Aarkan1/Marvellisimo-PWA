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


window.addEventListener('online', () => {
  console.log("You are now back online.");
  let toastElement = document.querySelector('.bottom-toast');
  let toastInstance = M.Toast.getInstance(toastElement);
  toastInstance.dismiss();
});

window.addEventListener('offline', () => {
  console.log("You lost connection.");
  M.toast({
    html: `
      <div class="bottom-toast-text">
        <i class="material-icons">signal_wifi_off</i>
        You're currently offline
      </div>
    `, 
    classes: 'bottom-toast', 
    displayLength: Infinity
  })
});