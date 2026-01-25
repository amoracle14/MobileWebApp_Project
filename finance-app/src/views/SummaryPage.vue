<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>สรุปรายรับ - รายจ่ายรายวัน</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="content-wrapper">
        <!-- Day Cards -->
        <ion-card v-for="day in days" :key="day.date">
          <ion-card-content>
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
              <ion-card v-for="item in day.items" :key="item.id" class="item-card">
                <ion-card-content>
                  <div class="icon">{{ item.icon }}</div>
                  <div class="name">{{ item.name }}</div>
                  <div :class="['amount', item.amount < 0 ? 'minus' : 'plus']">
                    {{ item.amount }} THB
                  </div>
                  <div class="time">{{ item.time }}</div>
                </ion-card-content>
              </ion-card>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonChip,
  IonLabel
} from '@ionic/vue';

const days = [
  {
    date: '12 ม.ค. 2026',
    expense: -500,
    income: 1500,
    balance: 1000,
    items: [
      { id: 1, name: 'อาหาร', amount: -500, time: '12:00', icon: '🍔' },
      { id: 2, name: 'รายได้', amount: 1000, time: '16:00', icon: '💰' },
      { id: 3, name: 'ไลฟ์', amount: 500, time: '17:00', icon: '🎁' }
    ]
  },
  {
    date: '10 ม.ค. 2026',
    expense: -2000,
    income: 0,
    balance: -2000,
    items: [
      { id: 4, name: 'อาหาร', amount: -500, time: '12:00', icon: '🍔' },
      { id: 5, name: 'ของใช้', amount: -1500, time: '19:30', icon: '🛒' }
    ]
  }
];
</script>

<style scoped>
.content-wrapper {
  background: #f5f5f5;
  min-height: 100%;
  padding-bottom: 20px;
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
  color: #2e7d32;
}

.amount.minus {
  color: #d32f2f;
}

.time {
  font-size: 12px;
  color: #888;
}
</style>