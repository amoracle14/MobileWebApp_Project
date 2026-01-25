<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" color="dark" text=""></ion-back-button>
        </ion-buttons>
        <ion-title class="page-title">สรุปยอดรายเดือน</ion-title>
        <ion-buttons slot="end">
          <ion-button color="dark"><ion-icon :icon="ellipsisHorizontal"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding content-bg">
      <div class="filter-wrapper">
        <ion-button fill="outline" shape="round" color="medium" class="filter-btn">
          24 เดือนย้อนหลัง <ion-icon slot="end" :icon="chevronDown"></ion-icon>
        </ion-button>
      </div>

      <ion-card class="chart-card">
        <ion-card-content>
            <div class="chart-header">
                <h3>รายรับ vs รายจ่าย</h3>
                <ion-badge color="light" class="custom-badge">ม.ค. - ส.ค.</ion-badge>
            </div>
            
            <div class="chart-container">
                <Bar :data="chartData" :options="chartOptions" />
            </div>
        </ion-card-content>
      </ion-card>

      <div class="table-section">
        <div class="table-title-row">
             <h3>ตารางรายละเอียด</h3>
             <ion-button fill="clear" color="medium" size="small"><ion-icon :icon="filter"></ion-icon></ion-button>
        </div>
        <p class="text-muted sub-header">สรุปรายการเดินบัญชี</p>

        <div class="sort-buttons">
            <ion-chip class="active-chip">เรียง: วันที่</ion-chip>
            <ion-chip outline color="medium">รายรับ</ion-chip>
            <ion-chip outline color="medium">รายจ่าย</ion-chip>
        </div>

        <ion-grid class="table-header">
            <ion-row>
                <ion-col size="3">เดือน</ion-col>
                <ion-col size="3" class="text-right">รายรับ</ion-col>
                <ion-col size="3" class="text-right">รายจ่าย</ion-col>
                <ion-col size="3" class="text-right">คงเหลือ</ion-col>
            </ion-row>
        </ion-grid>

        <div class="table-body">
            <div class="table-row" v-for="(item, index) in monthlyData" :key="index">
                <ion-grid>
                    <ion-row class="ion-align-items-center">
                        <ion-col size="3">
                            <div class="month-name">{{ item.month }}</div>
                            <div class="items-count">{{ item.items }} รายการ</div>
                        </ion-col>
                        <ion-col size="3" class="text-right text-income">
                            {{ item.income }}
                        </ion-col>
                        <ion-col size="3" class="text-right text-expense">
                            {{ item.expense }}
                        </ion-col>
                        <ion-col size="3" class="text-right text-balance">
                            {{ item.balance }}
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon, IonCard, IonCardContent, IonBadge, IonChip, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { ellipsisHorizontal, chevronDown, filter } from 'ionicons/icons';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'
import { ref } from 'vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Mock Data: สีตรงกับ Dashboard (เขียว/แดง Pastel)
const chartData = {
  labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.'],
  datasets: [
    {
      label: 'รายรับ',
      backgroundColor: '#4ecdc4', // สีเขียว Teal (Income)
      data: [60, 50, 65, 75, 55, 65, 70, 55],
      borderRadius: 4,
      barPercentage: 0.6,
      categoryPercentage: 0.8
    },
    {
      label: 'รายจ่าย',
      backgroundColor: '#ff7675', // สีแดง Salmon (Expense)
      data: [35, 45, 40, 30, 60, 55, 40, 50],
      borderRadius: 4,
      barPercentage: 0.6,
      categoryPercentage: 0.8
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { 
      y: { display: false, grid: { display: false } }, 
      x: { grid: { display: false }, ticks: { font: { family: 'Kanit' } } } // เพิ่มฟอนต์
  }
}

const monthlyData = ref([
    { month: 'ม.ค. 69', items: 408, income: '62,506', expense: '63,701', balance: '-1,195' },
    { month: 'ก.พ. 69', items: 375, income: '52,233', expense: '51,493', balance: '740' },
    { month: 'มี.ค. 69', items: 474, income: '69,890', expense: '61,041', balance: '8,849' },
    { month: 'เม.ย. 69', items: 359, income: '45,000', expense: '42,000', balance: '3,000' },
])
</script>

<style scoped>
/* ธีมพื้นหลังสีเทาอ่อน สบายตา */
.content-bg { --background: #f8f9fa; }

/* Header Styling */
.page-title { font-weight: bold; color: #2d3436; font-size: 1.1rem; }

/* Filter Styling */
.filter-wrapper { display: flex; justify-content: center; margin-bottom: 20px; }
.filter-btn { --border-radius: 20px; font-weight: normal; font-size: 0.9rem; height: 35px; }

/* Card Styling */
.chart-card { 
    border-radius: 20px; 
    margin: 0 5px 20px 5px; 
    box-shadow: 0 10px 25px rgba(0,0,0,0.05); /* เงานุ่มๆ */
    border: none;
}
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.chart-header h3 { margin: 0; font-weight: bold; font-size: 1rem; color: #2d3436; }
.custom-badge { --background: #dfe6e9; --color: #636e72; font-weight: normal; padding: 6px 10px; border-radius: 8px; }
.chart-container { height: 220px; }

/* Table Section Styling */
.table-section { 
    background: white; 
    border-radius: 25px 25px 0 0; /* โค้งเฉพาะด้านบน */
    padding: 25px 20px; 
    min-height: 100%; 
    box-shadow: 0 -5px 20px rgba(0,0,0,0.03); 
    margin: 0 -16px -16px -16px; /* ขยายให้เต็มขอบล่าง */
}
.table-title-row { display: flex; justify-content: space-between; align-items: center; }
.table-title-row h3 { margin: 0; font-weight: 800; font-size: 1.2rem; color: #2d3436; }
.sub-header { margin-top: 2px; margin-bottom: 20px; font-size: 0.85rem; }

.sort-buttons { display: flex; gap: 10px; margin-bottom: 25px; overflow-x: auto; }
.active-chip { --background: #4ecdc4; --color: white; font-weight: bold; }

/* Table Rows */
.table-header { font-size: 0.75rem; color: #b2bec3; font-weight: bold; margin-bottom: 15px; letter-spacing: 0.5px; }
.text-right { text-align: right; }

.table-row { border-bottom: 1px solid #f1f2f6; padding: 12px 0; }
.month-name { font-weight: bold; color: #2d3436; font-size: 0.95rem; }
.items-count { font-size: 0.7rem; color: #b2bec3; margin-top: 2px; }

/* Color Palette (ตรงกับ Dashboard) */
.text-income { color: #4ecdc4; font-weight: 600; font-size: 0.9rem; }
.text-expense { color: #ff7675; font-weight: 600; font-size: 0.9rem; }
.text-balance { color: #2d3436; font-weight: bold; font-size: 0.9rem; }
</style>