<template>
  <ion-page>
    <ion-content :fullscreen="true" class="content-bg">
      
      <div class="header-container">
        <div class="header-top">
            <ion-button fill="clear" class="back-btn" @click="goBack">
              <ion-icon :icon="arrowBack" slot="icon-only" color="dark"></ion-icon>
            </ion-button>
        </div>

        <div class="persona-header text-center">
            <div class="avatar-glow">
              <img src="/gojo.jpg" alt="AI Avatar" />
            </div>
            <h1 class="persona-title">
              {{ !hasAnalyzed ? 'AI Assistant' : (isLoading ? 'Analyzing...' : aiResult.personaName) }}
            </h1>
            <p class="persona-subtitle">ผู้ช่วยวิเคราะห์พฤติกรรมการใช้จ่าย</p>
        </div>
      </div>

      <div class="main-content-container">
        
        <div v-if="!hasAnalyzed && !isLoading" class="pre-analysis-container">
            <h3 class="section-title">ข้อมูลพื้นฐานของคุณ</h3>
            
            <ion-card class="basic-stat-card">
              <ion-card-content>
                <ion-grid>
                  <ion-row>
                    <ion-col size="6" class="stat-box">
                      <p class="stat-label">รายรับรวม</p>
                      <h3 class="stat-value text-success">฿{{ formatMoney(financeStore.totalIncome) }}</h3>
                    </ion-col>
                    <ion-col size="6" class="stat-box">
                      <p class="stat-label">รายจ่ายรวม</p>
                      <h3 class="stat-value text-danger">฿{{ formatMoney(financeStore.totalExpense) }}</h3>
                    </ion-col>
                    <ion-col size="6" class="stat-box">
                      <p class="stat-label">หนี้สินรวม</p>
                      <h3 class="stat-value text-warning">฿{{ formatMoney(financeStore.totalDebt) }}</h3>
                    </ion-col>
                    <ion-col size="6" class="stat-box">
                      <p class="stat-label">เงินคงเหลือ</p>
                      <h3 class="stat-value text-primary">฿{{ formatMoney(financeStore.netBalance) }}</h3>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-card-content>
            </ion-card>

            <div class="action-wrapper text-center ion-margin-top">
              <p class="text-muted">ให้ระบบ AI ช่วยวิเคราะห์เชิงลึกและวางแผนการเงินจากข้อมูลเหล่านี้ไหม?</p>
              <ion-button expand="block" shape="round" class="ai-btn ion-margin-top" @click="generateAIAnalysis">
                 <ion-icon :icon="sparkles" slot="start"></ion-icon>
                 วิเคราะห์ข้อมูลด้วย AI
              </ion-button>
            </div>
        </div>

        <div v-else-if="isLoading" class="loading-container text-center">
            <ion-spinner name="crescent" color="primary" class="loading-spinner"></ion-spinner>
            <p class="loading-text">ระบบ AI กำลังประมวลผลข้อมูลทางการเงิน...</p>
        </div>

        <div v-else>
            <ion-card class="score-card">
                <ion-card-content>
                <ion-grid>
                    <ion-row class="ion-align-items-center">
                    <ion-col size="8">
                        <h3>ดัชนีสุขภาพทางการเงิน</h3>
                        <p class="text-muted">สถานะ: {{ aiResult.status }}</p>
                    </ion-col>
                    <ion-col size="4" class="text-right">
                        <div class="score-circle" :class="getScoreColor(aiResult.score)">
                            {{ aiResult.score }}
                        </div>
                    </ion-col>
                    </ion-row>
                    <p class="score-desc">{{ aiResult.scoreDesc }}</p>
                    <ion-progress-bar :value="aiResult.score / 10" :color="getProgressBarColor(aiResult.score)" class="ion-margin-top"></ion-progress-bar>
                </ion-grid>
                </ion-card-content>
            </ion-card>

            <h3 class="section-title">บทวิเคราะห์เชิงลึก (AI Insights) <ion-icon :icon="analytics" color="primary"></ion-icon></h3>
            
            <ion-card class="insight-card">
                <ion-card-content>
                <ion-item lines="none" class="insight-item">
                    <ion-icon :icon="alertCircle" slot="start" color="danger"></ion-icon>
                    <ion-label class="ion-text-wrap">
                    <h2>{{ aiResult.warningTitle }}</h2>
                    <p>{{ aiResult.warningDesc }}</p>
                    </ion-label>
                </ion-item>
                
                <div class="divider"></div>

                <ion-item lines="none" class="insight-item">
                    <ion-icon :icon="thumbsUp" slot="start" color="success"></ion-icon>
                    <ion-label class="ion-text-wrap">
                    <h2>{{ aiResult.strengthTitle }}</h2>
                    <p>{{ aiResult.strengthDesc }}</p>
                    </ion-label>
                </ion-item>
                </ion-card-content>
            </ion-card>

            <div v-if="showActionPlan && aiResult.actionTitle !== '-'">
                <h3 class="section-title">ข้อเสนอแนะเชิงกลยุทธ์ (Action Plan) <ion-icon :icon="flag" color="dark"></ion-icon></h3>
                <ion-card class="mission-card">
                    <ion-card-header>
                    <ion-card-subtitle>คำแนะนำจากระบบ AI</ion-card-subtitle>
                    <ion-card-title>{{ aiResult.actionTitle }}</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                    <p>{{ aiResult.actionDesc }}</p>
                    <ion-button expand="block" color="light" class="ion-margin-top action-btn" shape="round" @click="acceptMission">
                        <ion-icon slot="start" :icon="checkmarkCircle"></ion-icon>
                        รับทราบข้อเสนอแนะ
                    </ion-button>
                    </ion-card-content>
                </ion-card>
            </div>

            <div v-if="savedGoals.length > 0" class="ion-margin-top" style="margin-bottom: 40px;">
                <h3 class="section-title">เป้าหมายที่บันทึกไว้ (My Goals) <ion-icon :icon="star" color="warning"></ion-icon></h3>
                <ion-card v-for="(goal, index) in savedGoals" :key="index" class="saved-goal-card">
                    <ion-item lines="none">
                        <ion-icon :icon="checkmarkCircle" slot="start" color="success"></ion-icon>
                        <ion-label class="ion-text-wrap">
                            <h2>{{ goal.title }}</h2>
                            <p>{{ goal.desc }}</p>
                        </ion-label>
                        <ion-button fill="clear" color="medium" slot="end" @click="removeGoal(index)">
                            <ion-icon :icon="trashOutline" slot="icon-only"></ion-icon>
                        </ion-button>
                    </ion-item>
                </ion-card>
            </div>
            
            <div class="text-center" style="margin-bottom: 40px;">
                <ion-button fill="clear" color="medium" @click="resetAnalysis">
                    วิเคราะห์ใหม่อีกครั้ง
                </ion-button>
            </div>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, IonContent, IonSpinner,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonGrid, IonRow, IonCol, IonProgressBar, IonIcon, 
  IonItem, IonLabel, IonButton, toastController 
} from '@ionic/vue';
import { 
  analytics, alertCircle, thumbsUp, flag, 
  checkmarkCircle, arrowBack, star, trashOutline,
  sparkles
} from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useFinanceStore } from '../store/financeStore';

