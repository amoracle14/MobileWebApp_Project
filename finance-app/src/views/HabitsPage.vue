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
                  <h2>฿ 15,960</h2>
                  <p>ยอดเงินคงเหลือสุทธิ</p>
                </div>
              </div>
              
              <ion-button shape="round" color="light" fill="solid" size="small" class="period-btn">
                รายเดือน <ion-icon :icon="chevronDown" slot="end"></ion-icon>
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
                        <Doughnut :data="doughnutData" :options="doughnutOptions" />
                        <div class="chart-center-text">
                        <div class="label">ใช้ไป</div>
                        <div class="value">68%</div>
                        </div>
                    </div>
                    </ion-col>
                    <ion-col size="6">
                    <div class="stats-text">
                        <div class="stat-item">
                        <span class="dot income"></span> <span class="label">รายรับ</span>
                        <div class="value-text">50,000</div>
                        </div>
                        <div class="stat-item">
                        <span class="dot expense"></span> <span class="label">รายจ่าย</span>
                        <div class="value-text">34,040</div>
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
            <ion-col size="4">
                <ion-card class="mini-stat-card income-bg">
                <ion-icon :icon="arrowDown" class="icon-down"></ion-icon>
                <div class="label">รายรับ</div>
                <div class="val">50,000</div>
                </ion-card>
            </ion-col>
            <ion-col size="4">
                <ion-card class="mini-stat-card expense-bg">
                <ion-icon :icon="arrowUp" class="icon-up"></ion-icon>
                <div class="label">รายจ่าย</div>
                <div class="val">34,040</div>
                </ion-card>
            </ion-col>
            <ion-col size="4">
                <ion-card class="mini-stat-card balance-bg">
                <ion-icon :icon="wallet" class="icon-wallet"></ion-icon>
                <div class="label">คงเหลือ</div>
                <div class="val">15,960</div>
                </ion-card>
            </ion-col>
            </ion-row>
        </ion-grid>

        <div class="section-header">
            <h3>สัดส่วนค่าใช้จ่าย</h3>
            <ion-button size="small" fill="clear" @click="goToSummary" class="view-report-btn">
             รายงานฉบับเต็ม <ion-icon :icon="statsChart" slot="end"></ion-icon>
            </ion-button>
        </div>
        
        <ion-card class="categories-card">
            <ion-card-content>
            <div class="bar-chart-container">
                <Bar :data="categoryChartData" :options="categoryChartOptions" />
            </div>
            <p class="chart-note">หมวด "อาหารและเครื่องดื่ม" มีสัดส่วนรายจ่ายสูงสุด</p>
            </ion-card-content>
        </ion-card>

        <ion-card class="persona-card">
            <ion-card-header>
            <ion-card-title>
                <ion-icon :icon="sparkles" class="ai-icon"></ion-icon> บทวิเคราะห์พฤติกรรม (AI)
            </ion-card-title>
            </ion-card-header>
            <ion-card-content>
            <h2 class="persona-title">รูปแบบการใช้จ่าย: The Foodie</h2>
            <p class="persona-desc">
                "ตรวจพบรายจ่ายในหมวดอาหารสูงกว่าเกณฑ์ปกติในระยะนี้ แนะนำให้ควบคุมงบประมาณเพื่อรักษาสภาพคล่องและบรรลุเป้าหมายทางการเงินที่ตั้งไว้"
            </p>
            <div class="see-more" @click="goToAIAnalysis">
                อ่านบทวิเคราะห์ละเอียด <ion-icon :icon="arrowForward"></ion-icon>
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
  IonIcon, IonGrid, IonRow, IonCol, IonCardHeader, 
  IonCardTitle
} from '@ionic/vue';
import { 
  chevronDown, arrowDown, arrowUp, wallet, sparkles, 
  arrowForward, statsChart 
} from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { 
  Chart as ChartJS, ArcElement, Tooltip, Legend, 
  BarElement, CategoryScale, LinearScale 
} from 'chart.js';
import { Doughnut, Bar } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const router = useRouter();

// --- Data ---
const doughnutData = {
  labels: ['รายจ่าย', 'คงเหลือ'],
  datasets: [{ backgroundColor: ['#4ecdc4', '#eeeeee'], data: [68, 32], borderWidth: 0, cutout: '75%' }]
};
const doughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } };

const categoryChartData = {
  labels: ['อาหาร', 'ช้อปปิ้ง', 'เดินทาง', 'เกม', 'สัตว์เลี้ยง'],
  datasets: [{
      label: 'รายจ่าย (บาท)',
      backgroundColor: ['#ff7675', '#74b9ff', '#55efc4', '#a29bfe', '#fdcb6e'],
      data: [12500, 5000, 3200, 8900, 2400],
      borderRadius: 5
  }]
};
const categoryChartOptions = {
  responsive: true, maintainAspectRatio: false, indexAxis: 'y' as const,
  plugins: { legend: { display: false } },
  scales: { x: { display: false }, y: { grid: { display: false }, ticks: { font: { family: 'Kanit, sans-serif' } } } }
};

// --- Navigation (แก้ตรงนี้ให้แล้วครับ!) ---
const goToAIAnalysis = () => {
  // ✅ ต้องมี /tabs/ นำหน้า
  router.push('/tabs/ai-analysis'); 
};

const goToSummary = () => {
  // ✅ ต้องมี /tabs/ นำหน้า
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
    padding: 0 20px;
    margin-top: -40px;
    position: relative;
    z-index: 20;
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
.stats-text .stat-item { margin-bottom: 10px; }
.dot { height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; }
.dot.income { background-color: #4ecdc4; }
.dot.expense { background-color: #ff7675; }
.value-text { font-weight: bold; font-size: 1.1rem; margin-left: 15px; color: #2d3436; }

/* Mini Stats */
.mini-stat-card { text-align: center; padding: 12px; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin: 5px; border: none; }
.income-bg { background: #e0f7fa; color: #006064; }
.expense-bg { background: #ffebee; color: #b71c1c; }
.balance-bg { background: #f3e5f5; color: #4a148c; }
.mini-stat-card .label { font-size: 0.75rem; opacity: 0.8; margin-bottom: 4px; }
.mini-stat-card .val { font-weight: bold; font-size: 0.95rem; }

/* Categories */
.section-header { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 10px; }
.section-header h3 { font-size: 1.1rem; font-weight: bold; color: #2d3436; margin: 0; }
.view-report-btn { font-size: 0.85rem; --color: #74d7e9; }
.categories-card { border-radius: 20px; margin: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.bar-chart-container { height: 180px; width: 100%; }
.chart-note { text-align: center; font-size: 0.8rem; color: #636e72; margin-top: 15px; }

/* AI Persona Card (Blue Gradient Theme) */
.persona-card { 
  background: linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%); 
  border: 1px solid #b2ebf2; 
  border-radius: 20px; 
  margin-top: 25px; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.persona-card h2 { font-weight: 800; font-size: 1rem; color: #006064; margin-top: 0; }
.persona-desc { color: #546e7a; font-size: 0.9rem; line-height: 1.5; margin-bottom: 15px; }
.ai-icon { color: #00acc1; }
.see-more { color: #00bcd4; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; cursor: pointer; }
</style>