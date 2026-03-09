<template>
  <ion-page>
    <!-- Header ไล่สี -->
    <ion-header class="gradient-header">
      <ion-toolbar class="gradient-toolbar">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
        <ion-title></ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- พื้นหลังเทา -->
    <ion-content class="ion-padding page-bg">
      <!-- Progress -->
      <div class="progress-wrapper">
        <ion-progress-bar :value="progress"></ion-progress-bar>
        <p class="progress-text">
          ข้อ {{ currentQuestionNumber }} จาก {{ totalQuestions }}
        </p>
      </div>

      <!-- 5 คำถามต่อหน้า -->
      <ion-card v-for="q in pageQuestions" :key="q.id" class="q-card">
        <ion-card-content>
          <p class="question">{{ q.title }}</p>

            <ion-radio-group v-model="answers[q.id]">
                <div class="option-row">
                    <ion-item
                    v-for="opt in q.options"
                    :key="opt.value"
                    lines="none"
                    class="opt-item"
                    >
                    <ion-radio slot="start" :value="opt.value"></ion-radio>
                    <ion-label>{{ opt.label }}</ion-label>
                    </ion-item>
                </div>
            </ion-radio-group>

        </ion-card-content>
      </ion-card>

      <!-- Next Button -->
      <div class="next-btn">
        <ion-button :disabled="!isAllAnsweredOnPage" @click="next">
          ต่อไป
          <ion-icon :icon="chevronForward" slot="end"></ion-icon>
        </ion-button>
      </div>

      <!-- Toast แจ้งเตือน -->
      <ion-toast
        :is-open="toastOpen"
        message="กรุณาตอบให้ครบทุกข้อก่อนกดต่อไป"
        :duration="1600"
        @didDismiss="toastOpen = false"
      />
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
  IonProgressBar,
  IonCard,
  IonCardContent,
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonToast
} from '@ionic/vue'

import { chevronForward } from 'ionicons/icons'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/** ✅ ตั้งค่าหลัก */
const QUESTIONS_PER_PAGE = 5
const totalQuestions = 20 // ทั้งหมด 20 ข้อ

const router = useRouter()
const route = useRoute()

/** ✅ หน้า (page) มาจาก URL เช่น /quiz/1 */
const currentPage = computed(() => Number(route.params.page || 1))

