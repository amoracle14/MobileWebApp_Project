import { defineStore } from 'pinia';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
// 🔥 อิมพอร์ต onAuthStateChanged เข้ามาเพิ่ม
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 

// ฟังก์ชันสั่งให้แอปรอ Firebase ยืนยันตัวตนให้เสร็จสมบูรณ์ก่อน
const getCurrentUser = (): Promise<any> => {
  return new Promise((resolve) => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // พอรู้ตัวคนล็อคอินแล้ว ให้เลิกดักฟังเพื่อไม่ให้เปลืองเมมโมรี่
      resolve(user);
    });
  });
};

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    transactions: [] as any[], 
    isLoading: false,
  }),
  
  getters: {
    totalIncome: (state) => state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0),
    totalExpense: (state) => state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0),
    totalDebt: (state) => state.transactions.filter(t => t.type === 'debt').reduce((sum, t) => sum + Number(t.amount), 0),
    netBalance(): number {
      return this.totalIncome - this.totalExpense - this.totalDebt;
    }
  },
  
  actions: {
    async fetchTransactions() {
      // 🔥 เรียกใช้ฟังก์ชันรอการยืนยันตัวตน แทนการดึงตรงๆ
      const user = await getCurrentUser();

      if (!user) {
        console.warn("ระบบขัดข้อง: ไม่พบข้อมูลการยืนยันตัวตนของผู้ใช้งาน ระบบได้ยกเลิกการดึงข้อมูล");
        this.transactions = []; 
        return;
      }

      this.isLoading = true;
      try {
        const q = query(
          collection(db, 'transactions'), 
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const data: any[] = [];
        
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        
        this.transactions = data;
        console.log("การดำเนินการสำเร็จ: ดึงข้อมูลจากฐานข้อมูลเสร็จสิ้น");
      } catch (error) {
        console.error("เกิดข้อผิดพลาดของระบบ: ไม่สามารถดึงข้อมูลจากฐานข้อมูลได้", error);
      } finally {
        this.isLoading = false;
      }
    }
  }
});