```vue
<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- HEADER -->
      <div class="header-container">
        <img src="/Group 237.png" class="bg-decoration" />

        <div class="content-wrapper">
          <div class="user-info">
            <div class="profile-section">
              <ion-avatar class="avatar">
                <img src="/gojo.jpg" />
              </ion-avatar>

              <div class="wallet-balance">
                <h2>฿ {{ balance.toLocaleString() }}</h2>
                <p>บัญชี : xxx-x-xx890-x</p>
              </div>
            </div>

            <ion-icon :icon="menuOutline" class="menu-icon"></ion-icon>
          </div>

          <div class="wallet-card-main">
            <div class="wallet-icon-container">
              <img src="/wallet.png" class="wallet-img" />

              <div class="wallet-text">
                <h3>กระเป๋าตังที่ 1</h3>
                <p>รายรับและรายจ่ายของฉัน</p>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-badges">
          <div class="test-quiz-card" @click="$router.push('/quiz/1')">
            <p>แบบทดสอบ</p>
            <span>คุณคือนักออมแบบไหน</span>

            <ion-icon
              :icon="chevronForwardOutline"
              class="quiz-arrow"
            ></ion-icon>
          </div>

          <div class="right-badges-group">
            <div class="days-badge">{{ days.length }} วัน</div>

            <div class="items-badge">{{ transactions.length }} รายการ</div>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <!-- MAIN CONTENT -->
      <div class="main-content">
        <h3 class="section-title">รายละเอียด</h3>

        <!-- การใช้จ่ายล่าสุด -->
        <div class="recent-card">
          <div class="card-header">
            <span>
              <span class="dot"></span>
              การใช้จ่ายล่าสุด
            </span>
          </div>

          <!-- ถ้ามีรายการล่าสุด -->
          <div v-if="latestTransaction" class="transaction-item">
            <div class="transaction-detail">
              <div class="row">
                <span>หมวดหมู่</span>
                <span>
                  {{
                    categoryMap[latestTransaction.category] ||
                    latestTransaction.category
                  }}
                </span>
              </div>

              <div class="row">
                <span>จำนวนเงิน</span>

                <span
                  :class="
                    latestTransaction.type === 'income'
                      ? 'amount-plus'
                      : 'amount-negative'
                  "
                >
                  {{ latestTransaction.type === "income" ? "+" : "-" }}
                  {{ latestTransaction.amount }}
                </span>
              </div>

              <div class="row">
                <span>วันที่</span>
                <span>
                  {{ formatDate(latestTransaction.date) }}
                </span>
              </div>

              <div class="row">
                <span>รายละเอียด</span>
                <span>
                  {{ latestTransaction.note || "-" }}
                </span>
              </div>
            </div>
          </div>

          <!-- ถ้าไม่มีรายการ -->
          <div v-else class="empty-text">ยังไม่มีรายการล่าสุด</div>
        </div>
      </div>

      <!-- SUMMARY MONTH -->
      <div class="recent-card" style="margin: 0 1%;">
        <div class="summary-card income">
          <div class="summary-text">รายรับเดือนนี้</div>

          <div class="summary-amount">
            {{ incomeMonth.toLocaleString() }} THB
          </div>
        </div>

        <div class="summary-card debt">
          <div class="summary-text">รายจ่ายเดือนนี้</div>

          <div class="summary-amount">
            {{ expenseMonth.toLocaleString() }} THB
          </div>
        </div>
      </div>

      <!-- สรุปรายวันล่าสุด -->
      <div class="recent-card" style="margin: 1% 1%;">
        <div class="card-header">
          <span><span class="dot"></span>สรุปรายวันล่าสุด</span>
        </div>

        <div
          v-for="day in days.slice(0, 1)"
          :key="day.date"
          class="day-container"
        >
          <div class="day-header">
            <div class="date">
              {{ formatDisplayDate(day.date) }}
            </div>

            <div class="count">{{ day.items.length }} รายการ</div>
          </div>

          <div class="summary">
            <ion-chip color="danger">
              <ion-label> -{{ day.expense.toLocaleString() }} THB </ion-label>
            </ion-chip>

            <ion-chip color="success">
              <ion-label> +{{ day.income.toLocaleString() }} THB </ion-label>
            </ion-chip>

            <ion-chip color="primary">
              <ion-label>
                คงเหลือ : {{ day.balance.toLocaleString() }} THB
              </ion-label>
            </ion-chip>
          </div>

          <div class="items">
            <div v-for="item in day.items" :key="item.id" class="item-card">
              <div class="icon">
                {{ getCategoryIcon(item.category, item.type) }}
              </div>

              <div class="name">
                {{ item.note || item.category }}
              </div>

              <div
                :class="
                  item.type === 'income' ? 'amount-plus' : 'amount-negative'
                "
              >
                {{ item.type === "income" ? "+" : "-" }}
                {{ item.amount }}
              </div>

              <div class="time">
                {{ getFakeTime(item.date, item.id) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ADD BUTTON -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-button class="add-btn" router-link="/add-transaction">
          <ion-icon slot="start" :icon="addOutline"></ion-icon>

          เพิ่มรายการ
        </ion-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import {
  IonPage,
  IonContent,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonIcon,
  IonFab,
  IonButton,
  IonChip,
  IonLabel,
} from "@ionic/vue";

import { menuOutline, chevronForwardOutline, addOutline } from "ionicons/icons";

import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { db } from "../firebase";

type Transaction = {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
  type: "income" | "expense";
  userId: string;
};

type DayGroup = {
  date: string;
  income: number;
  expense: number;
  balance: number;
  items: Transaction[];
};

const transactions = ref<Transaction[]>([]);
const days = ref<DayGroup[]>([]);

const incomeMonth = ref(0);
const expenseMonth = ref(0);
const balance = ref(0);

const latestTransaction = computed(() => {
  if (!transactions.value.length) return null;

  return [...transactions.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];
});
const latestDateGroup = computed(() => {
  if (!days.value.length) return [];

  return [days.value[0]];
});
const categoryMap: Record<string, string> = {
  food: "อาหาร",
  shopping: "ช้อปปิ้ง",
  travel: "เดินทาง",
  salary: "เงินเดือน",
  other: "อื่นๆ",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("th-TH");
}

function formatDisplayDate(date: string) {
  return new Date(date).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getCategoryIcon(category: string, type: string) {
  const map: Record<string, string> = {
    food: "🍔",
    shopping: "🛒",
    travel: "🚌",
    salary: "💼",
    gift: "🎁",
    health: "💊",
    education: "📚",
    other: "📦",
  };

  if (map[category]) return map[category];

  return type === "income" ? "💰" : "💸";
}

function getFakeTime(date: string, id: string) {
  const mockTimes = ["12:00", "16:00", "17:00", "18:30", "19:30"];

  let sum = 0;

  const text = date + id;

  for (let i = 0; i < text.length; i++) {
    sum += text.charCodeAt(i);
  }

  return mockTimes[sum % mockTimes.length];
}

async function loadTransactionsByUser(uid: string) {
  const q = query(collection(db, "transactions"), where("userId", "==", uid));

  const snapshot = await getDocs(q);

  const txs: Transaction[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    txs.push({
      id: docSnap.id,
      amount: Number(data.amount || 0),
      category: data.category || "other",
      date: data.date || "",
      note: data.note || "",
      type: data.type === "income" ? "income" : "expense",
      userId: data.userId || "",
    });
  });

  transactions.value = txs
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  groupByDay(txs);

  calculateSummary(txs);
}

function groupByDay(list: Transaction[]) {
  const grouped: Record<string, DayGroup> = {};

  list.forEach((item) => {
    if (!grouped[item.date]) {
      grouped[item.date] = {
        date: item.date,
        income: 0,
        expense: 0,
        balance: 0,
        items: [],
      };
    }

    grouped[item.date].items.push(item);

    if (item.type === "income") {
      grouped[item.date].income += item.amount;
    } else {
      grouped[item.date].expense += item.amount;
    }

    grouped[item.date].balance =
      grouped[item.date].income - grouped[item.date].expense;
  });

  days.value = Object.values(grouped)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
}

function calculateSummary(list: Transaction[]) {
  let income = 0;
  let expense = 0;

  const now = new Date();

  list.forEach((item) => {
    const d = new Date(item.date);

    if (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    ) {
      if (item.type === "income") {
        income += item.amount;
      } else {
        expense += item.amount;
      }
    }
  });

  incomeMonth.value = income;
  expenseMonth.value = expense;
  balance.value = income - expense;
}

onMounted(() => {
  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await loadTransactionsByUser(user.uid);
    }
  });
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap");
* {
  font-family: "Kanit", sans-serif;
}

.header-container {
  background: linear-gradient(90deg, #74d7e9 0%, #bff0f3 60%, #b2cff4 100%);
  padding: 50px 20px 30px 20px;
  position: relative;
  overflow: hidden;

  color: #1d1d1f;
  z-index: 1;
}

.bg-decoration {
  position: absolute;
  top: 20%;
  right: 0;
  width: 85%;
  height: auto;
  z-index: 1;
  pointer-events: none;
  opacity: 0.8;
}
.content-wrapper {
  position: relative;
  z-index: 10;
}
.menu-icon {
  font-size: 2rem;
  color: #1d1d1f;
}
.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.profile-section {
  display: flex;
  align-items: center;
}

.avatar {
  width: 45px;
  height: 45px;
}

.wallet-balance {
  margin-left: 12px;
}

.wallet-balance h2 {
  margin: 0;
  font-weight: bold;
  font-size: 1.2rem;
}

.wallet-balance p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

/* จุดที่ปรับปรุง: จัดให้รูปและข้อความอยู่บรรทัดเดียวกัน */
.wallet-icon-container {
  display: flex; /* จัดวางในแนวนอน */
  align-items: center; /* กึ่งกลางแนวตั้ง */
  gap: 12px; /* ระยะห่างระหว่างรูปและข้อความ */
}

.wallet-img {
  width: 90px; /* ปรับขนาดรูปให้พอดี */
  height: auto;
  filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
}

.wallet-text h3 {
  margin: 0;
  font-weight: bold;
  font-size: 1.5rem;
  color: #1d1d1f;
}

.wallet-text p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

/* ส่วน Badges */
.stats-badges {
  position: relative;
  margin-top: 15px;
  height: 110px;
}

.test-quiz-card {
  background: white;
  border-radius: 10px;
  padding: 15px 12px;
  width: 190px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
}

.test-quiz-card p {
  margin: 0;
  font-weight: bold;
  font-size: 0.9rem;
}
.test-quiz-card span {
  font-size: 0.75rem;
  color: #1d1d1f;
}
.quiz-arrow {
  position: absolute;

  right: 10px;

  top: 50%;
  transform: translateY(-50%);

  font-size: 1.2rem;
  color: #1d1d1f;
}
.test-quiz-card {
  cursor: pointer;
  color: #1d1d1f;
}
.test-quiz-card:active {
  transform: scale(0.98);
}
.days-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #1d1d1f;
  color: white;
  padding: 8px 15px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 13px;
}

.items-badge {
  position: absolute;
  bottom: 10px;
  right: 0;
  background: white;
  color: #333;
  padding: 8px 15px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  font-weight: bold;
  font-size: 13px;
}

/* เนื้อหาหลักด้านล่าง */
.main-content {
  padding: 0 20px;
  background-color: white;
  z-index: 5; /* อยู่หน้า header */
  
}
.section-title {
  font-weight: bold;
  margin: 0px 0;
  color: #1d1d1f;
  padding-top: 15px;
}

.recent-card {
  background: rgb(255, 255, 255);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 15px;
  color: #1d1d1f;
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
}
.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #76d6ff;
  border-radius: 50%;
  margin-right: 5px;
}
.view-all {
  color: #ccc;
  font-weight: normal;
  font-size: 0.8rem;
}
.transaction-detail .row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  color: #333;
  font-size: 0.9rem;
}

.amount-negative {
  color: #ff5e5e;
  font-weight: bold;
}
.amount-plus {
  color: #22c55e;
  font-weight: 600;
}

.summary-card {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 10px;
  color: #333;
}
.summary-img {
  width: 32px; /* ปรับขนาดรูปภาพ .png ตามต้องการ */
  height: 32px;
  object-fit: contain;
}
.income {
  background-color: #eef9f1;
}
.debt {
  background-color: #fff1f1;
}
.summary-text {
  flex-grow: 1;
  margin-left: 10px;
  font-weight: bold;
  color: #333;
}
.summary-amount {
  font-weight: bold;
}
.summary-amount span {
  font-size: 0.7rem;
  color: #999;
}
.summary-text-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 12px;
}

.main-label {
  font-weight: bold;
  font-size: 1rem;
  color: #333;
  margin-bottom: 10px; /* ระยะห่างจากบรรทัดล่าง */
  
}

.sub-detail {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.mini-flag {
  width: 16px;
  height: auto;
  object-fit: contain;
}
.add-btn {
  --background: #76d6ff;
  --border-radius: 10px;
  font-weight: bold;
  --box-shadow: none;
}
ion-toolbar {
  --background: linear-gradient(135deg, #6dd5ed, #c7eafd);
}

ion-title {
  font-size: 18px;
  font-weight: bold;
}

ion-card {
  margin: 16px;
  color: #333;
}

.day-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 10px;
}

.summary {
  margin: 10px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.items {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px 0;
}

.item-card {
  min-width: 120px;
  margin: 0;
  text-align: center;
}

.item-card ion-card-content {
  padding: 12px;
}

.icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.name {
  font-weight: 500;
  margin-bottom: 4px;
}

.amount {
  font-weight: bold;
  margin-bottom: 4px;
}
.item-card {
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-top: 10px;

  border: 1px solid #e5e7eb;
  border-radius: 12px;

  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.amount.plus {
  color: #34c759;
}

.amount.minus {
  color: #d63939;
}

.time {
  font-size: 12px;
  color: #888;
}
/* 1. ปรับส่วนคอนเทนต์หลักให้ขยับขึ้นไปทับ Header */
.main-content {
  padding: 0 20px;
  background-color: transparent; /* เปลี่ยนเป็นโปร่งใสเพื่อให้เห็นความลอย */
  position: relative;
  z-index: 100; /* ตั้งค่าให้สูงมากๆ เพื่อให้อยู่หน้าสุด */
  margin-top: -50px;
}

/* 2. ปรับหัวข้อ "รายละเอียด" ให้เด่นขึ้น */
.section-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #1d1d1f;
  padding-top: 0; /* เอา padding ออกเพื่อให้ชิดด้านบน */
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5); /* เพิ่มเงาจางๆ ให้ตัวหนังสืออ่านง่ายบนพื้นสีฟ้า */
}

/* 3. การ์ดรายการล่าสุด */
.recent-card {
  background: white;
  border-radius: 15px;
  padding: 15px;
  /* เพิ่มเงาเข้มขึ้นเพื่อให้ดู "ลอย" ออกมาข้างหน้าสุด */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  margin-bottom: 15px;
  color: #1d1d1f;
  position: relative;
}

/* 4. ปรับ Header เพื่อเพิ่มพื้นที่ด้านล่าง (เผื่อไว้) */
.header-container {
  padding-bottom: 40px; /* เพิ่มพื้นที่ข้างล่างเพื่อให้พื้นหลังสีฟ้าคลุมลงมาถึง */
  z-index: 1;
}
/* สร้างกลุ่มสำหรับ Badge ฝั่งขวา */
.right-badges-group {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.days-badge,
.items-badge {
  position: static;
  padding: 8px 15px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.85rem;
  white-space: nowrap;
}
</style>
