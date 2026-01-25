<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar class="header">
        <ion-buttons slot="start">
          <ion-back-button />
        </ion-buttons>
        <ion-title>บัญชีรายรับ - รายจ่าย หนี้สิน</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content class="page">

      <!-- Segment -->
      <ion-segment value="income" class="segment">
        <ion-segment-button value="income">
          <ion-label>รายรับ</ion-label>
        </ion-segment-button>
        <ion-segment-button value="expense">
          <ion-label>รายจ่าย</ion-label>
        </ion-segment-button>
        <ion-segment-button value="debt">
          <ion-label>หนี้สิน</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Category -->
      <div class="field">
        <div class="label">หมวดหมู่</div>
        <ion-item lines="none" class="input-box">
          <ion-select placeholder="เลือกหมวดหมู่">
            <ion-select-option value="food">อาหาร</ion-select-option>
          </ion-select>
        </ion-item>
      </div>

      <!-- Amount -->
      <div class="field">
        <div class="label row">
          <span>จำนวนเงิน</span>
          <span class="unit">บาท</span>
        </div>
        <ion-item lines="none" class="input-box">
          <ion-input type="number" placeholder="เช่น 120" />
        </ion-item>
      </div>

      <!-- Note -->
      <div class="field">
        <div class="label">รายละเอียด</div>
        <ion-item lines="none" class="textarea-box">
          <ion-textarea placeholder="หมายเหตุ (ถ้ามี)" />
        </ion-item>
      </div>

      <!-- Date -->
      <ion-item lines="none" class="date-box">
        <ion-label>วันที่ 05 ม.ค. 2569</ion-label>
        <ion-icon slot="end" name="calendar-outline" />
      </ion-item>

      <!-- Save -->
      <ion-button expand="block" class="save-btn">
        บันทึกรายการ
      </ion-button>

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
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon
} from '@ionic/vue'
</script>

<style scoped>
/* ===== Page ===== */
.page {
  --background: #ffffff;
  padding: 16px;
}

/* ===== Header ===== */
.header {
  --background: linear-gradient(90deg, #8ee8f3, #b9d9ff);
  --color: #000;
}

/* ===== Segment ===== */
.segment {
  margin-bottom: 20px;
  
}

ion-segment-button {
  --border-radius: 10px;
  --color: #5fcde4;
  --color-checked: #ffffff;
  --indicator-color: #5fcde4;
}

/* ===== Form ===== */
.field {
  margin-bottom: 16px;
}

.label {
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
}

.label.row {
  display: flex;
  justify-content: space-between;
}

.unit {
  color: #666;
  font-size: 13px;
}

.input-box,
.textarea-box {
  --background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e2e2e2;
}

.textarea-box {
  min-height: 90px;
}

/* ===== Date ===== */
.date-box {
  margin-top: 8px;
  border: 1px solid #e2e2e2;
  border-radius: 10px;
  --background: #ffffff;
}

/* ===== Button ===== */
.save-btn {
  margin-top: 24px;
  --background: #7dd9e8;
  --border-radius: 10px;
}
</style>
