import { defineStore } from 'pinia';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth'; 

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    transactions: [] as any[], // พื้นที่จัดเก็บประวัติการทำธุรกรรมของผู้ใช้งาน
    isLoading: false,
  }),
  
  getters: {
    // ฟังก์ชันคำนวณยอดรวมรายรับ
    totalIncome: (state) => {
      return state.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
    },
    // ฟังก์ชันคำนวณยอดรวมรายจ่าย
    totalExpense: (state) => {
      return state.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
    },
    // ฟังก์ชันคำนวณยอดรวมหนี้สิน
    totalDebt: (state) => {
      return state.transactions
        .filter(t => t.type === 'debt')
        .reduce((sum, t) => sum + Number(t.amount), 0);
    },
    // ฟังก์ชันคำนวณยอดเงินคงเหลือสุทธิ (รายรับ - รายจ่าย - หนี้สิน)
    netBalance(): number {
      return this.totalIncome - this.totalExpense - this.totalDebt;
    }
  },
  
  actions: {
    // ฟังก์ชันสำหรับเรียกข้อมูลธุรกรรมจากฐานข้อมูล โดยกรองตามรหัสประจำตัวผู้ใช้งาน (User ID)
    async fetchTransactions() {
      const auth = getAuth();
      const user = auth.currentUser;

      // ตรวจสอบสถานะการเข้าสู่ระบบ
      if (!user) {
        console.warn("ระบบขัดข้อง: ไม่พบข้อมูลการยืนยันตัวตนของผู้ใช้งาน ระบบได้ยกเลิกการดึงข้อมูล");
        this.transactions = []; // ล้างข้อมูลเดิมเพื่อป้องกันการเข้าถึงข้อมูลที่ไม่ได้รับอนุญาต
        return;
      }

      this.isLoading = true;
      try {
        // สร้างเงื่อนไขในการดึงข้อมูลเฉพาะรายการที่เป็นของผู้ใช้งานปัจจุบัน
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