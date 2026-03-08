<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/habits" color="dark" text=""></ion-back-button>
        </ion-buttons>
        <ion-title class="page-title">สรุปยอดเงิน</ion-title>
        <ion-buttons slot="end">
          <ion-button color="dark" @click="openMoreMenu">
            <ion-icon :icon="ellipsisHorizontal"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding content-bg">
      <div class="filter-wrapper">
        <ion-button fill="outline" shape="round" color="medium" class="filter-btn" @click="openPeriodSelector">
          {{ timeFilter === 0 ? 'ข้อมูลทั้งหมด' : `${timeFilter} เดือนย้อนหลัง` }} 
          <ion-icon slot="end" :icon="chevronDown"></ion-icon>
        </ion-button>
      </div>

      <ion-card class="chart-card">
        <ion-card-content>
            <div class="chart-header">
                <h3>รายรับ vs จ่าย vs หนี้</h3>
                <ion-badge color="light" class="custom-badge">{{ chartData.labels.length }} รายการล่าสุด</ion-badge>
            </div>
            
            <div class="chart-container">
                <Bar v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
                <div v-else class="text-center text-muted" style="margin-top: 80px;">
                  ไม่มีข้อมูลในตารางเวลานี้
                </div>
            </div>
        </ion-card-content>
      </ion-card>

      <div class="table-section">
        <div class="table-title-row">
             <h3>ตารางรายละเอียด</h3>
             <ion-button fill="clear" color="medium" size="small" @click="openTableFilter">
               <ion-icon :icon="filter"></ion-icon>
             </ion-button>
        </div>
        <p class="text-muted sub-header">
          สรุปรายการเดินบัญชี 
          <span v-if="tableFilter === 'profit'" style="color:#4ecdc4">(เฉพาะที่เงินเหลือ)</span>
          <span v-else-if="tableFilter === 'loss'" style="color:#ff7675">(เฉพาะที่ติดลบ)</span>
        </p>

        <div class="sort-buttons-container">
          <ion-chip class="view-chip" @click="openGroupSelector">
            <ion-icon :icon="calendarOutline" style="margin-right: 5px;"></ion-icon>
            {{ groupBy === 'day' ? 'รายวัน' : groupBy === 'week' ? 'รายสัปดาห์' : 'รายเดือน' }}
            <ion-icon :icon="chevronDown" style="margin-left: 5px;"></ion-icon>
          </ion-chip>

          <div class="divider-vertical"></div>

          <div class="sort-buttons">
              <ion-chip :class="sortBy === 'date' ? 'active-chip' : ''" :outline="sortBy !== 'date'" @click="sortBy = 'date'">
                ล่าสุด
              </ion-chip>
              <ion-chip :class="sortBy === 'income' ? 'active-chip' : ''" :outline="sortBy !== 'income'" @click="sortBy = 'income'">
                รายรับสูงสุด
              </ion-chip>
              <ion-chip :class="sortBy === 'expense' ? 'active-chip' : ''" :outline="sortBy !== 'expense'" @click="sortBy = 'expense'">
                รายจ่ายสูงสุด
              </ion-chip>
              <ion-chip :class="sortBy === 'debt' ? 'active-chip-debt' : ''" :outline="sortBy !== 'debt'" @click="sortBy = 'debt'">
                หนี้สินสูงสุด
              </ion-chip>
          </div>
        </div>

        <ion-grid class="table-header">
            <ion-row>
                <ion-col size="3">{{ groupBy === 'day' ? 'วันที่' : groupBy === 'week' ? 'สัปดาห์' : 'เดือน' }}</ion-col>
                <ion-col size="2" class="text-right">รับ</ion-col>
                <ion-col size="2" class="text-right">จ่าย</ion-col>
                <ion-col size="2" class="text-right">หนี้</ion-col>
                <ion-col size="3" class="text-right">เหลือ</ion-col>
            </ion-row>
        </ion-grid>

        <div class="table-body">
            <div class="table-row" v-for="(item, index) in displayData" :key="index">
                <ion-grid>
                    <ion-row class="ion-align-items-center">
                        <ion-col size="3">
                            <div class="month-name">{{ item.periodLabel }}</div>
                            <div class="items-count">{{ item.items }} รายการ</div>
                        </ion-col>
                        <ion-col size="2" class="text-right text-income">
                            {{ item.income }}
                        </ion-col>
                        <ion-col size="2" class="text-right text-expense">
                            {{ item.expense }}
                        </ion-col>
                        <ion-col size="2" class="text-right text-debt">
                            {{ item.debt }}
                        </ion-col>
                        <ion-col size="3" class="text-right text-balance" :style="item.rawBalance < 0 ? 'color: #ff7675;' : ''">
                            {{ item.balance }}
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </div>
            <div v-if="displayData.length === 0" class="text-center text-muted" style="padding: 20px;">
                ไม่มีรายการตามเงื่อนไขที่กรอง
            </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonBackButton, IonButton, IonIcon, 
  IonCard, IonCardContent, IonBadge, IonChip, 
  IonGrid, IonRow, IonCol, actionSheetController, alertController
} from '@ionic/vue';
import { ellipsisHorizontal, chevronDown, filter, calendarOutline } from 'ionicons/icons';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'
import { ref, computed, onMounted } from 'vue';
import { useFinanceStore } from '../store/financeStore';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const financeStore = useFinanceStore();

