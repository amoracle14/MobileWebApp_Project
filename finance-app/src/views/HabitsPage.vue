<template>
  <ion-page>
    <ion-content :fullscreen="true" class="content-bg">
      
      <div class="header-container">
        <div class="bg-decoration-circle"></div> 
        <div class="content-wrapper">
            <div class="user-info">
              <div class="profile-section">
                <ion-avatar class="avatar">
                  <img src="/gojo.jpg" alt="Profile" />
                </ion-avatar>
                <div class="wallet-balance">
                  <h2>฿ {{ totalWalletBalance.toLocaleString() }}</h2>
                  <p>ยอดเงินคงเหลือสุทธิ</p>
                </div>
              </div>
              <ion-button shape="round" color="light" fill="solid" size="small" class="period-btn" @click="openPeriodSelector">
                {{ periodFilter }} <ion-icon :icon="chevronDown" slot="end"></ion-icon>
              </ion-button>
            </div>
        </div>
      </div>

      <div class="main-content-container">
        
        <div class="overview-section">
            <div class="section-title-row">
                <h3>ภาพรวมทางการเงิน</h3>
                <span class="text-muted">กระแสเงินสด</span>
            </div>
            <ion-card class="summary-card">
            <ion-card-content>
                <ion-grid>
                <ion-row class="ion-align-items-center">
                    <ion-col size="6" class="chart-col">
                    <div class="donut-wrapper">
                        <Doughnut :key="'donut-' + periodFilter" :data="doughnutData" :options="doughnutOptions" />
                        <div class="chart-center-text">
                        <div class="label">ใช้ไป</div>
                        <div class="value">{{ expensePercent }}%</div>
                        </div>
                    </div>
                    </ion-col>
                    <ion-col size="6">
                    <div class="stats-text">
                        <div class="stat-item">
                        <span class="dot income"></span> <span class="label">รายรับ</span>
                        <div class="value-text">{{ income.toLocaleString() }}</div>
                        </div>
                        <div class="stat-item">
                        <span class="dot expense"></span> <span class="label">รายจ่าย</span>
                        <div class="value-text">{{ expense.toLocaleString() }}</div>
                        </div>
                        <div class="stat-item">
                        <span class="dot debt"></span> <span class="label">หนี้สิน</span>
                        <div class="value-text" style="color: #e67e22;">{{ debt.toLocaleString() }}</div>
                        </div>
                    </div>
                    </ion-col>
                </ion-row>
                </ion-grid>
            </ion-card-content>
            </ion-card>
        </div>

        <ion-grid class="ion-no-padding ion-margin-bottom">
            <ion-row>
            <ion-col size="6">
                <ion-card class="mini-stat-card income-bg">
                <ion-icon :icon="arrowDown" class="icon-down"></ion-icon>
                <div class="label">รายรับ</div>
                <div class="val">{{ income.toLocaleString() }}</div>
                </ion-card>
            </ion-col>
            <ion-col size="6">
                <ion-card class="mini-stat-card expense-bg">
                <ion-icon :icon="arrowUp" class="icon-up"></ion-icon>
                <div class="label">รายจ่าย</div>
                <div class="val">{{ expense.toLocaleString() }}</div>
                </ion-card>
            </ion-col>
            <ion-col size="6">
                <ion-card class="mini-stat-card debt-bg">
                <ion-icon :icon="warningOutline" class="icon-debt"></ion-icon>
                <div class="label">หนี้สิน</div>
                <div class="val">{{ debt.toLocaleString() }}</div>
                </ion-card>
            </ion-col>
            <ion-col size="6">
                <ion-card class="mini-stat-card balance-bg">
                <ion-icon :icon="wallet" class="icon-wallet"></ion-icon>
                <div class="label">คงเหลือ</div>
                <div class="val">{{ balance.toLocaleString() }}</div>
                </ion-card>
            </ion-col>
            </ion-row>
        </ion-grid>

        <div class="section-header">
            <h3>สัดส่วนค่าใช้จ่าย & หนี้สิน</h3>
            <ion-button size="small" fill="clear" @click="goToSummary" class="view-report-btn">
             รายงานฉบับเต็ม <ion-icon :icon="statsChart" slot="end"></ion-icon>
            </ion-button>
        </div>
        <ion-card class="categories-card">
            <ion-card-content>
            <div class="bar-chart-container" :style="{ minHeight: '180px', height: Math.max(180, categoryStats.length * 40) + 'px' }">
                <Bar :key="'bar-' + periodFilter" v-if="categoryStats.length > 0" :data="categoryChartData" :options="categoryChartOptions" />
                <div v-else class="text-center text-muted" style="padding-top: 50px;">
                 ไม่มีรายการใช้จ่ายในช่วงเวลานี้
                </div>
            </div>
            <p v-if="categoryStats.length > 0" class="chart-note">หมวด "{{ topExpenseCategory }}" มีสัดส่วนสูงสุด</p>
            </ion-card-content>
        </ion-card>

        <ion-card class="persona-card">
          <ion-card-content class="persona-content">
            <div class="persona-layout">
              <div class="ai-icon-box">
                <img 
                  src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" 
                  alt="Gemini Sparkle" 
                  class="gemini-icon"
                />
              </div>
              
              <div class="ai-text-content">
                <div class="ai-header">
                  <div class="ai-label">บทวิเคราะห์พฤติกรรม (AI)</div>
                  <div class="ai-tag" v-if="hasTriggeredAI && !isAILoading">{{ aiSummary.tag }}</div>
                  <div class="ai-tag-loading" v-else-if="isAILoading">
                     <ion-spinner name="dots" color="light" style="width: 20px; height: 10px;"></ion-spinner>
                  </div>
                </div>
                
                <div v-if="!hasTriggeredAI" class="trigger-ai-container">
                  <p class="ai-prompt-text">ให้ AI สรุปสถานะการเงินช่วงเวลานี้แบบด่วนๆ มั้ย?</p>
                  <ion-button size="small" shape="round" class="trigger-ai-btn" @click="generateDashboardAI">
                    <ion-icon :icon="sparkles" slot="start"></ion-icon>
                    วิเคราะห์
                  </ion-button>
                </div>

                <div v-else>
                  <p class="ai-message">
                    <span v-if="isAILoading" style="color: #b2bec3;">"กำลังสรุปข้อมูลกระแสเงินสดของคุณ..."</span>
                    <span v-else>"{{ aiSummary.message }}"</span>
                  </p>
                </div>

                <div class="see-more" @click="goToAIAnalysis">
                  อ่านบทวิเคราะห์ละเอียด <ion-icon :icon="arrowForward" size="small"></ion-icon>
                </div>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, IonContent, 
  IonCard, IonCardContent, IonAvatar, IonButton, 
  IonIcon, IonGrid, IonRow, IonCol, IonSpinner, actionSheetController
} from '@ionic/vue';
import { 
  chevronDown, arrowDown, arrowUp, wallet, 
  arrowForward, statsChart, warningOutline, sparkles 
} from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { 
  Chart as ChartJS, ArcElement, Tooltip, Legend, 
  BarElement, CategoryScale, LinearScale 
} from 'chart.js';
import { Doughnut, Bar } from 'vue-chartjs';

