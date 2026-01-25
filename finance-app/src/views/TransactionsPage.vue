<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-gradient">
        <ion-title class="ion-text-center">
          รายการบัญชีรายรับ - รายจ่าย หนี้สิน
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-for="item in transactions" :key="item.id">
        <ion-card class="transaction-card">
          <ion-card-header>
            <div class="card-header-row">
              <ion-card-title class="type-title">
                {{ item.amount > 0 ? 'รายการรายรับ' : 'รายการรายจ่าย' }}
              </ion-card-title>
              <ion-button fill="clear" size="small" @click="editItem()" class="edit-btn">
                <ion-icon slot="start" :icon="createOutline" />
                แก้ไข
              </ion-button>
            </div>
          </ion-card-header>

          <ion-card-content>
            <div class="info-row">
              <span class="label">หมวดหมู่</span>
              <span class="value">{{ item.category }}</span>
            </div>
            <div class="info-row">
              <span class="label">จำนวนเงิน</span>
              <span :class="['value', 'amount', item.amount > 0 ? 'income' : 'expense']">
                {{ item.amount > 0 ? '+' : '' }}{{ item.amount }}
              </span>
            </div>
            <div class="info-row">
              <span class="label">วันที่</span>
              <span class="value">{{ item.date }}</span>
            </div>
            <div class="info-row">
              <span class="label">รายละเอียด</span>
              <span class="value">{{ item.description }}</span>
            </div>

            <div class="ion-text-right">
              <ion-button fill="clear" class="delete-btn" @click="deleteItem(item.id)">
                <ion-icon slot="start" :icon="trashOutline" />
                ลบรายการ
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>

    
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, alertController
} from '@ionic/vue';
import { createOutline, trashOutline } from 'ionicons/icons';

const router = useRouter();

// จำลองข้อมูล (Mock Data)
const transactions = ref([
  { id: 1, category: 'อาหาร', amount: -300, date: '15 ม.ค. 2569', description: 'กินข้าวที่ร้านบลาๆๆ' },
  { id: 2, category: 'เครื่องเขียน', amount: -550, date: '14 ม.ค. 2569', description: 'ซื้อสมุด ปากกา ดินสอ' },
  { id: 3, category: 'การทำงานพิเศษ', amount: 1200, date: '10 ม.ค. 2569', description: 'พาร์ทไทม์แบบไม่พัก' },
]);

// ฟังก์ชันลบรายการ
const deleteItem = async (id: number) => {
  const alert = await alertController.create({
    header: 'ยืนยันการลบรายการ',
    subHeader: 'รายการนี้จะถูกลบออกจากบัญชีของคุณถาวร',
    message: 'คุณแน่ใจใช่หรือไม่ที่จะลบข้อมูลนี้?',
    cssClass: 'white-theme-alert', // เราสามารถนำชื่อคลาสนี้ไปแต่งต่อใน CSS ได้
    buttons: [
      {
        text: 'ยกเลิก',
        role: 'cancel',
        cssClass: 'alert-button-cancel', // แต่งสีปุ่มยกเลิก
        handler: () => {
          console.log('ยกเลิกการลบ');
        },
      },
      {
        text: 'ยืนยันการลบ',
        role: 'destructive',
        cssClass: 'alert-button-confirm', // แต่งสีปุ่มลบให้เด่น
        handler: () => {
          transactions.value = transactions.value.filter(t => t.id !== id);
        },
      },
    ],
  });

  await alert.present();
};
const editItem = () => {
  router.push('/add-transaction'); 
};
</script>

<style scoped>
/* พื้นหลัง Gradient ตามรูป */
.header-gradient {
  --background: linear-gradient(to right, #8de4fb, #acc7f3);
  --color: #333;
  
}
.ion-text-center{
  font-weight: bold;
  font-size: 1.1rem;
  margin: 50px;
}

ion-content {
  --background: #ffffff;
}

ion-title {
  font-weight: bold;
  font-size: 1.1rem;
}

/* ปรับแต่ง Card */
.transaction-card {
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 7px 10px 12px rgba(0, 0, 0, 0.1);
  --background: #ffffff;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.type-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #000;
}

.edit-btn {
  --color: #4a90e2;
  font-size: 0.9rem;
}

/* จัดเลย์เอาต์ข้อมูลข้างใน */
.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 1rem;
}

.label {
  color: #666;
  min-width: 80px;
}

.value {
  color: #333;
  margin-left: 8px;
}

.amount {
  font-weight: bold;
}

.expense {
  color: #ff5252;
}

.income {
  color: #4cd137;
}

/* ปุ่มลบ */
.delete-btn {
  --color: #ff5252;
  font-size: 0.9rem;
  margin-top: 8px;
}

/* Tab Bar */
ion-tab-bar {
  --border: 1px solid #f0f0f0;
}

.selected-tab {
  --color: #4db8ff;
}

ion-tab-button ion-label {
  font-size: 12px;
}

</style>