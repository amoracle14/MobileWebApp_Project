<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-toolbar">
        <ion-buttons slot="start">
          <ion-back-button default-href="#" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>บัญชีรายรับ - รายจ่าย หนี้สิน</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="main-content">
      <div class="form-container">
        
        <ion-segment value="income" mode="ios" class="custom-segment">
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

        <div class="field-group">
          <div class="field-label">หมวดหมู่</div>
          <ion-item lines="none" class="custom-input">
            <ion-select placeholder="เลือกหมวดหมู่" interface="popover">
              <ion-select-option value="food">อาหาร</ion-select-option>
              <ion-select-option value="travel">เดินทาง</ion-select-option>
            </ion-select>
          </ion-item>
        </div>

        <div class="field-group">
          <div class="field-label flex-label">
            <span>จำนวนเงิน</span>
            <span class="unit-text">บาท</span>
          </div>
          <ion-item lines="none" class="custom-input">
            <ion-input type="number" placeholder="เช่น 120"></ion-input>
          </ion-item>
        </div>

        <div class="field-group">
          <div class="field-label">รายละเอียด</div>
          <ion-item lines="none" class="custom-textarea">
            <ion-textarea placeholder="หมายเหตุ (ถ้ามี)" :rows="6"></ion-textarea>
          </ion-item>
        </div>

        <ion-item lines="none" class="date-display-box">
          <ion-label>วันที่ 05 ม.ค. 2569</ion-label>
          <ion-icon slot="end" name="calendar-outline" class="calendar-icon"></ion-icon>
        </ion-item>

        <div class="button-wrapper">
          <ion-button expand="block" class="submit-btn">
            บันทึกรายการ
          </ion-button>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonSegment, IonSegmentButton,
  IonLabel, IonItem, IonSelect, IonSelectOption, IonInput,
  IonTextarea, IonButton, IonIcon
} from '@ionic/vue';
import { calendarOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({
  'calendar-outline': calendarOutline
});
</script>

<style scoped>
/* พื้นหลังของหน้าจอ */
.main-content {
  --background: #f4f4f4;
}

/* ส่วนหัวไล่เฉดสี */
.header-toolbar {
  --background: linear-gradient(to right, #8de8f3, #b8daff);
  --color: #333;
  --border-width: 0;
  text-align: center;
}

ion-title {
  font-size: 16px;
  font-weight: bold;
}

/* Container หุ้มฟอร์ม */
.form-container {
  padding: 20px;
}

/* ปรับแต่ง Segment (รายรับ/รายจ่าย/หนี้สิน) */
.custom-segment {
  background: transparent;
  margin-bottom: 25px;
}

ion-segment-button {
  --background: #ffffff;
  --background-checked: #77d9e8;
  --color: #77d9e8;
  --color-checked: #ffffff;
  --border-radius: 8px;
  margin: 0 5px;
  min-height: 45px;
  border: 1px solid #e0e0e0;
}

/* จัดการ Label */
.field-group {
  margin-bottom: 20px;
}

.field-label {
  font-size: 15px;
  color: #444;
  margin-bottom: 8px;
  font-weight: 500;
}

.flex-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit-text {
  font-size: 14px;
  color: #666;
}

/* ปรับแต่ง Input Box */
.custom-input, .custom-textarea {
  --background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 10px;
  --padding-start: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.custom-textarea {
  align-items: flex-start;
  padding-top: 8px;
}

/* ปรับแต่งส่วนแสดงวันที่ */
.date-display-box {
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  --background: #ffffff;
  font-size: 15px;
}

.calendar-icon {
  color: #333;
  font-size: 24px;
}

/* ปุ่มบันทึก */
.button-wrapper {
  margin-top: 35px;
  padding: 0 50px; /* เว้นระยะซ้ายขวาให้ปุ่มสั้นลงเหมือนในรูป */
}

.submit-btn {
  --background: #77d9e8;
  --background-activated: #66c8d7;
  --border-radius: 10px;
  --box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  font-size: 16px;
  font-weight: bold;
  height: 48px;
}
</style>