// สถานะการตั้งค่า
const sortBy = ref('date'); // date, income, expense, debt
const groupBy = ref('month'); // day, week, month 
const timeFilter = ref(24); 
const tableFilter = ref('all'); 

onMounted(async () => {
  if (financeStore.transactions.length === 0) {
    await financeStore.fetchTransactions();
  }
});

// เพิ่ม debt เข้าไปใน interface
interface PeriodSummary {
  periodLabel: string;
  items: number;
  income: number;
  expense: number;
  debt: number;
  rawDate: Date;
}

const getWeekString = (d: Date) => {
  const weekNum = Math.ceil(d.getDate() / 7);
  const cappedWeek = weekNum > 4 ? 4 : weekNum; 
  const monthStr = d.toLocaleDateString('th-TH', { month: 'short', year: '2-digit' });
  return `W${cappedWeek} (${monthStr})`;
};

const groupedData = computed<PeriodSummary[]>(() => {
  let txs = financeStore.transactions;

  if (timeFilter.value > 0) {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - timeFilter.value);
    
    txs = txs.filter((t: any) => {
      let d = new Date();
      if (t.date && typeof t.date === 'string') d = new Date(t.date);
      else if (t.date && t.date.toDate) d = t.date.toDate();
      return d >= cutoffDate;
    });
  }

  const groups: Record<string, PeriodSummary> = {};

  txs.forEach((t: any) => {
    let d = new Date();
    if (t.date && typeof t.date === 'string') d = new Date(t.date);
    else if (t.date && t.date.toDate) d = t.date.toDate();

    let key = '';
    if (groupBy.value === 'day') {
      key = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    } else if (groupBy.value === 'week') {
      key = getWeekString(d);
    } else {
      key = d.toLocaleDateString('th-TH', { month: 'short', year: '2-digit' });
    }

    if (!groups[key]) {
      groups[key] = { 
        periodLabel: key, 
        items: 0, 
        income: 0, 
        expense: 0, 
        debt: 0, // ค่าเริ่มต้นหนี้
        rawDate: d 
      };
    }

    groups[key].items += 1;
    if (t.type === 'income') groups[key].income += Number(t.amount);
    if (t.type === 'expense') groups[key].expense += Number(t.amount);
    if (t.type === 'debt') groups[key].debt += Number(t.amount); // เก็บค่าหนี้
  });

  return Object.values(groups);
});