/** ✅ คำถามทั้งหมด (ใส่ให้ครบ 20 ข้อ) */
const allQuestions = [
  // 🔹 มิติที่ 1: Planner (P) vs Impulse (I)
  {
    id: 1,
    dimension: 'P/I',
    title: 'ก่อนซื้อของราคาแพง คุณมักจะ…',
    options: [
      { value: 'A', label: 'วางแผน เปรียบเทียบราคา', score: 'P' },
      { value: 'B', label: 'เห็นว่าชอบก็ซื้อเลย', score: 'I' }
    ]
  },
  {
    id: 2,
    dimension: 'P/I',
    title: 'คุณตั้งงบประมาณรายเดือนหรือไม่',
    options: [
      { value: 'A', label: 'ตั้งเป็นประจำ', score: 'P' },
      { value: 'B', label: 'ไม่ค่อยตั้ง', score: 'I' }
    ]
  },
  {
    id: 3,
    dimension: 'P/I',
    title: 'คุณจดหรือเช็กค่าใช้จ่ายของตัวเอง',
    options: [
      { value: 'A', label: 'เช็กสม่ำเสมอ', score: 'P' },
      { value: 'B', label: 'แทบไม่เช็ก', score: 'I' }
    ]
  },
  {
    id: 4,
    dimension: 'P/I',
    title: 'ถ้ามีรายจ่ายกะทันหัน',
    options: [
      { value: 'A', label: 'มีเงินสำรองไว้แล้ว', score: 'P' },
      { value: 'B', label: 'ค่อยแก้ปัญหาเอาทีหลัง', score: 'I' }
    ]
  },
  {
    id: 5,
    dimension: 'P/I',
    title: 'คุณคิดก่อนใช้เงินทุกครั้ง',
    options: [
      { value: 'A', label: 'ใช่', score: 'P' },
      { value: 'B', label: 'ไม่เสมอไป', score: 'I' }
    ]
  },

  // 🔹 มิติที่ 2: Saver (S) vs Spender (D)
  {
    id: 6,
    dimension: 'S/D',
    title: 'เมื่อได้เงินพิเศษ คุณจะ…',
    options: [
      { value: 'A', label: 'เก็บก่อน', score: 'S' },
      { value: 'B', label: 'ใช้ก่อน', score: 'D' }
    ]
  },
  {
    id: 7,
    dimension: 'S/D',
    title: 'คุณมีเงินออมฉุกเฉิน',
    options: [
      { value: 'A', label: 'มี', score: 'S' },
      { value: 'B', label: 'ไม่มี', score: 'D' }
    ]
  },
  {
    id: 8,
    dimension: 'S/D',
    title: 'คุณยอมลดความฟุ่มเฟือยเพื่อออมเงิน',
    options: [
      { value: 'A', label: 'ยอม', score: 'S' },
      { value: 'B', label: 'ไม่ค่อย', score: 'D' }
    ]
  },
  {
    id: 9,
    dimension: 'S/D',
    title: 'สิ้นเดือนคุณมักจะ…',
    options: [
      { value: 'A', label: 'ยังมีเงินเหลือ', score: 'S' },
      { value: 'B', label: 'เงินหมดพอดีหรือเกิน', score: 'D' }
    ]
  },
  {
    id: 10,
    dimension: 'S/D',
    title: 'คุณคิดว่า “ออมเงินสำคัญกว่าความสุขระยะสั้น”',
    options: [
      { value: 'A', label: 'เห็นด้วย', score: 'S' },
      { value: 'B', label: 'ไม่ค่อยเห็นด้วย', score: 'D' }
    ]
  },

  // 🔹 มิติที่ 3: Rational (R) vs Emotional (E)
  {
    id: 11,
    dimension: 'R/E',
    title: 'คุณซื้อของเพราะอารมณ์บ่อยไหม',
    options: [
      { value: 'A', label: 'แทบไม่', score: 'R' },
      { value: 'B', label: 'บ่อย', score: 'E' }
    ]
  },
  {
    id: 12,
    dimension: 'R/E',
    title: 'คุณคิดถึงความคุ้มค่าก่อนซื้อ',
    options: [
      { value: 'A', label: 'เสมอ', score: 'R' },
      { value: 'B', label: 'ไม่เสมอ', score: 'E' }
    ]
  },
  {
    id: 13,
    dimension: 'R/E',
    title: 'โปรโมชั่นมีผลต่อการตัดสินใจของคุณ',
    options: [
      { value: 'A', label: 'พอประมาณ', score: 'R' },
      { value: 'B', label: 'มาก', score: 'E' }
    ]
  },
  {
    id: 14,
    dimension: 'R/E',
    title: 'คุณซื้อของเพราะคนอื่นมี',
    options: [
      { value: 'A', label: 'น้อยมาก', score: 'R' },
      { value: 'B', label: 'ค่อนข้างบ่อย', score: 'E' }
    ]
  },
  {
    id: 15,
    dimension: 'R/E',
    title: 'ของแพงแต่ถูกใจมาก',
    options: [
      { value: 'A', label: 'ขอคิดก่อน', score: 'R' },
      { value: 'B', label: 'ซื้อเลย', score: 'E' }
    ]
  },

  // 🔹 มิติที่ 4: Security (C) vs Investment (V)
  {
    id: 16,
    dimension: 'C/V',
    title: 'คุณชอบความมั่นคงทางการเงิน',
    options: [
      { value: 'A', label: 'มาก', score: 'C' },
      { value: 'B', label: 'ปานกลาง', score: 'V' }
    ]
  },
  {
    id: 17,
    dimension: 'C/V',
    title: 'คุณเคยลงทุนหรือสนใจการลงทุน',
    options: [
      { value: 'A', label: 'น้อย', score: 'C' },
      { value: 'B', label: 'มาก', score: 'V' }
    ]
  },
  {
    id: 18,
    dimension: 'C/V',
    title: 'คุณกล้าเสี่ยงเงินเพื่อโอกาสกำไร',
    options: [
      { value: 'A', label: 'ไม่ค่อย', score: 'C' },
      { value: 'B', label: 'กล้า', score: 'V' }
    ]
  },
  {
    id: 19,
    dimension: 'C/V',
    title: 'ถ้ามีเงินก้อน คุณจะ…',
    options: [
      { value: 'A', label: 'เก็บหรือลงทุนปลอดภัย', score: 'C' },
      { value: 'B', label: 'ลงทุนเสี่ยงสูง', score: 'V' }
    ]
  },
  {
    id: 20,
    dimension: 'C/V',
    title: 'คุณมองการลงทุนเป็นเรื่องจำเป็น',
    options: [
      { value: 'A', label: 'ไม่จำเป็น', score: 'C' },
      { value: 'B', label: 'จำเป็น', score: 'V' }
    ]
  }
]