import { onMounted, computed, ref, watch } from 'vue';
import { useFinanceStore } from '../store/financeStore'; 

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const router = useRouter();
const financeStore = useFinanceStore();

const periodFilter = ref('เดือนนี้'); 

// 🔥 เพิ่มตัวแปรเช็คว่ากดปุ่มวิเคราะห์หรือยัง
const hasTriggeredAI = ref(false);
const isAILoading = ref(false);
const aiSummary = ref({
  tag: '-',
  message: '-'
});

onMounted(async () => {
  if (financeStore.transactions.length === 0) {
    await financeStore.fetchTransactions();
  }
});

watch(periodFilter, () => {
  // 🔥 ถ้ายูสเซอร์เปลี่ยนเดือน ให้ซ่อนผลลัพธ์เก่าแล้วโชว์ปุ่มใหม่
  hasTriggeredAI.value = false;
});

const totalWalletBalance = computed(() => {
  const allTxs = financeStore.transactions;
  const tIncome = allTxs.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + Number(t.amount), 0);
  const tExpense = allTxs.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + Number(t.amount), 0);
  const tDebt = allTxs.filter((t: any) => t.type === 'debt').reduce((sum: number, t: any) => sum + Number(t.amount), 0);
  return tIncome - tExpense - tDebt;
});

