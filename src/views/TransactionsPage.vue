```vue
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

      <div v-if="transactions.length === 0" class="ion-text-center">
        ยังไม่มีรายการ
      </div>

      <div v-for="item in transactions" :key="item.id">
        <ion-card class="transaction-card">

          <ion-card-header>
            <div class="card-header-row">

              <ion-card-title class="type-title">
                {{
                  item.type === 'income' ? 'รายการรายรับ' :
                  item.type === 'expense' ? 'รายการรายจ่าย' :
                  'รายการหนี้สิน'
                }}
              </ion-card-title>

              <ion-button
                fill="clear"
                size="small"
                @click="editItem(item.id)"
                class="edit-btn">

                <ion-icon slot="start" :icon="createOutline" />
                แก้ไข

              </ion-button>

            </div>
          </ion-card-header>

          <ion-card-content>

            <div class="info-row">
              <span class="label">หมวดหมู่</span>
              <span class="value">
                {{ categoryMap[item.category] || item.category || '-' }}
              </span>
            </div>

            <div class="info-row">
              <span class="label">จำนวนเงิน</span>

              <span
                :class="[
                  'value',
                  'amount',
                  item.type === 'income' ? 'income' : 'expense'
                ]">

                {{ item.type === 'income' ? '+' : '-' }}
                {{ item.amount }}

              </span>

            </div>

            <div class="info-row">
              <span class="label">วันที่</span>

              <span class="value">
                {{ formatDate(item.date) }}
              </span>
            </div>

            <div class="info-row">
              <span class="label">รายละเอียด</span>
              <span class="value">{{ item.note || '-' }}</span>
            </div>

            <div class="ion-text-right">
              <ion-button
                fill="clear"
                class="delete-btn"
                @click="deleteItem(item.id)">

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

import { ref } from "vue"
import { useRouter } from "vue-router"

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  alertController,
  onIonViewWillEnter
} from "@ionic/vue"

import { createOutline, trashOutline } from "ionicons/icons"

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy
} from "firebase/firestore"

import { onAuthStateChanged } from "firebase/auth"

import { db, auth } from "@/firebase"

const router = useRouter()

const transactions = ref<any[]>([])

/* แปลหมวดหมู่ทั้งหมดเป็นภาษาไทย */

const categoryMap: Record<string, string> = {

  food: "อาหาร",
  travel: "การเดินทาง",
  shopping: "ช้อปปิ้ง",

  salary: "เงินเดือน",
  parttime: "ค่าจ้าง / งานพิเศษ",

  personal: "ของใช้ส่วนตัว",
  credit_card_debt: "หนี้บัตรเครดิต",

  other: "อื่นๆ"

}

const formatDate = (date: any) => {

  if (!date) return "-"

  if (date.seconds) {
    return new Date(date.seconds * 1000).toLocaleDateString("th-TH")
  }

  return new Date(date).toLocaleDateString("th-TH")

}

const fetchTransactions = () => {

  onAuthStateChanged(auth, async (user) => {

    if (!user) return

    const q = query(

      collection(db, "transactions"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")

    )

    const querySnapshot = await getDocs(q)

    transactions.value = querySnapshot.docs.map((docSnap) => ({

      id: docSnap.id,
      ...docSnap.data()

    }))

  })

}

const deleteItem = async (id: string) => {

  const alert = await alertController.create({

    header: "ยืนยันการลบรายการ",
    message: "คุณแน่ใจใช่หรือไม่ที่จะลบข้อมูลนี้?",

    buttons: [

      {
        text: "ยกเลิก",
        role: "cancel"
      },

      {
        text: "ลบ",
        role: "destructive",

        handler: async () => {

          await deleteDoc(doc(db, "transactions", id))

          fetchTransactions()

        }
      }

    ]

  })

  await alert.present()

}

const editItem = (id: string) => {

  router.push(`/add-transaction/${id}`)

}

onIonViewWillEnter(() => {

  fetchTransactions()

})

</script>

<style scoped>

.header-gradient {
  --background: linear-gradient(to right, #8de4fb, #acc7f3);
  --color: #333;
}

.transaction-card {
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 7px 10px 12px rgba(0,0,0,0.1);
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
}

.info-row {
  display: flex;
  margin-bottom: 8px;
}

.label {
  color: #666;
  min-width: 90px;
}

.value {
  margin-left: 8px;
}

.amount {
  font-weight: bold;
}

.income {
  color: #2ecc71;
}

.expense {
  color: #e74c3c;
}

.delete-btn {
  --color: #e74c3c;
}

</style>
```