const displayData = computed(() => {
  let sorted = [...groupedData.value];
  
  // กรองตามกำไรขาดทุน โดยคิดหนี้รวมเข้าไปด้วย
  if (tableFilter.value === 'profit') {
    sorted = sorted.filter(item => (item.income - item.expense - item.debt) >= 0);
  } else if (tableFilter.value === 'loss') {
    sorted = sorted.filter(item => (item.income - item.expense - item.debt) < 0);
  }

  if (sortBy.value === 'date') {
    sorted.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
  } else if (sortBy.value === 'income') {
    sorted.sort((a, b) => b.income - a.income);
  } else if (sortBy.value === 'expense') {
    sorted.sort((a, b) => b.expense - a.expense);
  } else if (sortBy.value === 'debt') {
    sorted.sort((a, b) => b.debt - a.debt); // เรียงตามหนี้
  }

  return sorted.map(item => {
    // ยอดคงเหลือ = รับ - จ่าย - หนี้
    const balance = item.income - item.expense - item.debt;
    return {
      periodLabel: item.periodLabel,
      items: item.items,
      income: item.income.toLocaleString(),
      expense: item.expense.toLocaleString(),
      debt: item.debt.toLocaleString(), // เอาไปโชว์
      balance: balance.toLocaleString(),
      rawBalance: balance 
    };
  });
});

