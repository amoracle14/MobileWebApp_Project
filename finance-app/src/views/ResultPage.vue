<template>
  <ion-page>
    <ion-content :fullscreen="true" class="result-bg">
      <!-- Hero -->
      <div class="hero">
        <button class="backBtn" type="button" @click="goBack" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M14.5 5L8 11.5L14.5 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <div class="heroCenter">
          <div class="heroTitle">{{ profile.title }}</div>
          <div class="heroCode">{{ code }}</div>
        </div>


        <div class="wave" aria-hidden="true"></div>
      </div>

      <!-- Content sheet -->
      <div class="sheet">
        <div class="section">
          <div class="sectionTitle">ลักษณะนิสัยการใช้เงิน</div>
          <div class="desc">{{ profile.description }}</div>
        </div>

    
        <div class="card">
          <div class="cardTitle">จุดเด่น</div>
          <ul class="list">
            <li v-for="(it, idx) in profile.strengths" :key="'s-'+idx">
              <span class="icon ok">✓</span>
              <span class="txt">{{ it }}</span>
            </li>
          </ul>
        </div>

        <div class="card">
          <div class="cardTitle">ข้อควรระวัง</div>
          <ul class="list">
            <li v-for="(it, idx) in profile.cautions" :key="'c-'+idx">
              <span class="icon warn">⚠</span>
              <span class="txt">{{ it }}</span>
            </li>
          </ul>
        </div>

        <div class="actions">
          <ion-button expand="block" @click="goHome">กลับหน้าหลัก</ion-button>
        </div>

        <div class="bottomSpacer"></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton } from '@ionic/vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type AnswerMap = Record<number, 'A' | 'B' | string>

type Profile = {
  key: 'planner' | 'spender' | 'investor' | 'saver'
  title: string
  description: string
  strengths: string[]
  cautions: string[]
}

const route = useRoute()
const router = useRouter()

import { reactive } from 'vue'

const answers = reactive<AnswerMap>({
  ...(history.state?.answers || {})
})
    /**มันแดง แต่มันใช้ได้นะทุกคนนนนน **/ 



/** helper: นับคะแนน A/B ในช่วงข้อ */
function countAB(ids: number[]) {
  let A = 0
  let B = 0

  for (const id of ids) {
    const a = answers[id]

    if (a === 'A') A++
    if (a === 'B') B++
  }

  return { A, B }
}

/** 4 มิติ */
const dim1 = computed(() => {
  const { A, B } = countAB([1, 2, 3, 4, 5])  // A=P, B=I
  return A >= B ? 'P' : 'I'
})

const dim2 = computed(() => {
  const { A, B } = countAB([6, 7, 8, 9, 10]) // A=S, B=D
  return A >= B ? 'S' : 'D'
})

const dim3 = computed(() => {
  const { A, B } = countAB([11, 12, 13, 14, 15]) // A=R, B=E
  return A >= B ? 'R' : 'E'
})

const dim4 = computed(() => {
  const { A, B } = countAB([16, 17, 18, 19, 20]) // A=C, B=V
  return A >= B ? 'C' : 'V'
})

/** โค้ดรวม เช่น "P S R C" */
const code = computed(() => `${dim1.value} ${dim2.value} ${dim3.value} ${dim4.value}`)

/** เก็บคะแนนรายตัวอักษรไว้โชว์ */
const scores = computed(() => {
  const pi = countAB([1, 2, 3, 4, 5])
  const sd = countAB([6, 7, 8, 9, 10])
  const re = countAB([11, 12, 13, 14, 15])
  const cv = countAB([16, 17, 18, 19, 20])

  return {
    P: pi.A, I: pi.B,
    S: sd.A, D: sd.B,
    R: re.A, E: re.B,
    C: cv.A, V: cv.B
  }
})