const filteredTransactions = computed(() => {
  const txs = financeStore.transactions;
  if (periodFilter.value === 'ทั้งหมด') return txs;

  const now = new Date();
  
  return txs.filter((t: any) => {
    let d = new Date();
    if (t.date && typeof t.date === 'string') d = new Date(t.date);
    else if (t.date && t.date.toDate) d = t.date.toDate();

    if (periodFilter.value === 'วันนี้') {
      return d.toDateString() === now.toDateString();
    } else if (periodFilter.value === 'สัปดาห์นี้') {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      return d >= startOfWeek;
    } else if (periodFilter.value === 'เดือนนี้') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    } else if (periodFilter.value === 'ปีนี้') {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  });
});

const income = computed(() => {
  return filteredTransactions.value
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
});

const expense = computed(() => {
  return filteredTransactions.value
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
});

const debt = computed(() => {
  return filteredTransactions.value
    .filter((t: any) => t.type === 'debt')
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
});

const balance = computed(() => income.value - expense.value - debt.value);

const expensePercent = computed(() => {
  if (income.value === 0) return 0; 
  const percent = ((expense.value + debt.value) / income.value) * 100;
  return percent > 100 ? 100 : Math.round(percent); 
});

const doughnutData = computed(() => {
  const displayBalance = balance.value > 0 ? balance.value : 0;
  return {
    labels: ['รายจ่าย', 'หนี้สิน', 'คงเหลือ'],
    datasets: [{ 
      backgroundColor: ['#ff7675', '#f39c12', '#eeeeee'], 
      data: [expense.value, debt.value, displayBalance], 
      borderWidth: 0, 
      cutout: '75%' 
    }]
  };
});

const doughnutOptions = { 
  responsive: true, 
  maintainAspectRatio: false, 
  plugins: { legend: { display: false }, tooltip: { enabled: false } } 
};

const categoryMap: Record<string, string> = {
  'food': 'ค่าอาหาร',
  'travel': 'ค่าเดินทาง',
  'personal': 'ของใช้ส่วนตัว',
  'shopping': 'ช้อปปิ้ง',
  'salary': 'ค่าจ้าง / งานพิเศษ',
  'credit': 'หนี้บัตรเครดิต',
  'credit_card_debt': 'หนี้บัตรเครดิต',
  'parttime': 'รับจ๊อบพิเศษ'
};

const categoryStats = computed(() => {
  const outflows = filteredTransactions.value.filter((t: any) => t.type === 'expense' || t.type === 'debt');
  const grouped = outflows.reduce((acc: Record<string, number>, curr: any) => {
    const rawCat = String(curr.category || 'ไม่ระบุหมวดหมู่');
    const catKey = rawCat.toLowerCase().trim();
    const displayCat = categoryMap[catKey] || rawCat;

    acc[displayCat] = (acc[displayCat] || 0) + Number(curr.amount);
    return acc;
  }, {});

  return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
});

const topExpenseCategory = computed(() => {
  return categoryStats.value.length > 0 ? categoryStats.value[0][0] : 'ไม่มีข้อมูล';
});

