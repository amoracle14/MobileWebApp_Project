<template>
  <ion-page>
    <ion-content :fullscreen="true" class="content-bg">
      
      <div class="header-container">
        <ion-button fill="clear" class="back-btn" @click="goBack">
          <ion-icon :icon="arrowBack" slot="icon-only" color="dark"></ion-icon>
        </ion-button>

        <div class="persona-header text-center">
            <div class="avatar-glow">
              <img src="/gojo.jpg" alt="AI Avatar" width="100" />
            </div>
            <h1 class="persona-title">Financial Persona</h1>
            <p class="persona-subtitle">ผลการวิเคราะห์พฤติกรรมการใช้จ่าย</p>
        </div>
      </div>

      <div class="main-content-container">
        <ion-card class="score-card">
            <ion-card-content>
            <ion-grid>
                <ion-row class="ion-align-items-center">
                <ion-col size="8">
                    <h3>ดัชนีสุขภาพทางการเงิน</h3>
                    <p class="text-muted">สถานะ: ปานกลาง (Moderate)</p>
                </ion-col>
                <ion-col size="4" class="text-right">
                    <div class="score-circle">6.5</div>
                </ion-col>
                </ion-row>
                <p class="score-desc">ควรเพิ่มสัดส่วนการออมสำรองฉุกเฉิน</p>
                <ion-progress-bar :value="0.65" color="warning" class="ion-margin-top"></ion-progress-bar>
            </ion-grid>
            </ion-card-content>
        </ion-card>

        <h3 class="section-title">บทวิเคราะห์เชิงลึก (AI Insights) <ion-icon :icon="analytics" color="primary"></ion-icon></h3>
        
        <ion-card class="insight-card">
            <ion-card-content>
            <ion-item lines="none" class="insight-item">
                <ion-icon :icon="alertCircle" slot="start" color="danger"></ion-icon>
                <ion-label class="ion-text-wrap">
                <h2>ข้อควรระวัง: สภาพคล่องระยะสั้น</h2>
                <p>ตรวจพบธุรกรรมในหมวด <b>"ร้านอาหารและบริการบุฟเฟต์"</b> สูงกว่าค่าเฉลี่ย 30% ในสัปดาห์นี้ อาจส่งผลกระทบต่อเป้าหมายการออมรายเดือน</p>
                </ion-label>
            </ion-item>
            
            <div class="divider"></div>

            <ion-item lines="none" class="insight-item">
                <ion-icon :icon="thumbsUp" slot="start" color="success"></ion-icon>
                <ion-label class="ion-text-wrap">
                <h2>จุดแข็งทางการเงิน</h2>
                <p>วินัยการชำระค่าสาธารณูปโภคและค่าเช่าที่พักอาศัยมีความสม่ำเสมอดีเยี่ยม (Credit Scoring อยู่ในเกณฑ์ดี)</p>
                </ion-label>
            </ion-item>
            </ion-card-content>
        </ion-card>

        <h3 class="section-title">เป้าหมายที่แนะนำ (Action Plan) <ion-icon :icon="flag" color="dark"></ion-icon></h3>
        <ion-card class="mission-card">
            <ion-card-header>
            <ion-card-subtitle>อุปกรณ์กีฬาและนันทนาการ (Badminton)</ion-card-subtitle>
            <ion-card-title>เป้าหมายส่วนต่าง: 2,500 บาท</ion-card-title>
            </ion-card-header>
            <ion-card-content>
            <p>
                หากลดค่าใช้จ่ายหมวดเครื่องดื่ม (Coffee & Tea) ลง 15% จะสามารถจัดสรรเงินทุนเพื่อจัดซื้ออุปกรณ์ได้ภายในระยะเวลา 2 เดือน
            </p>
            <ion-button expand="block" color="light" class="ion-margin-top action-btn" shape="round">
                <ion-icon slot="start" :icon="checkmarkCircle"></ion-icon>
                ยืนยันแผนการออม
            </ion-button>
            </ion-card-content>
        </ion-card>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, IonContent, 
  IonCard, IonCardContent, 
  IonGrid, IonRow, IonCol, IonProgressBar, IonIcon, 
  IonItem, IonLabel, IonCardHeader, IonCardSubtitle, 
  IonCardTitle, IonButton 
} from '@ionic/vue';
import { analytics, alertCircle, thumbsUp, flag, checkmarkCircle, arrowBack } from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter();

// ฟังก์ชันสำหรับปุ่ม Back
const goBack = () => {
  // จะใช้ router.back() หรือระบุ path ชัดเจนก็ได้
  router.push('/tabs/habits'); 
};
</script>

<style scoped>
.content-bg { --background: #f8f9fa; }

/* 1. Header Styling */
.header-container {
  background: linear-gradient(90deg, #74d7e9 0%, #bff0f3 60%, #b2cff4 100%);
  padding: 20px 20px 60px 20px;
  border-radius: 0 0 25px 25px;
  position: relative;
}

/* จัดตำแหน่งปุ่ม Back ให้อยู่มุมซ้ายบน */
.back-btn {
    position: absolute;
    top: 10px;
    left: 5px;
    z-index: 100;
    --padding-start: 10px;
}

.persona-header { margin-top: 20px; }

.avatar-glow img {
  border-radius: 50%;
  background: white;
  padding: 5px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  width: 80px; height: 80px;
}

.persona-title {
  font-weight: 800; font-size: 1.5rem; color: #2d3436;
  margin-top: 15px; margin-bottom: 5px;
  text-transform: uppercase; letter-spacing: 1px;
}
.persona-subtitle { color: #555; font-size: 0.9rem; margin: 0; font-weight: 500; }

/* Main Content */
.main-content-container {
    padding: 0 20px; margin-top: -40px; position: relative; z-index: 10;
}

/* Score Card */
.score-card {
  border-radius: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.08); margin-bottom: 25px;
}
.score-circle {
  background: #2d3436; color: #fdcb6e; width: 50px; height: 50px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-weight: bold; float: right; font-size: 0.9rem;
}
.score-desc { font-size: 0.8rem; color: #888; margin-top: 5px; margin-bottom: 0; }

/* Titles */
.section-title {
  margin-left: 5px; margin-top: 20px; font-weight: bold; color: #2d3436;
  display: flex; align-items: center; gap: 8px; font-size: 1.1rem;
}

/* Insight Card */
.insight-card {
  border-radius: 16px; border-left: 5px solid #0984e3;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-inline: 0;
}
.divider { height: 1px; background: #eee; margin: 10px 20px; }
.insight-item h2 { font-weight: bold; font-size: 0.95rem; color: #333; }
.insight-item p { font-size: 0.85rem; color: #636e72; line-height: 1.4; }

/* Mission Card */
.mission-card {
  background: linear-gradient(135deg, #2d3436 0%, #1a1a1a 100%);
  color: white; border-radius: 16px; margin-inline: 0; margin-bottom: 40px;
}
.mission-card ion-card-subtitle { color: #fdcb6e; opacity: 1; font-weight: 600; }
.mission-card ion-card-title { color: white; font-weight: bold; font-size: 1.3rem; }
.mission-card p { opacity: 0.9; font-size: 0.9rem; }
.action-btn { --color: #2d3436; font-weight: bold; }
</style>