const router = useRouter();
const financeStore = useFinanceStore();

const goBack = () => {
  router.push('/tabs/habits'); 
};

// ตัวแปรควบคุมสถานะหน้าจอ
const hasAnalyzed = ref(false); 
const isLoading = ref(false); 
const showActionPlan = ref(true); 

// ตัวแปรสำหรับเก็บรายการเป้าหมายที่กดรับทราบแล้ว
const savedGoals = ref<{title: string, desc: string}[]>([]);

const aiResult = ref({
    personaName: '-',
    score: 0,
    status: '-',
    scoreDesc: '-',
    warningTitle: '-',
    warningDesc: '-',
    strengthTitle: '-',
    strengthDesc: '-',
    actionTitle: '-',
    actionDesc: '-'
});

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// พจนานุกรมแปลภาษาหมวดหมู่
const categoryMap: Record<string, string> = {
  'food': 'ค่าอาหาร',
  'travel': 'ค่าเดินทาง',
  'personal': 'ของใช้ส่วนตัว',
  'shopping': 'ช้อปปิ้ง',
  'salary': 'ค่าจ้าง / งานพิเศษ',
  'credit': 'หนี้บัตรเครดิต',
  'credit_card_debt': 'หนี้บัตรเครดิต',
  'parttime': 'รับจ๊อบพิเศษ'
};