const categoryChartData = computed(() => {
  const labels = categoryStats.value.map(item => item[0]);
  const data = categoryStats.value.map(item => item[1]);
  
  const colors = ['#ff7675', '#f39c12', '#74b9ff', '#55efc4', '#a29bfe', '#fdcb6e', '#ff9ff3', '#feca57', '#48dbfb', '#1dd1a1'];
  const bgColors = labels.map((_, index) => colors[index % colors.length]);

  return {
    labels: labels,
    datasets: [{
        label: 'ยอดเงิน (บาท)',
        backgroundColor: bgColors,
        data: data,
        borderRadius: 5
    }]
  };
});

const categoryChartOptions = {
  responsive: true, 
  maintainAspectRatio: false, 
  indexAxis: 'y' as const,
  plugins: { legend: { display: false } },
  scales: { x: { display: false }, y: { grid: { display: false }, ticks: { font: { family: 'Kanit, sans-serif' } } } }
};

const openPeriodSelector = async () => {
  const actionSheet = await actionSheetController.create({
    header: 'เลือกช่วงเวลาข้อมูล',
    buttons: [
      { text: 'วันนี้', handler: () => { periodFilter.value = 'วันนี้'; } },
      { text: 'สัปดาห์นี้', handler: () => { periodFilter.value = 'สัปดาห์นี้'; } },
      { text: 'เดือนนี้', handler: () => { periodFilter.value = 'เดือนนี้'; } },
      { text: 'ปีนี้', handler: () => { periodFilter.value = 'ปีนี้'; } },
      { text: 'ทั้งหมด', handler: () => { periodFilter.value = 'ทั้งหมด'; } },
      { text: 'ยกเลิก', role: 'cancel' }
    ]
  });
  await actionSheet.present();
};

