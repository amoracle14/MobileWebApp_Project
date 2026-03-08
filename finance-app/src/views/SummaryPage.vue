<template>
  <ion-page>
    <ion-content :fullscreen="true" class="summary-page">
      <div class="top-gradient">
        <div class="top-bar">
          <ion-button fill="clear" class="back-btn" @click="goBack">
            <ion-icon :icon="chevronBackOutline" />
          </ion-button>

          <div class="page-title">สรุปรายรับ - รายจ่ายรายวัน</div>

          <div class="right-space"></div>
        </div>
      </div>

      <div class="content-wrap">
        <div v-if="loading" class="loading-text">กำลังโหลดข้อมูล...</div>

        <div v-else-if="days.length === 0" class="loading-text">
          ยังไม่มีข้อมูลรายการ
        </div>

        <div v-else>
          <div v-for="day in days" :key="day.date" class="day-card">
            <div class="day-header">
              <div class="day-left">
                <span class="dot"></span>
                <span class="date-text">{{ formatDisplayDate(day.date) }}</span>
              </div>

              <div class="count-text">{{ day.items.length }} รายการ</div>
            </div>

            <div class="summary-chip-row">
              <span class="chip chip-expense">
                -{{ day.expense.toLocaleString() }} THB
              </span>

              <span class="chip chip-income">
                +{{ day.income.toLocaleString() }} THB
              </span>

              <span class="chip chip-balance">
                คงเหลือ : {{ day.balance.toLocaleString() }} THB
              </span>
            </div>

            <div class="items-scroll">
              <div
                v-for="item in day.items"
                :key="item.id"
                class="item-card"
              >
                <div
                  class="item-icon-box"
                  :class="item.type === 'income' ? 'icon-income-bg' : 'icon-expense-bg'"
                >
                  <div class="item-icon">
                    {{ getCategoryIcon(item.category, item.type) }}
                  </div>
                </div>

                <div class="item-name">
                  {{ item.note || item.category || 'ไม่ระบุรายการ' }}
                </div>

                <div
                  class="item-amount"
                  :class="item.type === 'income' ? 'income-text' : 'expense-text'"
                >
                  {{ item.type === 'income' ? '+' : '-' }}{{ Number(item.amount).toLocaleString() }} THB
                </div>

                <div class="item-time">
                  {{ getFakeTime(item.date, item.id) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ion-tab-bar slot="bottom" class="custom-tabbar">
        <ion-tab-button tab="home">
          <ion-icon :icon="homeOutline" />
          <ion-label>หน้าหลัก</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="list">
          <ion-icon :icon="gridOutline" />
          <ion-label>รายการ</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="summary" selected>
          <ion-icon :icon="calendarOutline" />
          <ion-label>สรุปรายวัน</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="activity">
          <ion-icon :icon="pieChartOutline" />
          <ion-label>พฤติกรรม</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile">
          <ion-icon :icon="personOutline" />
          <ion-label>ฉัน</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonLabel
} from '@ionic/vue'
import {
  chevronBackOutline,
  homeOutline,
  gridOutline,
  calendarOutline,
  pieChartOutline,
  personOutline
} from 'ionicons/icons'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

type Transaction = {
  id: string
  amount: number
  category: string
  date: string
  note: string
  type: 'income' | 'expense'
}

type DayGroup = {
  date: string
  income: number
  expense: number
  balance: number
  items: Transaction[]
}

const router = useRouter()
const days = ref<DayGroup[]>([])
const loading = ref(true)

function goBack() {
  router.back()
}

function formatDisplayDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function getCategoryIcon(category: string, type: string) {
  const map: Record<string, string> = {
    food: '🍔',
    travel: '🚌',
    shopping: '🛒',
    salary: '💰',
    parttime: '💵',
    gift: '🎁',
    house: '🏠',
    health: '💊',
    education: '📚',
    other: '📦',
    อาหาร: '🍔',
    ของใช้: '🛒',
    โบนัส: '🎁',
    รายได้: '💰',
    ค่าเดินทาง: '🚌',
    ช้อปปิ้ง: '🛍️'
  }

  if (map[category]) return map[category]
  return type === 'income' ? '💰' : '💸'
}

function getFakeTime(date: string, id: string) {
  const mockTimes = ['12:00', '16:00', '17:00', '18:30', '19:30']
  let sum = 0
  const text = date + id

  for (let i = 0; i < text.length; i++) {
    sum += text.charCodeAt(i)
  }

  return mockTimes[sum % mockTimes.length]
}

async function loadTransactions() {
  try {
    loading.value = true

    const snapshot = await getDocs(collection(db, 'transactions'))
    const transactions: Transaction[] = []

    snapshot.forEach((docSnap) => {
      const data = docSnap.data()

      transactions.push({
        id: docSnap.id,
        amount: Number(data.amount || 0),
        category: data.category || 'other',
        date: data.date || '',
        note: data.note || '',
        type: data.type === 'income' ? 'income' : 'expense'
      })
    })

    const grouped: Record<string, DayGroup> = {}

    transactions.forEach((item) => {
      if (!item.date) return

      if (!grouped[item.date]) {
        grouped[item.date] = {
          date: item.date,
          income: 0,
          expense: 0,
          balance: 0,
          items: []
        }
      }

      grouped[item.date].items.push(item)

      if (item.type === 'income') {
        grouped[item.date].income += item.amount
      } else {
        grouped[item.date].expense += item.amount
      }

      grouped[item.date].balance =
        grouped[item.date].income - grouped[item.date].expense
    })

    Object.values(grouped).forEach((day) => {
      day.items.sort((a, b) => {
        if (a.type === b.type) return 0
        return a.type === 'expense' ? -1 : 1
      })
    })

    days.value = Object.values(grouped).sort((a, b) =>
      b.date.localeCompare(a.date)
    )
  } catch (error) {
    console.error('โหลด transactions ไม่สำเร็จ:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTransactions()
})
</script>

<style scoped>
.summary-page {
  --background: #f3f3f3;
}

.top-gradient {
  background: linear-gradient(90deg, #7dd7e8 0%, #bfd8fb 100%);
  padding: 44px 14px 26px;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  --color: #111;
  margin: 0;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 22px;
  font-weight: 800;
  color: #111;
  margin-right: 28px;
}

.right-space {
  width: 28px;
}

.content-wrap {
  padding: 16px 14px 100px;
  margin-top: -6px;
}

.day-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 14px;
}

.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.day-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  background: #77d8e8;
  border-radius: 50%;
  display: inline-block;
}

.date-text {
  font-size: 16px;
  font-weight: 800;
  color: #111;
}

.count-text {
  font-size: 13px;
  color: #8a8a8a;
}

.summary-chip-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.chip-expense {
  background: #ffd9d9;
  color: #ff2b2b;
}

.chip-income {
  background: #d5f4da;
  color: #30b44a;
}

.chip-balance {
  background: #ddebff;
  color: #3f8cff;
}

.items-scroll {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 4px 2px 8px;
}

.items-scroll::-webkit-scrollbar {
  display: none;
}

.item-card {
  min-width: 110px;
  width: 110px;
  background: #fff;
  border-radius: 16px;
  padding: 12px 10px 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  text-align: center;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-icon-box {
  width: 58px;
  height: 58px;
  margin: 0 auto 10px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-income-bg {
  background: #dff5df;
}

.icon-expense-bg {
  background: #f8e8e8;
}

.item-icon {
  font-size: 30px;
  line-height: 1;
}

.item-name {
  font-size: 14px;
  font-weight: 800;
  color: #111;
  min-height: 38px;
  max-width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.item-amount {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 800;
  border-radius: 8px;
  display: inline-block;
  padding: 4px 8px;
  line-height: 1.2;
}

.income-text {
  color: #24a148;
  background: #dff5df;
}

.expense-text {
  color: #ef3d3d;
  background: #ffdede;
}

.item-time {
  margin-top: 6px;
  font-size: 11px;
  color: #7a7a7a;
}

.loading-text {
  text-align: center;
  margin-top: 40px;
  color: #666;
}

.custom-tabbar {
  --background: #ffffff;
  border-top: 1px solid #ececec;
  padding-bottom: env(safe-area-inset-bottom);
}

ion-tab-button {
  --color: #222;
  --color-selected: #6fd2e8;
  font-size: 11px;
}
</style>