/** ข้อมูลโปรไฟล์จากที่คุณให้มา */
const PROFILES: Record<Profile['key'], Profile> = {
  planner: {
    key: 'planner',
    title: 'นักวางแผน (Planner)',
    description:
      'นักวางแผนเป็นผู้ที่มีการจัดการทางการเงินอย่างเป็นระบบ มักวางแผนรายรับ–รายจ่ายล่วงหน้า และตัดสินใจใช้เงินบนพื้นฐานของเหตุผลและความจำเป็น มากกว่าความรู้สึกชั่วขณะ บุคคลกลุ่มนี้ให้ความสำคัญกับความมั่นคงทางการเงินในระยะยาว และมักมีเงินสำรองสำหรับเหตุการณ์ฉุกเฉิน',
    strengths: [
      'มีวินัยทางการเงินสูง ควบคุมรายรับ–รายจ่ายได้อย่างมีประสิทธิภาพ',
      'สามารถตั้งเป้าหมายทางการเงินระยะสั้นและระยะยาวได้ชัดเจน',
      'มีความพร้อมรับมือกับเหตุการณ์ฉุกเฉินทางการเงิน',
      'ตัดสินใจใช้เงินอย่างมีเหตุผล ลดความเสี่ยงจากหนี้สิน',
      'มีโอกาสสร้างความมั่นคงทางการเงินในระยะยาวสูง'
    ],
    cautions: [
      'อาจใช้ชีวิตอย่างเคร่งครัดเกินไป ทำให้ขาดความยืดหยุ่น',
      'อาจลังเลในการใช้เงิน แม้เป็นสิ่งที่จำเป็นหรือให้คุณค่าในชีวิต',
      'เสี่ยงต่อการพลาดโอกาสในการลงทุนหรือประสบการณ์ใหม่ ๆ',
      'ความกังวลเรื่องเงินมากเกินไปอาจส่งผลต่อคุณภาพชีวิต'
    ]
  },

  spender: {
    key: 'spender',
    title: 'นักช้อป (Spender)',
    description:
      'นักช้อปเป็นผู้ที่ใช้เงินตามอารมณ์และความพึงพอใจในปัจจุบัน มักตัดสินใจซื้อจากความรู้สึก โปรโมชั่น หรือแรงจูงใจจากสังคม มากกว่าการวางแผนล่วงหน้า การใช้เงินของกลุ่มนี้ช่วยสร้างความสุขในระยะสั้น แต่บางครั้งอาจส่งผลต่อเสถียรภาพทางการเงินในระยะยาว',
    strengths: [
      'ใช้เงินเพื่อสร้างความสุขและแรงจูงใจในการใช้ชีวิต',
      'ตัดสินใจได้รวดเร็ว กล้าใช้จ่ายเมื่อเห็นคุณค่าในปัจจุบัน',
      'ปรับตัวตามเทรนด์และไลฟ์สไตล์ใหม่ ๆ ได้ดี',
      'มักมีความพึงพอใจในชีวิตประจำวันจากการใช้จ่าย',
      'เหมาะกับการใช้เงินด้านประสบการณ์ เช่น ท่องเที่ยว หรือความบันเทิง'
    ],
    cautions: [
      'มีความเสี่ยงสูงต่อการใช้เงินเกินตัว',
      'ขาดการวางแผนและเงินออมในระยะยาว',
      'อาจเกิดภาระหนี้สินจากการใช้จ่ายตามอารมณ์',
      'เมื่อเกิดเหตุฉุกเฉินทางการเงินอาจรับมือได้ยาก',
      'ความสุขจากการใช้เงินอาจอยู่ได้เพียงระยะสั้น'
    ]
  },

  investor: {
    key: 'investor',
    title: 'นักลงทุน (Investor)',
    description:
      'นักลงทุนเป็นผู้ที่มองการใช้เงินเป็นเครื่องมือในการสร้างโอกาสและการเติบโตทางการเงินในอนาคต กลุ่มนี้กล้ายอมรับความเสี่ยงในระดับหนึ่งเพื่อแลกกับผลตอบแทนที่สูงขึ้น มักศึกษาข้อมูล วิเคราะห์แนวโน้ม และตัดสินใจเชิงกลยุทธ์มากกว่าการใช้เงินเพื่อบริโภค',
    strengths: [
      'มองเงินเป็นเครื่องมือสร้างโอกาสและความมั่งคั่ง',
      'กล้ารับความเสี่ยงอย่างมีเป้าหมาย',
      'มีแนวคิดเชิงกลยุทธ์และการวิเคราะห์ข้อมูล',
      'มีโอกาสสร้างรายได้แบบทวีคูณในระยะยาว',
      'เปิดรับการเรียนรู้ด้านการเงินและการลงทุนอย่างต่อเนื่อง'
    ],
    cautions: [
      'ความเสี่ยงจากการลงทุนที่ขาดข้อมูลหรือประเมินผิดพลาด',
      'ความผันผวนของตลาดอาจกระทบสภาพคล่อง',
      'อาจโฟกัสผลตอบแทนมากเกินไปจนละเลยความมั่นคงพื้นฐาน',
      'หากไม่มีการบริหารความเสี่ยง อาจสูญเสียเงินก้อนใหญ่',
      'ความเครียดจากความไม่แน่นอนของผลตอบแทน'
    ]
  },

  saver: {
    key: 'saver',
    title: 'นักออม (Saver)',
    description:
      'นักออมเป็นผู้ที่ให้ความสำคัญกับการเก็บเงินและความปลอดภัยทางการเงิน มักหลีกเลี่ยงความเสี่ยง และใช้เงินอย่างระมัดระวัง บุคคลกลุ่มนี้มีแนวโน้มที่จะมีฐานะทางการเงินที่มั่นคง แต่บางครั้งอาจไม่กล้าใช้เงินเพื่อพัฒนาคุณภาพชีวิตหรือโอกาสใหม่ ๆ',
    strengths: [
      'มีความรอบคอบและระมัดระวังในการใช้เงิน',
      'มีเงินออมและความมั่นคงทางการเงินสูง',
      'สามารถรับมือกับเหตุการณ์ไม่คาดคิดได้ดี',
      'มีวินัยในการใช้จ่ายและการเก็บเงินอย่างสม่ำเสมอ',
      'เหมาะกับการวางแผนชีวิตระยะยาว'
    ],
    cautions: [
      'เงินเติบโตช้าเนื่องจากหลีกเลี่ยงความเสี่ยง',
      'อาจพลาดโอกาสสร้างผลตอบแทนที่สูงกว่า',
      'มีแนวโน้มประหยัดเกินไปจนลดคุณภาพชีวิต',
      'ไม่กล้าใช้เงินเพื่อลงทุนพัฒนาตนเอง',
      'ความกลัวการสูญเสียอาจจำกัดโอกาสในอนาคต'
    ]
  }
  
  
}