const generateDashboardAI = async () => {
  hasTriggeredAI.value = true;
  isAILoading.value = true;
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('ไม่พบ API Key');

    const promptText = `
คุณคือที่ปรึกษาทางการเงิน ช่วยสรุปภาพรวมทางการเงินช่วง "${periodFilter.value}" นี้แบบสั้นมากๆ เพียง 1 ประโยค:
รายรับ: ${income.value}, รายจ่าย: ${expense.value}, หนี้สิน: ${debt.value}, คงเหลือ: ${balance.value}

ตอบเป็น JSON เท่านั้น โครงสร้าง:
{
  "tag": "สถานะ 1-2 คำ (เช่น การเงินมั่นคง, ระวังหนี้สิน)",
  "message": "ประโยคสรุปความยาวไม่เกิน 1 บรรทัด"
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });

    if (!response.ok) throw new Error('API Error');

    const data = await response.json();
    let aiText = data.candidates[0].content.parts[0].text;
    aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

    aiSummary.value = JSON.parse(aiText);
  } catch (error) {
    console.error("Dashboard AI Error:", error);
    aiSummary.value = {
      tag: 'เกิดข้อผิดพลาด',
      message: 'เชื่อมต่อ AI ไม่สำเร็จ ลองใหม่อีกครั้ง'
    };
  } finally {
    isAILoading.value = false;
  }
};

const goToAIAnalysis = () => {
  router.push('/tabs/ai-analysis'); 
};

const goToSummary = () => {
  router.push('/tabs/summary-analyst'); 
};
</script>

<style scoped>
.content-bg { --background: #f8f9fa; }

/* Header Styling */
.header-container {
  background: linear-gradient(90deg, #74d7e9 0%, #bff0f3 60%, #b2cff4 100%);
  padding: 50px 20px 60px 20px;
  position: relative; 
  overflow: hidden; 
  border-radius: 0 0 25px 25px;
}
.bg-decoration-circle {
    position: absolute; top: -50px; right: -50px; width: 200px; height: 200px;
    background: rgba(255, 255, 255, 0.2); border-radius: 50%; pointer-events: none;
}
.content-wrapper { position: relative; z-index: 10; }
.user-info { display: flex; justify-content: space-between; align-items: flex-start; }
.profile-section { display: flex; align-items: center; }
.avatar { width: 50px; height: 50px; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.wallet-balance { margin-left: 12px; color: #333; }
.wallet-balance h2 { margin: 0; font-weight: 800; font-size: 1.4rem; color: #2d3436; }
.wallet-balance p { margin: 0; font-size: 0.85rem; color: #555; }
.period-btn { --color: #555; font-weight: normal; font-size: 0.8rem; height: 32px; }

/* Main Content */
.main-content-container {
    padding: 0 20px; margin-top: -40px; position: relative; z-index: 20;
}

/* Overview */
.overview-section { margin-bottom: 20px; }
.section-title-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 10px; padding: 0 5px; }
.section-title-row h3 { margin: 0; font-size: 1.1rem; font-weight: bold; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
.section-title-row .text-muted { color: rgba(255,255,255,0.9); font-size: 0.8rem; }
.summary-card { border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); background: white; margin: 0; }

/* Charts */
.donut-wrapper { position: relative; height: 120px; width: 120px; margin: 0 auto; }
.chart-center-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
.chart-center-text .label { font-size: 0.6rem; color: #888; }
.chart-center-text .value { font-size: 1.2rem; font-weight: bold; color: #333; }
.stats-text .stat-item { margin-bottom: 8px; }
.dot { height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; }
.dot.income { background-color: #4ecdc4; }
.dot.expense { background-color: #ff7675; }
.dot.debt { background-color: #f39c12; }
.value-text { font-weight: bold; font-size: 1.05rem; margin-left: 15px; color: #2d3436; }

/* Mini Stats (2x2 Grid) */
.mini-stat-card { text-align: center; padding: 12px; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin: 5px; border: none; }
.income-bg { background: #e0f7fa; color: #006064; }
.expense-bg { background: #ffebee; color: #b71c1c; }
.debt-bg { background: #fff3e0; color: #d35400; }
.balance-bg { background: #f3e5f5; color: #4a148c; }
.mini-stat-card .label { font-size: 0.75rem; opacity: 0.8; margin-bottom: 4px; }
.mini-stat-card .val { font-weight: bold; font-size: 0.95rem; }

/* Categories */
.section-header { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 10px; }
.section-header h3 { font-size: 1.1rem; font-weight: bold; color: #2d3436; margin: 0; }
.view-report-btn { font-size: 0.85rem; --color: #74d7e9; }
.categories-card { border-radius: 20px; margin: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.bar-chart-container { width: 100%; transition: height 0.3s ease; }
.chart-note { text-align: center; font-size: 0.8rem; color: #636e72; margin-top: 15px; }

/* AI Card */
.persona-card {
  background: #ffffff; 
  border-radius: 24px; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: none; 
  margin-top: 25px; 
  margin-inline: 0;
  overflow: visible; 
}
.persona-content { padding: 20px; }
.persona-layout { display: flex; gap: 15px; align-items: flex-start; }
.ai-icon-box {
  min-width: 45px; height: 45px; background: transparent; 
  display: flex; align-items: center; justify-content: center;
}
.gemini-icon { width: 35px; height: 35px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
.ai-text-content { flex: 1; }
.ai-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.ai-label { font-size: 0.75rem; font-weight: 800; color: #b2bec3; text-transform: uppercase; letter-spacing: 0.5px; }

.ai-tag { background: #ffeaa7; color: #d35400; font-size: 0.7rem; font-weight: bold; padding: 2px 8px; border-radius: 8px; }
.ai-tag-loading { background: #b2bec3; padding: 2px 8px; border-radius: 8px; display: flex; align-items: center;}

.trigger-ai-container { text-align: center; margin: 10px 0; }
.ai-prompt-text { font-size: 0.85rem; color: #636e72; margin-bottom: 10px; }
.trigger-ai-btn { --background: linear-gradient(90deg, #74d7e9 0%, #b2cff4 100%); --color: #2d3436; font-weight: bold; font-size: 0.85rem; }

.ai-message { font-size: 0.9rem; color: #2d3436; line-height: 1.5; margin: 0 0 12px 0; font-weight: 500; }
.see-more { color: #0984e3; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 5px; cursor: pointer; opacity: 0.9; margin-top: 10px;}
</style>