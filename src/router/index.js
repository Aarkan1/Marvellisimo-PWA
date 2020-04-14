import homePage from '../views/homePage.js'
import favoritesPage from '../views/favoritesPage.js'
import receivedMessagesPage from '../views/receivedMessagesPage.js'
import friendsPage from '../views/friendsPage.js'
import searchPage from '../views/searchPage.js'
import searchListPage from '../views/searchListPage.js'
import detailsPage from '../views/detailsPage.js'
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
      // component: () => import('../views/favoritesPage.js')
      component: favoritesPage
    },
    {
      name: "login",
      path: '/login', 
      component: loginPage
    },
    {
      name: "receivedMessages",
      path: '/received-messages', 
      // component: () => import('../views/recievedMessagesPage.js')
      component: receivedMessagesPage
    },
    {
      name: "friends",
      path: '/friends', 
      // component: () => import('../views/friendsPage.js')
      component: friendsPage
    },
    {
      name: "searchPage",
      path: '/search', 
      // component: () => import('../views/searchPage.js')
      component: searchPage
    },
    {
      name: "searchListPage",
      path: '/search/:term', 
      // component: () => import('../views/searchListPage.js')
      component: searchListPage
    },
    {
      name: "detailsPage",
      path: '/details/:id', 
      // component: () => import('../views/detailsPage.js'),
      component: detailsPage,
      params: true
    },
    {
      path: '*',
      component: missingPage,
    }
  ]
});