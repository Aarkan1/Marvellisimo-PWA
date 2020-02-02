import home from '../views/home.js'
import about from '../views/about.js'
import testWithParams from '../views/testWithParams.js'
import missingPage from "../views/missingPage.js";

export const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      name:"home",
      path: '/', 
      component: home
    },
    {
      name: "about",
      path: '/about', 
      component: about
    },
    {
      name: "testWithParams",
      path: '/test-with-params/:text',
      component: testWithParams,
      params: true
    },
    {
      path: '*',
      component: missingPage,
    }
  ]
});