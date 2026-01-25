<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar class="header-gradient">
        <ion-title class="ion-text-center">
          รายการบัญชีรายรับ - รายจ่าย หนี้สิน
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- Segment -->
      <ion-segment value="expense">
        <ion-segment-button value="income">
          <ion-label>รายรับ</ion-label>
        </ion-segment-button>
        <ion-segment-button value="expense">
          <ion-label>รายจ่าย</ion-label>
        </ion-segment-button>
        <ion-segment-button value="debt">
          <ion-label>หนี้</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Expense Card -->
      <ion-card>
        <ion-card-header>
          <div class="card-header">
            <ion-card-title>รายการรายจ่าย</ion-card-title>
            <ion-button fill="clear" size="small">
              <ion-icon :icon="createOutline" />
              แก้ไข
            </ion-button>
          </div>
        </ion-card-header>

        <ion-card-content>
          <p>หมวดหมู่ <span>อาหาร</span></p>
          <p>
            จำนวนเงิน
            <span class="amount expense">-300</span>
          </p>
          <p>วันที่ 15 ม.ค. 2569</p>
          <p>รายละเอียด กับข้าวร้านลุงๆ</p>

          <ion-button fill="clear" class="delete-btn">
            <ion-icon :icon="trashOutline" />
            ลบรายการ
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Expense Card 2 -->
      <ion-card>
        <ion-card-header>
          <div class="card-header">
            <ion-card-title>รายการรายจ่าย</ion-card-title>
            <ion-button fill="clear" size="small">
              <ion-icon :icon="createOutline" />
              แก้ไข
            </ion-button>
          </div>
        </ion-card-header>

        <ion-card-content>
          <p>หมวดหมู่ <span>เครื่องเขียน</span></p>
          <p>
            จำนวนเงิน
            <span class="amount expense">-550</span>
          </p>
          <p>วันที่ 14 ม.ค. 2569</p>
          <p>รายละเอียด สมุด ปากกา ดินสอ</p>

          <ion-button fill="clear" class="delete-btn">
            <ion-icon :icon="trashOutline" />
            ลบรายการ
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Income Card -->
      <ion-card>
        <ion-card-header>
          <div class="card-header">
            <ion-card-title>รายการรายรับ</ion-card-title>
            <ion-button fill="clear" size="small">
              <ion-icon :icon="createOutline" />
              แก้ไข
            </ion-button>
          </div>
        </ion-card-header>

        <ion-card-content>
          <p>หมวดหมู่ <span>การทำงานพิเศษ</span></p>
          <p>
            จำนวนเงิน
            <span class="amount income">+1200</span>
          </p>
          <p>วันที่ 10 ม.ค. 2569</p>
          <p>รายละเอียด พาร์ทไทม์แบบไฟท์</p>

          <ion-button fill="clear" class="delete-btn">
            <ion-icon :icon="trashOutline" />
            ลบรายการ
          </ion-button>
        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon
} from '@ionic/vue'

import { createOutline, trashOutline } from 'ionicons/icons'
</script>

<style scoped>
/* Header */
.header-gradient {
  --background: linear-gradient(135deg, #7fd3ff, #a3e1ff);
  --color: #000;
}

/* Segment */
ion-segment {
  --background: #f2f9ff;
  margin-bottom: 16px;
}

ion-segment-button {
  --color-checked: #3fa9f5;
}

/* Card */
ion-card {
  --background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Text */
p {
  margin: 6px 0;
  font-size: 14px;
}

.amount {
  font-weight: 600;
  font-size: 15px;
}

.expense {
  color: #ff4d4f;
}

.income {
  color: #52c41a;
}

/* Delete Button */
.delete-btn {
  --color: #ff4d4f;
  padding-left: 0;
}
</style>