// ฟังก์ชันแปลงตัวเลขให้มีคอมม่า (เช่น 1,000)
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('th-TH').format(amount || 0);
};

onMounted(async () => {
    // โหลดเป้าหมายที่เคยบันทึกไว้
    const storedGoals = localStorage.getItem('ai_saved_goals');
    if (storedGoals) {
        savedGoals.value = JSON.parse(storedGoals);
    }

    // ถ้ายังไม่มีข้อมูลให้ดึงมาก่อน แต่ *ไม่สั่ง AI ทำงาน* ปล่อยให้ผู้ใช้ดูข้อมูลเฉยๆ ก่อน
    if (financeStore.transactions.length === 0) {
        await financeStore.fetchTransactions();
    }
});

// ฟังก์ชันเริ่มทำงานเมื่อกดปุ่ม "วิเคราะห์ด้วย AI"
const generateAIAnalysis = async () => {
    hasAnalyzed.value = true;
    isLoading.value = true;
    showActionPlan.value = true; 
    try {
        if (!apiKey) {
            throw new Error('ไม่พบ VITE_GEMINI_API_KEY ในไฟล์ .env');
        }

        const allTxs = financeStore.transactions;
        const income = financeStore.totalIncome;
        const expense = financeStore.totalExpense;
        const debt = financeStore.totalDebt;
        const balance = financeStore.netBalance;
        
        const outflows = allTxs.filter((t: any) => t.type === 'expense' || t.type === 'debt');
        const grouped = outflows.reduce((acc: any, curr: any) => {
            const rawCat = String(curr.category || 'อื่นๆ');
            const displayCat = categoryMap[rawCat.toLowerCase().trim()] || rawCat;
            acc[displayCat] = (acc[displayCat] || 0) + Number(curr.amount);
            return acc;
        }, {});

        const promptText = `
        คุณคือผู้เชี่ยวชาญและที่ปรึกษาด้านการเงินระดับมืออาชีพ กรุณาวิเคราะห์พฤติกรรมการใช้จ่ายจากข้อมูลต่อไปนี้ เพื่อนำไปประกอบรายงานเชิงวิชาการ:
        - รายรับรวม: ${income} บาท
        - รายจ่ายรวม: ${expense} บาท
        - หนี้สินรวม: ${debt} บาท
        - เงินคงเหลือ: ${balance} บาท
        - สัดส่วนเงินที่จ่ายออก (รวมรายจ่ายและหนี้): ${JSON.stringify(grouped)}

        กรุณาวิเคราะห์และตอบกลับมาเป็นรูปแบบ JSON เท่านั้น ห้ามมีข้อความอื่นผสม (ไม่ต้องมี markdown \`\`\`json) โดยมีโครงสร้างดังนี้:
        {
            "personaName": "ตั้งชื่อกลุ่มพฤติกรรมทางการเงินแบบเป็นทางการ (เช่น กลุ่มจัดการหนี้สิน, กลุ่มเฝ้าระวังรายจ่าย, กลุ่มวางแผนการลงทุน)",
            "score": "ให้คะแนนสุขภาพการเงิน 0-10 (เป็นตัวเลขเท่านั้น)",
            "status": "สถานะทางการเงิน (เช่น ดีเยี่ยม, ปานกลาง, ต้องปรับปรุง)",
            "scoreDesc": "สรุปภาพรวมสุขภาพทางการเงินสั้นๆ 1 ประโยค ด้วยภาษาทางการ",
            "warningTitle": "ชื่อหัวข้อความเสี่ยงทางการเงินที่พบ (เน้นเรื่องหนี้สินถ้ายอดสูง)",
            "warningDesc": "อธิบายความเสี่ยงและผลกระทบอย่างเป็นเหตุเป็นผล",
            "strengthTitle": "ชื่อหัวข้อจุดแข็งทางการเงิน",
            "strengthDesc": "อธิบายจุดแข็งพร้อมเหตุผลประกอบ",
            "actionTitle": "ข้อเสนอแนะเชิงกลยุทธ์ 1 ข้อ",
            "actionDesc": "แนวทางปฏิบัติที่สามารถวัดผลได้ เพื่อพัฒนาสุขภาพทางการเงิน"
        }
        `;

        // สังเกตว่าพี่ปรับมาใช้ flash-lite ให้เลย จะได้เซฟโควต้า!
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            if (response.status === 429) {
                throw new Error('โควต้า AI เต็มชั่วคราว โปรดรอสัก 1 นาทีแล้วลองใหม่');
            }
            throw new Error(`การเชื่อมต่อล้มเหลว: ${errorDetails.error?.message || 'โปรดตรวจสอบ API Key'}`);
        }

        const data = await response.json();
        let aiText = data.candidates[0].content.parts[0].text;
        
        aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        aiResult.value = JSON.parse(aiText);

    } catch (error: any) {
        console.error("Error generating AI analysis:", error);
        aiResult.value = {
            personaName: 'ข้อผิดพลาดของระบบ',
            score: 0,
            status: 'เชื่อมต่อล้มเหลว',
            scoreDesc: error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์',
            warningTitle: 'ปัญหาการดึงข้อมูล',
            warningDesc: error.message || 'ไม่สามารถติดต่อปัญญาประดิษฐ์ได้ โปรดตรวจสอบการตั้งค่า',
            strengthTitle: '-',
            strengthDesc: '-',
            actionTitle: 'แนวทางการแก้ไข',
            actionDesc: 'โปรดลองใหม่อีกครั้งในภายหลัง'
        };
    } finally {
        isLoading.value = false;
    }
};