/**
 * ✅ เลือกโปรไฟล์จาก “คอมโบ 4 มิติ”
 * หมายเหตุ: ตอนนี้คุณมีคำอธิบาย 4 โปรไฟล์หลัก (Planner/Spender/Investor/Saver)
 * เลยใช้กติกาเลือกแบบชัดเจน:
 * 1) ถ้า V (ชอบลงทุน/เสี่ยง) → Investor
 * 2) ถ้า C และ S → Saver
 * 3) ถ้า P และ R → Planner
 * 4) ไม่เข้าเงื่อนไขข้างบน → Spender
 */
const profile = computed<Profile>(() => {
  const d1 = dim1.value
  const d2 = dim2.value
  const d3 = dim3.value
  const d4 = dim4.value

  // Planner
  if (d1 === 'P' && d2 === 'S' && d3 === 'R') {
    return PROFILES.planner
  }

  // Investor
  if (d4 === 'V' && d3 === 'R') {
    return PROFILES.investor
  }

  // Saver
  if (d2 === 'S' && d4 === 'C') {
    return PROFILES.saver
  }

  // default
  return PROFILES.spender
})

function goBack() {
  router.back()
}
function goHome() {
  router.push('/tabs/home')
}

import { watchEffect } from 'vue'

watchEffect(() => {
  console.log("answers:", answers)
  console.log("code:", code.value)
  console.log("profile:", profile.value)
})
</script>

