import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/home'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('../views/HomePage.vue')
      },
      {
        path: 'transactions',
        component: () => import('../views/TransactionsPage.vue')
      },
      {
        path: 'summary',
        component: () => import('../views/SummaryPage.vue')
      },
      {
        path: 'habits',
        component: () => import('../views/HabitsPage.vue')
      },
      {
        path: 'profile',
        component: () => import('../views/ProfilePage.vue')
      }
    ]
  },
  {
    path: '/add-transaction',
    component: () => import('../views/AddTransactionPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
