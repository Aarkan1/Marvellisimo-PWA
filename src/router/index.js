import homePage from '../views/homePage.js'
import favoritesPage from '../views/favoritesPage.js'
import recievedMessagesPage from '../views/recievedMessagesPage.js'
import friendsPage from '../views/friendsPage.js'
import searchPage from '../views/searchPage.js'
import searchListPage from '../views/searchListPage.js'
import loginPage from '../views/loginPage.js'
import missingPage from "../views/missingPage.js";

export const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      name:"home",
      path: '/', 
      component: homePage
    },
    {
      name: "favorites",
      path: '/favorites', 
      component: favoritesPage
    },
    {
      name: "login",
      path: '/login', 
      component: loginPage
    },
    {
      name: "recievedMessages",
      path: '/recieved-messages', 
      component: recievedMessagesPage
    },
    {
      name: "friends",
      path: '/friends', 
      component: friendsPage
    },
    {
      name: "searchPage",
      path: '/search', 
      component: searchPage
    },
    {
      name: "searchListPage",
      path: '/search/:term', 
      component: searchListPage
    },
    // {
    //   name: "testWithParams",
    //   path: '/test-with-params/:text',
    //   component: testWithParams,
    //   params: true
    // },
    {
      path: '*',
      component: missingPage,
    }
  ]
});