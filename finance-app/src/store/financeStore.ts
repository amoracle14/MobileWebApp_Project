import { defineStore } from 'pinia';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    transactions: [] as any[], // เก็บประวัติการใช้จ่ายทั้งหมด
    isLoading: false,
  }),
  
  getters: {
    // คำนวณรายรับรวม
    totalIncome: (state) => {
      return state.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
    },
    // คำนวณรายจ่ายรวม
    totalExpense: (state) => {
      return state.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
    },
    // ยอดเงินคงเหลือ
    netBalance(): number {
      return this.totalIncome - this.totalExpense;
    }
  },
  
  actions: {
    // ฟังก์ชันดูดข้อมูลจาก Firebase ของเพื่อน
    async fetchTransactions() {
      this.isLoading = true;
      try {
        const querySnapshot = await getDocs(collection(db, 'transactions'));
        const data: any[] = [];
        
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        
        this.transactions = data;
        console.log("ดึงข้อมูลจาก DBสำเร็จ!", this.transactions);
      } catch (error) {
        console.error("ดึงข้อมูลไม่ได้:", error);
      } finally {
        this.isLoading = false;
      }
    }
  }
});