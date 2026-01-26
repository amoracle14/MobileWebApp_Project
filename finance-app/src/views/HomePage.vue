<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="header-container">
        <img src="/Group 237.png" class="bg-decoration" />
        <div class="content-wrapper">
          <div class="user-info">
            <div class="profile-section">
              <ion-avatar class="avatar">
                <img src="/gojo.jpg" />
              </ion-avatar>
              <div class="wallet-balance">
                <h2>฿ 15,960</h2>
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
    <div class="days-badge">698 วัน</div>
    <div class="items-badge">1,986 รายการ</div>
  </div>
        </div>
      </div>

      <div class="main-content">
        <h3 class="section-title">รายละเอียด</h3>
        <div class="recent-card">
          <div class="card-header">
            <span><span class="dot"></span> รายการล่าสุด</span>
            <span class="view-all"
              >ดูทั้งหมด <ion-icon :icon="chevronForwardOutline"></ion-icon
            ></span>
          </div>
          <div class="transaction-detail">
            <div class="row"><span>หมวดหมู่</span> <span>อาหาร</span></div>
            <div class="row">
              <span>จำนวนเงิน</span> <span class="amount-negative">-300</span>
            </div>
            <div class="row"><span>วันที่</span> <span>15 ม.ค. 2569</span></div>
            <div class="row">
              <span>รายละเอียด</span> <span>กินข้าวที่ร้านบลาๆๆ</span>
            </div>
          </div>
        </div>
        <div class="recent-card">
          <div class="summary-card income">
            <div class="summary-icon">
              <img src="/dollars.png" class="summary-img" alt="income" />
            </div>

            <div class="summary-text-container">
              <div class="main-label">รายรับเดือนนี้</div>

              <div class="sub-detail">
                <img src="/flag.png" class="mini-flag" />
                <span class="sub-amount">25,960</span>
                <span class="sub-currency">THB</span>
              </div>
            </div>

            <div class="summary-amount">25,960 <span>THB</span></div>
          </div>

          <div class="summary-card debt">
            <div class="summary-icon">
              <img src="/money-bags.png" class="summary-img" alt="debt" />
            </div>
            <div class="summary-text">หนี้สิน</div>
            <div class="summary-amount">10,895 <span>THB</span></div>
          </div>
        </div>
        <div class="recent-card">
          <div class="card-header">
            <span><span class="dot"></span>การใช้จ่ายล่าสุด</span>
          </div>
          <!-- Day Cards -->
          <ion-card
            v-for="day in days"
            :key="day.date"
            style="box-shadow: none; background-color: white; "
          >

              <div class="day-header">
                <div class="date">{{ day.date }}</div>
                <div class="count">{{ day.items.length }} รายการ</div>
              </div>

              <div class="summary">
                <ion-chip color="danger">
                  <ion-label>{{ day.expense }} THB</ion-label>
                </ion-chip>
                <ion-chip color="success">
                  <ion-label>{{ day.income }} THB</ion-label>
                </ion-chip>
                <ion-chip color="primary">
                  <ion-label>คงเหลือ : {{ day.balance }} THB</ion-label>
                </ion-chip>
              </div>

              <div class="items">
                <ion-card
                  style="
                    border: 0.1px solid lightgrey;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                    background-color: white;
                  "
                  v-for="item in day.items"
                  :key="item.id"
                  class="item-card"
                >
                  <ion-card-content>
                    <div class="icon">{{ item.icon }}</div>
                    <div class="name">{{ item.name }}</div>
                    <div
                      :class="['amount', item.amount < 0 ? 'minus' : 'plus']"
                    >
                      {{ item.amount }} THB
                    </div>
                    <div class="time">{{ item.time }}</div>
                  </ion-card-content>
                </ion-card>
              </div>
           
          </ion-card>
        </div>
      </div>

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
import {
  IonPage,
  IonContent,
  IonAvatar,
  IonIcon,
  IonFab,
  IonButton,
} from "@ionic/vue";
import {
  menuOutline,
  chevronForwardOutline,
  addOutline,
  cashOutline,
  walletOutline,
} from "ionicons/icons";

const days = [
  {
    date: "12 ม.ค. 2026",
    expense: -500,
    income: 1500,
    balance: 1000,
    items: [
      { id: 1, name: "อาหาร", amount: -500, time: "12:00", icon: "🍔" },
      { id: 2, name: "รายได้", amount: 1000, time: "16:00", icon: "💰" },
      { id: 3, name: 'ไลฟ์', amount: 500, time: '17:00', icon: '🎁' }

    ],
  },
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap');
* {
  font-family: 'Kanit', sans-serif;

}

.header-container {
  background: linear-gradient(90deg, #74d7e9 0%, #bff0f3 60%, #b2cff4 100%);
  padding: 50px 20px 30px 20px;
  position: relative;
  overflow: hidden;
  
  color: #1D1D1F;
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
  color: #1D1D1F;
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
  color: #1D1D1F;
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
  color: #1D1D1F;
}
.quiz-arrow {
  position: absolute;

  right: 10px;

  top: 50%;
  transform: translateY(-50%);

  font-size: 1.2rem;
  color: #1D1D1F;
}
.test-quiz-card {
  cursor: pointer;
  color: #1D1D1F;
}
.test-quiz-card:active {
  transform: scale(0.98);
}
.days-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #1D1D1F;
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
  margin:0px 0;
  color: #1D1D1F;
  padding-top: 15px;
}

.recent-card {
  background: rgb(255, 255, 255);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 15px;
  color: #1D1D1F;
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

.amount.plus {
  color: #34C759;
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
  z-index: 100;         /* ตั้งค่าให้สูงมากๆ เพื่อให้อยู่หน้าสุด */
  margin-top: -50px;
      
}

/* 2. ปรับหัวข้อ "รายละเอียด" ให้เด่นขึ้น */
.section-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #1D1D1F;
  padding-top: 0;      /* เอา padding ออกเพื่อให้ชิดด้านบน */
  text-shadow: 0 1px 2px rgba(255,255,255,0.5); /* เพิ่มเงาจางๆ ให้ตัวหนังสืออ่านง่ายบนพื้นสีฟ้า */
}

/* 3. การ์ดรายการล่าสุด */
.recent-card {
  background: white;
  border-radius: 15px;
  padding: 15px;
  /* เพิ่มเงาเข้มขึ้นเพื่อให้ดู "ลอย" ออกมาข้างหน้าสุด */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  margin-bottom: 15px;
  color: #1D1D1F;
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


.days-badge, .items-badge {
  position: static;      
  padding: 8px 15px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.85rem;
  white-space: nowrap;   
}





</style>