<style scoped>
.result-bg { --background: #f2f2f2; }

.hero{
  position: relative;
  height: 270px;
  overflow: hidden;
  background: linear-gradient(180deg, #8edbe9 0%, #b9cff7 100%);
}
.hero::before,
.hero::after{
  content:"";
  position:absolute;
  inset:0;
  background:
    radial-gradient(circle at 10% 20%, rgba(255, 205, 86, .9) 0 5px, transparent 6px),
    radial-gradient(circle at 35% 30%, rgba(255, 99, 132, .9) 0 4px, transparent 5px),
    radial-gradient(circle at 70% 25%, rgba(54, 162, 235, .9) 0 4px, transparent 5px),
    radial-gradient(circle at 85% 40%, rgba(153, 102, 255, .9) 0 5px, transparent 6px),
    radial-gradient(circle at 20% 60%, rgba(75, 192, 192, .9) 0 4px, transparent 5px),
    radial-gradient(circle at 60% 65%, rgba(255, 159, 64, .9) 0 5px, transparent 6px);
  opacity:.55;
}
.hero::after{ transform: translateY(18px); opacity:.35; }

.backBtn{
  position:absolute;
  top:18px; left:12px;
  width:40px; height:40px;
  border:none; border-radius:12px;
  background: rgba(255,255,255,.35);
  color:#1f1f1f;
  display:flex; align-items:center; justify-content:center;
  backdrop-filter: blur(6px);
}

.heroCenter{
  position:absolute;
  top:44px; left:0; right:0;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap: 8px;
  z-index:2;
}

.heroTitle{
  font-size:20px;
  font-weight:900;
  color:#1f1f1f;
}

.heroCode{
  font-size:13px;
  font-weight:800;
  color:#1f1f1f;
  padding: 6px 10px;
  margin-bottom: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.35);
  backdrop-filter: blur(6px);
}

.pigWrap{ width:96px; height:64px; display:flex; align-items:center; justify-content:center; }

.pigImg {
  width: 90px;
  height: auto;
  object-fit: contain;
}


.wave{
  position:absolute;
  left:0; right:0; bottom:-1px;
  height: 54px;
  background:#fff;
  border-top-left-radius: 42px;
  border-top-right-radius: 42px;
  z-index:1;
}

.sheet{
  background:#fff;
  padding: 14px 14px 0;
  margin-top:-10px;
}

.sectionTitle{ font-size:14px; font-weight:900; margin-bottom:8px; color:#222; }
.desc{ font-size:13px; color:#4b4b4b; line-height:1.45; margin-bottom: 12px; }

.mini{
  margin: 0 0 12px;
  padding: 10px 12px;
  border: 1px dashed rgba(0,0,0,.12);
  border-radius: 12px;
  background: rgba(0,0,0,.02);
}
.miniTitle{ font-size:12px; font-weight:900; color:#333; margin-bottom:8px; }
.miniRow{ display:flex; flex-wrap:wrap; gap:8px; }
.pill{
  font-size:12px;
  padding: 6px 10px;
  border-radius: 999px;
  background:#fff;
  border: 1px solid rgba(0,0,0,.08);
  color:#333;
}

.card{
  background:#fff;
  border:1px solid rgba(0,0,0,.08);
  border-radius:12px;
  padding:12px 12px 8px;
  margin-bottom:12px;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
}

.cardTitle{ font-weight:900; font-size:13px; margin-bottom:8px; color:#222; }

.list{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }
.list li{ display:flex; align-items:flex-start; gap:10px; }

.icon{
  width:22px; height:22px;
  border-radius:999px;
  display:flex; align-items:center; justify-content:center;
  font-weight:900;
  flex:0 0 22px;
  margin-top:1px;
}
.icon.ok{ background: rgba(34,197,94,.12); color:#16a34a; }
.icon.warn{ background: rgba(245,158,11,.14); color:#d97706; }

.txt{ font-size:13px; color:#444; line-height:1.35; }

.actions{ 
    margin-top: 10px; 
    ;
}
.bottomSpacer{ 
    height: 28px; 
    }
ion-button {
  --background: #76d6ff;
  --color: #fff;
  --border-radius: 8px;.result-bg{
  --background:#f2f2f2;
}

/* ---------------- HERO ---------------- */

.hero{
  position:relative;
  height:240px;
  overflow:hidden;
  background:linear-gradient(135deg,#7dd3fc,#a5b4fc);
}

/* bubble decoration */
.hero::before{
  content:"";
  position:absolute;
  width:280px;
  height:280px;
  border-radius:50%;
  background:rgba(255,255,255,.15);
  top:-120px;
  right:-80px;
}

.hero::after{
  content:"";
  position:absolute;
  width:200px;
  height:200px;
  border-radius:50%;
  background:rgba(255,255,255,.1);
  bottom:-80px;
  left:-60px;
}

/* back button */

.backBtn{
  position:absolute;
  top:18px;
  left:14px;
  width:40px;
  height:40px;
  border:none;
  border-radius:12px;
  background:rgba(255,255,255,.4);
  backdrop-filter:blur(6px);
  display:flex;
  align-items:center;
  justify-content:center;
  color:#1f2937;
}

/* center area */

.heroCenter{
  position:absolute;
  top:70px;
  left:0;
  right:0;
  text-align:center;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:10px;
}

.heroTitle{
  font-size:22px;
  font-weight:900;
  color:#1f2937;
}

.heroCode{
  font-size:12px;
  font-weight:700;
  padding:6px 12px;
  border-radius:999px;
  background:rgba(255,255,255,.4);
  color:#1f2937;
}

/* wave */

.wave{
  position:absolute;
  left:0;
  right:0;
  bottom:-1px;
  height:60px;
  background:#fff;
  border-top-left-radius:40px;
  border-top-right-radius:40px;
}

/* ---------------- CONTENT ---------------- */

.sheet{
  background:#fff;
  padding:18px 16px 0;
  margin-top:-10px;
}

/* section */

.sectionTitle{
  font-size:15px;
  font-weight:900;
  margin-bottom:6px;
}

.desc{
  font-size:14px;
  line-height:1.6;
  color:#555;
  margin-bottom:16px;
}

/* ---------------- CARD ---------------- */

.card{
  background:#fff;
  border-radius:14px;
  padding:14px;
  margin-bottom:14px;
  box-shadow:
    0 4px 12px rgba(0,0,0,.06),
    0 1px 3px rgba(0,0,0,.08);
}

.cardTitle{
  font-size:14px;
  font-weight:900;
  margin-bottom:10px;
}

/* list */

.list{
  list-style:none;
  padding:0;
  margin:0;
  display:flex;
  flex-direction:column;
  gap:12px;
}

.list li{
  display:flex;
  gap:10px;
  align-items:flex-start;
}

/* icon */

.icon{
  width:24px;
  height:24px;
  border-radius:999px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:13px;
  font-weight:800;
}

.icon.ok{
  background:#dcfce7;
  color:#16a34a;
}

.icon.warn{
  background:#fef3c7;
  color:#d97706;
}

/* text */

.txt{
  font-size:13.5px;
  line-height:1.5;
  color:#444;
}

/* ---------------- BUTTON ---------------- */

.actions{
  margin-top:16px;
}

ion-button{
  --background:#38bdf8;
  --border-radius:10px;
  font-weight:700;
}

/* bottom space */

.bottomSpacer{
  height:28px;
}
}
</style>
