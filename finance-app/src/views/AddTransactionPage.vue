<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-toolbar">
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/transactions" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ transactionId ? 'แก้ไขรายการ' : 'เพิ่มรายการ' }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="main-content">
      <div class="form-container">

        <!-- ประเภทรายการ -->
        <ion-segment v-model="selectedType" mode="md" class="custom-segment">
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

        <!-- หมวดหมู่ -->
        <div class="field-group">
          <div class="field-label">หมวดหมู่</div>
          <ion-item lines="none" class="custom-input">
            <ion-select v-model="category" placeholder="เลือกหมวดหมู่" interface="popover">
              <ion-select-option value="food">ค่าอาหาร</ion-select-option>
              <ion-select-option value="travel">ค่าเดินทาง</ion-select-option>
              <ion-select-option value="personal">ของใช้ส่วนตัว</ion-select-option>
              <ion-select-option value="parttime">ค่าจ้าง / งานพิเศษ</ion-select-option>
              <ion-select-option value="shopping">ช้อปปิ้ง</ion-select-option>
              <ion-select-option value="credit_card_debt">หนี้บัตรเครดิต</ion-select-option>
            </ion-select>
          </ion-item>
        </div>

        <!-- จำนวนเงิน -->
        <div class="field-group">
          <div class="field-label flex-label">
            <span>จำนวนเงิน</span>
            <span class="unit-text">บาท</span>
          </div>
          <ion-item lines="none" class="custom-input">
            <ion-input
              type="number"
              placeholder="เช่น 120"
              v-model="amount">
            </ion-input>
          </ion-item>
        </div>

        <!-- รายละเอียด -->
        <div class="field-group">
          <div class="field-label">รายละเอียด</div>
          <ion-item lines="none" class="custom-input">
            <ion-textarea
              placeholder="หมายเหตุ (ถ้ามี)"
              :rows="4"
              v-model="note">
            </ion-textarea>
          </ion-item>
        </div>

        <!-- วันที่ -->
        <div class="field-group">
          <div class="date-input-wrapper">
            <input type="date" v-model="selectedDate" class="date-input" />
            <ion-icon name="calendar-outline" class="calendar-icon"></ion-icon>
          </div>
        </div>

        <!-- ปุ่มบันทึก -->
        <div class="button-wrapper">
          <ion-button expand="block" class="submit-btn" @click="saveTransaction">
            {{ transactionId ? 'อัปเดตรายการ' : 'บันทึกรายการ' }}
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
  IonLabel, IonItem, IonSelect, IonSelectOption,
  IonInput, IonTextarea, IonButton, IonIcon
} from '@ionic/vue'

import { calendarOutline } from 'ionicons/icons'
import { addIcons } from 'ionicons'
import { ref } from 'vue'
import { onIonViewWillEnter } from '@ionic/vue'

import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
// 🔥 เพิ่ม getAuth เข้ามาเพื่อดึงข้อมูลคนล็อคอิน
import { getAuth } from 'firebase/auth' 
import { db } from '@/firebase'
import { useRoute, useRouter } from 'vue-router'

addIcons({ 'calendar-outline': calendarOutline })

const route = useRoute()
const router = useRouter()

const transactionId = route.params.id as string | undefined

const selectedType = ref('income')
const category = ref('')
const amount = ref('')
const note = ref('')
const selectedDate = ref('')

/* ฟังก์ชันโหลดข้อมูลทุกครั้งที่เข้าหน้า (ถ้าเป็นการกดเข้ามาแก้ไข) */
onIonViewWillEnter(async () => {
  if (transactionId) {
    const docRef = doc(db, 'transactions', transactionId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      selectedType.value = data.type
      category.value = data.category
      amount.value = data.amount
      note.value = data.note
      selectedDate.value = data.date
    }
  } else {
    // เคลียร์ฟอร์มถ้าเป็นโหมดเพิ่มข้อมูลใหม่
    selectedType.value = 'income'
    category.value = ''
    amount.value = ''
    note.value = ''
    selectedDate.value = ''
  }
})