const chartData = computed(() => {
  const sortedForChart = [...groupedData.value].sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
  const slicedForChart = sortedForChart.slice(-12);

  return {
    labels: slicedForChart.map(d => d.periodLabel),
    datasets: [
      {
        label: 'รายรับ',
        backgroundColor: '#4ecdc4',
        data: slicedForChart.map(d => d.income),
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
      {
        label: 'รายจ่าย',
        backgroundColor: '#ff7675',
        data: slicedForChart.map(d => d.expense),
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
      // เพิ่มแท่งกราฟหนี้สิน
      {
        label: 'หนี้สิน',
        backgroundColor: '#f39c12',
        data: slicedForChart.map(d => d.debt),
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { 
      y: { display: false, grid: { display: false } }, 
      x: { grid: { display: false }, ticks: { font: { family: 'Kanit' } } }
  }
}

// ==========================================
// Action Sheets
// ==========================================

const openGroupSelector = async () => {
  const actionSheet = await actionSheetController.create({
    header: 'เลือกมุมมองการแสดงผล',
    buttons: [
      { text: 'รายวัน', handler: () => { groupBy.value = 'day'; } },
      { text: 'รายสัปดาห์', handler: () => { groupBy.value = 'week'; } },
      { text: 'รายเดือน', handler: () => { groupBy.value = 'month'; } },
      { text: 'ยกเลิก', role: 'cancel' }
    ]
  });
  await actionSheet.present();
};

const openPeriodSelector = async () => {
  const actionSheet = await actionSheetController.create({
    header: 'กรองช่วงเวลาข้อมูล',
    buttons: [
      { text: '3 เดือนย้อนหลัง', handler: () => { timeFilter.value = 3; } },
      { text: '6 เดือนย้อนหลัง', handler: () => { timeFilter.value = 6; } },
      { text: '12 เดือนย้อนหลัง', handler: () => { timeFilter.value = 12; } },
      { text: '24 เดือนย้อนหลัง', handler: () => { timeFilter.value = 24; } },
      { text: 'ข้อมูลทั้งหมด', handler: () => { timeFilter.value = 0; } },
      { text: 'ยกเลิก', role: 'cancel' }
    ]
  });
  await actionSheet.present();
};

const openTableFilter = async () => {
  const actionSheet = await actionSheetController.create({
    header: 'ตัวกรองตาราง',
    buttons: [
      { text: 'แสดงทั้งหมด', handler: () => { tableFilter.value = 'all'; } },
      { text: 'เฉพาะรายการที่เงินเหลือ', handler: () => { tableFilter.value = 'profit'; } },
      { text: 'เฉพาะรายการที่ติดลบ', handler: () => { tableFilter.value = 'loss'; } },
      { text: 'ยกเลิก', role: 'cancel' }
    ]
  });
  await actionSheet.present();
};

const openMoreMenu = async () => {
  const actionSheet = await actionSheetController.create({
    header: 'จัดการข้อมูล',
    buttons: [
      { 
        text: 'ส่งออกรายงาน (CSV)', 
        handler: async () => {
          const alert = await alertController.create({
            header: 'ดาวน์โหลดสำเร็จ!',
            message: 'จำลองการบันทึกไฟล์รายงาน Finance_Report.csv ลงเครื่องเรียบร้อยแล้ว',
            buttons: ['ตกลง']
          });
          await alert.present();
        } 
      },
      { text: 'ตั้งค่าการแสดงผล', handler: () => { console.log('ไปหน้าตั้งค่า'); } },
      { text: 'ยกเลิก', role: 'cancel' }
    ]
  });
  await actionSheet.present();
};
</script>

<style scoped>
.content-bg { --background: #f8f9fa; }

/* Header Styling */
.page-title { font-weight: bold; color: #2d3436; font-size: 1.1rem; }

/* Filter Styling */
.filter-wrapper { display: flex; justify-content: center; margin-bottom: 20px; }
.filter-btn { --border-radius: 20px; font-weight: normal; font-size: 0.9rem; height: 35px; }

/* Card Styling */
.chart-card { 
    border-radius: 20px; margin: 0 5px 20px 5px; 
    box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: none;
}
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.chart-header h3 { margin: 0; font-weight: bold; font-size: 1rem; color: #2d3436; }
.custom-badge { --background: #dfe6e9; --color: #636e72; font-weight: normal; padding: 6px 10px; border-radius: 8px; }
.chart-container { height: 220px; }

/* Table Section Styling */
.table-section { 
    background: white; border-radius: 25px 25px 0 0; 
    padding: 25px 20px; min-height: 100%; 
    box-shadow: 0 -5px 20px rgba(0,0,0,0.03); margin: 0 -16px -16px -16px; 
}
.table-title-row { display: flex; justify-content: space-between; align-items: center; }
.table-title-row h3 { margin: 0; font-weight: 800; font-size: 1.2rem; color: #2d3436; }
.sub-header { margin-top: 2px; margin-bottom: 15px; font-size: 0.85rem; }

/* โครงสร้างปุ่ม Sort ใหม่ */
.sort-buttons-container {
  display: flex; align-items: center; margin-bottom: 20px; overflow-x: auto;
  padding-bottom: 5px;
}
.sort-buttons { display: flex; gap: 8px; }
.view-chip { 
  --background: #dfe6e9; --color: #2d3436; 
  font-weight: bold; margin-right: 0; flex-shrink: 0;
}
.divider-vertical {
  width: 1px; height: 25px; background: #e0e0e0; margin: 0 10px; flex-shrink: 0;
}
.active-chip { 
  --background: #4ecdc4; --color: white; 
  font-weight: bold; border-color: #4ecdc4;
}
.active-chip-debt {
  --background: #f39c12; --color: white; 
  font-weight: bold; border-color: #f39c12;
}

/* Table Rows */
.table-header { font-size: 0.75rem; color: #b2bec3; font-weight: bold; margin-bottom: 15px; letter-spacing: 0.5px; }
.text-right { text-align: right; }
.text-center { text-align: center; }

.table-row { border-bottom: 1px solid #f1f2f6; padding: 12px 0; }
.month-name { font-weight: bold; color: #2d3436; font-size: 0.85rem; line-height: 1.2;}
.items-count { font-size: 0.7rem; color: #b2bec3; margin-top: 4px; }

/* Color Palette ย่อขนาดฟอนต์นิดนึงจะได้ไม่เบียดกันมาก */
.text-income { color: #4ecdc4; font-weight: 600; font-size: 0.85rem; }
.text-expense { color: #ff7675; font-weight: 600; font-size: 0.85rem; }
.text-debt { color: #f39c12; font-weight: 600; font-size: 0.85rem; }
.text-balance { color: #2d3436; font-weight: bold; font-size: 0.85rem; }
</style>