/** ✅ คำนวณช่วงคำถามของหน้านี้ */
const startIndex = computed(() => (currentPage.value - 1) * QUESTIONS_PER_PAGE)
const endIndex = computed(() => startIndex.value + QUESTIONS_PER_PAGE)

const pageQuestions = computed(() => {
  return allQuestions.slice(startIndex.value, endIndex.value)
})

/** ✅ บอกว่าตอนนี้ “ถึงข้อไหนแล้ว” = ข้อสุดท้ายของหน้านี้ */
const currentQuestionNumber = computed(() => {
  return Math.min(endIndex.value, totalQuestions)
})

/** ✅ progress bar */
const progress = computed(() => currentQuestionNumber.value / totalQuestions)

/** ✅ เก็บคำตอบ */
const answers = reactive<Record<number, 'A' | 'B'>>(
  history.state?.answers ?? {}
)

/** ✅ บังคับตอบครบ 5 ข้อในหน้านี้ */
const isAllAnsweredOnPage = computed(() => {
  return pageQuestions.value.every(q => !!answers[q.id])
})

/** ✅ Toast */
const toastOpen = ref(false)

/** ✅ ไปหน้าถัดไปแบบลำดับ */
const next = () => {
  if (!isAllAnsweredOnPage.value) {
    toastOpen.value = true
    return
  }

  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE)

  // ไปหน้าถัดไป
  if (currentPage.value < totalPages) {
    router.push({
  path: `/quiz/${currentPage.value + 1}`,
  state: {
    answers: JSON.parse(JSON.stringify(answers))
  }
})
    return
  }

  // ครบแล้วไป result
  router.push({
    path: '/result',
    state: { answers: JSON.parse(JSON.stringify(answers)) }
  })
  
  
  
}
</script>

<style scoped>
/* ไล่สี header */
.gradient-header {
  --background: transparent;
}
.gradient-toolbar {
  --background: linear-gradient(90deg, #8edbe9 0%, #b9cff7 100%);
  --color: #1f1f1f;
}

/* พื้นหลังเทา */
.page-bg {
  --background: #f2f2f2;
}

/* progress */
.progress-wrapper {
  margin-bottom: 16px;
}
.progress-text {
  font-size: 12px;
  text-align: right;
  margin-top: 6px;
  color: #555;
}

/* cards */
.q-card {
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  margin: 10px 0;
}
ion-card-content {
  padding: 14px;
}

.question {
  font-weight: 700;
  margin-bottom: 10px;
}

.option-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.opt-item {
  flex: 1;
  border-radius: 10px;
  --background: transparent;
}

ion-radio {
  --color: #cfcfcf;
  --color-checked: #76d6ff;
}

/* ปุ่มต่อไป */
.next-btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  color: #76d6ff;
}
ion-button {
  --background: #76d6ff;
  --color: #fff;
  --border-radius: 8px;
}
</style>
