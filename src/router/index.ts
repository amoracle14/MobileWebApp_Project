import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [

  // ---------- Start ----------
  {
    path: '/',
    redirect: '/login'
  },

  // ---------- Login ----------
  {
    path: "/login",
    component: () => import("../views/LoginPage.vue")
  },

  {
    path: "/register",
    component: () => import("../views/RegisterPage.vue")
  },

  // ---------- Tabs ----------
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
      },
      {
        path: 'ai-analysis',
        component: () => import('../views/AiAnalysisPage.vue')
      },
      {
        path: 'summary-analyst',
        component: () => import('../views/SummaryAnalystPage.vue')
      }
    ]
  },

  // ---------- Quiz ----------
  {
    path: '/quiz/:page(\\d+)',
    component: () => import('@/views/QuizPage.vue')
  },

  {
    path: '/result',
    component: () => import('@/views/ResultPage.vue')
  },

  // ---------- Add Transaction ----------
  {
    path: '/add-transaction/:id?',
    component: () => import('../views/AddTransactionPage.vue')
  }

]

const router = createRouter({
  history: createWebHistory('/MobileWebApp_Project/'),
  routes
})

export default router