/* ฟังก์ชันบันทึก / อัปเดตข้อมูล */
const saveTransaction = async () => {
  try {
    if (!category.value || !amount.value) {
      alert('กรุณากรอกข้อมูลให้ครบ')
      return
    }

    // 🔥 1. เรียกดูว่าใครกำลังล็อคอินอยู่
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) {
      alert('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง')
      return
    }

    // 🔥 2. เพิ่มฟิลด์ userId เข้าไปในข้อมูลที่จะส่งขึ้น Database
    const payload = {
      type: selectedType.value,
      category: category.value,
      amount: Number(amount.value),
      note: note.value,
      date: selectedDate.value,
      userId: user.uid // <--- จุดสำคัญ! แปะป้ายชื่อเจ้าของเงินไว้ตรงนี้
    }

    if (transactionId) {
      await updateDoc(doc(db, 'transactions', transactionId), payload)
      console.log('การดำเนินการสำเร็จ: อัปเดตข้อมูลเรียบร้อยแล้ว')
    } else {
      await addDoc(collection(db, 'transactions'), payload)
      console.log('การดำเนินการสำเร็จ: บันทึกข้อมูลใหม่เรียบร้อยแล้ว')
    }

    // เด้งกลับไปหน้าธุรกรรมแบบไม่ย้อนหน้าเดิม
    router.replace('/tabs/transactions')

  } catch (error) {
    console.error('ระบบขัดข้อง: เกิดข้อผิดพลาดในการบันทึกข้อมูลลงฐานข้อมูล', error)
  }
}
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
  --background: transparent;
  background: transparent;
  margin-bottom: 25px;
}

ion-segment-button {
  --background: #ffffff;
  --background-checked: #77d9e8;
  --color: #333;
  --color-checked: #ffffff;
  --border-radius: 10px;
  --indicator-height: 0;
  --indicator-color: transparent;
  min-height: 45px;
  border: 1.5px solid #77d9e8;
  margin: 0 5px;
  font-weight: 500;
}

ion-segment-button::part(indicator),
ion-segment-button::part(indicator-background) {
  display: none;
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
.custom-input {
  --background: #ffffff;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 10px;
  --padding-start: 12px;
  --border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

ion-select {
  width: 100%;
}

ion-select::part(icon) {
  position: absolute;
  right: 12px;
}

/* Date Input */
.date-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.date-input {
  width: 100%;
  padding: 14px 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #ffffff;
  font-size: 15px;
  color: #333;
  appearance: none;
  -webkit-appearance: none;
}

.date-input::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.calendar-icon {
  position: absolute;
  right: 12px;
  color: #333;
  font-size: 24px;
  pointer-events: none;
}

/* ปุ่มบันทึก */
.button-wrapper {
  margin-top: 35px;
  padding: 0 50px;
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
  --background: transparent;
  background: transparent;
  margin-bottom: 25px;
}

ion-segment-button {
  --background: #ffffff;
  --background-checked: #77d9e8;
  --color: #333;
  --color-checked: #ffffff;
  --border-radius: 10px;
  --indicator-height: 0;
  --indicator-color: transparent;
  min-height: 45px;
  border: 1.5px solid #77d9e8;
  margin: 0 5px;
  font-weight: 500;
}

ion-segment-button::part(indicator),
ion-segment-button::part(indicator-background) {
  display: none;
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
.custom-input {
  --background: #ffffff;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 10px;
  --padding-start: 12px;
  --border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

ion-select {
  width: 100%;
}

ion-select::part(icon) {
  position: absolute;
  right: 12px;
}

/* Date Input */
.date-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.date-input {
  width: 100%;
  padding: 14px 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #ffffff;
  font-size: 15px;
  color: #333;
  appearance: none;
  -webkit-appearance: none;
}

.date-input::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.calendar-icon {
  position: absolute;
  right: 12px;
  color: #333;
  font-size: 24px;
  pointer-events: none;
}

/* ปุ่มบันทึก */
.button-wrapper {
  margin-top: 35px;
  padding: 0 50px;
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