const resetAnalysis = () => {
    hasAnalyzed.value = false;
};

const acceptMission = async () => {
    savedGoals.value.push({
        title: aiResult.value.actionTitle,
        desc: aiResult.value.actionDesc
    });

    localStorage.setItem('ai_saved_goals', JSON.stringify(savedGoals.value));
    showActionPlan.value = false; 

    const toast = await toastController.create({
        message: 'บันทึกเป้าหมายลงคลังเรียบร้อยแล้ว!',
        duration: 2500,
        position: 'bottom',
        color: 'success',
        icon: checkmarkCircle
    });
    await toast.present();
};

const removeGoal = (index: number) => {
    savedGoals.value.splice(index, 1);
    localStorage.setItem('ai_saved_goals', JSON.stringify(savedGoals.value));
};

const getScoreColor = (score: number) => {
    if (score >= 8) return 'score-excellent';
    if (score >= 5) return 'score-moderate';
    return 'score-poor';
};

const getProgressBarColor = (score: number) => {
    if (score >= 8) return 'success';
    if (score >= 5) return 'warning';
    return 'danger';
};
</script>

<style scoped>
.content-bg { --background: #f8f9fa; }

/* 1. Header Styling */
.header-container {
  background: linear-gradient(90deg, #74d7e9 0%, #bff0f3 60%, #b2cff4 100%);
  padding: 20px 20px 60px 20px;
  border-radius: 0 0 25px 25px;
  position: relative;
}

.header-top { height: 40px; position: relative; }

.back-btn {
    position: absolute; top: 0; left: -10px;
    z-index: 100; --padding-start: 10px;
}

.persona-header { margin-top: 10px; }

.avatar-glow {
    display: flex; justify-content: center; margin-bottom: 10px;
}

.avatar-glow img {
  border-radius: 50%; background: white; padding: 5px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  width: 80px; height: 80px; object-fit: cover;
}

.persona-title {
  font-weight: 800; font-size: 1.5rem; color: #2d3436;
  margin-top: 15px; margin-bottom: 5px;
  text-transform: uppercase; letter-spacing: 1px;
}
.persona-subtitle { color: #555; font-size: 0.9rem; margin: 0; font-weight: 500; }

/* Main Content */
.main-content-container {
    padding: 0 20px; margin-top: -40px; position: relative; z-index: 10;
}

/* 🟢 Pre-Analysis Container (หน้าใหม่) */
.pre-analysis-container {
    margin-top: 20px;
}
.basic-stat-card {
    border-radius: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.08); margin-inline: 0;
}
.stat-box {
    text-align: center;
    padding: 15px 5px;
    border-bottom: 1px solid #f1f2f6;
}
.stat-box:nth-child(1), .stat-box:nth-child(3) { border-right: 1px solid #f1f2f6; }
.stat-box:nth-child(3), .stat-box:nth-child(4) { border-bottom: none; }

.stat-label { color: #636e72; font-size: 0.85rem; margin-bottom: 5px; margin-top: 0; }
.stat-value { font-weight: bold; font-size: 1.2rem; margin: 0; }
.text-success { color: #00b894; }
.text-danger { color: #ff7675; }
.text-warning { color: #fdcb6e; }
.text-primary { color: #0984e3; }

.ai-btn { --background: linear-gradient(90deg, #74d7e9 0%, #b2cff4 100%); font-weight: bold; color: #2d3436; height: 50px; }
.text-muted { color: #888; font-size: 0.9rem; margin-top: 20px; }

/* Loading Spinner */
.loading-container {
    background: white; border-radius: 16px; padding: 50px 20px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.08); margin-top: 20px;
}
.loading-spinner { transform: scale(1.5); margin-bottom: 20px; }
.loading-text { color: #636e72; font-weight: 500; font-size: 0.9rem; }

/* Score Card */
.score-card {
  border-radius: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.08); margin-bottom: 25px; margin-inline: 0;
}
.score-circle {
  width: 50px; height: 50px; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; float: right; font-size: 1.1rem; color: white;
}
.score-excellent { background: #00b894; }
.score-moderate { background: #fdcb6e; color: #2d3436; }
.score-poor { background: #ff7675; }

.score-desc { font-size: 0.8rem; color: #888; margin-top: 5px; margin-bottom: 0; }

/* Titles */
.section-title {
  margin-left: 5px; margin-top: 20px; font-weight: bold; color: #2d3436;
  display: flex; align-items: center; gap: 8px; font-size: 1.1rem;
}

/* Insight Card */
.insight-card {
  border-radius: 16px; border-left: 5px solid #0984e3;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-inline: 0;
}
.divider { height: 1px; background: #eee; margin: 10px 20px; }
.insight-item h2 { font-weight: bold; font-size: 0.95rem; color: #333; }
.insight-item p { font-size: 0.85rem; color: #636e72; line-height: 1.4; }

/* Mission Card */
.mission-card {
  background: linear-gradient(135deg, #2d3436 0%, #1a1a1a 100%);
  color: white; border-radius: 16px; margin-inline: 0; margin-bottom: 20px;
}
.mission-card ion-card-subtitle { color: #fdcb6e; opacity: 1; font-weight: 600; }
.mission-card ion-card-title { color: white; font-weight: bold; font-size: 1.2rem; line-height: 1.4; }
.mission-card p { opacity: 0.9; font-size: 0.9rem; margin-top: 10px; }
.action-btn { --color: #2d3436; font-weight: bold; }

/* Saved Goal Card */
.saved-goal-card {
  border-radius: 12px;
  border-left: 4px solid #00b894;
  margin-inline: 0;
  margin-bottom: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.04);
}
.saved-goal-card h2 {
  font-weight: bold;
  font-size: 0.95rem;
  color: #2d3436;
  margin-bottom: 4px;
}
.saved-goal-card p {
  font-size: 0.85rem;
  color: #636e72;
  line-height: 1.4;
}
</style>