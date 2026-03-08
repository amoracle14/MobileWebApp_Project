<template>
  <ion-page>
    <ion-content class="register-bg">

      <div class="register-container">

        <div class="register-card">

          <h2>สมัครสมาชิก</h2>

          <ion-input
            class="input-box"
            v-model="email"
            type="email"
            placeholder="Email">
          </ion-input>

          <ion-input
            class="input-box"
            v-model="password"
            type="password"
            placeholder="Password">
          </ion-input>

          <ion-button
            expand="block"
            class="register-btn"
            @click="register">
            สมัครสมาชิก
          </ion-button>

          <div class="divider">
            <span>OR</span>
          </div>

          <ion-button
            fill="clear"
            router-link="/login"
            class="back-login">
            กลับไป เข้าสู่ระบบ
          </ion-button>

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>

import { ref } from "vue"
import { useRouter } from "vue-router"

import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase"

import {
  IonPage,
  IonContent,
  IonInput,
  IonButton
} from "@ionic/vue"

const email = ref("")
const password = ref("")
const router = useRouter()

import { alertController } from "@ionic/vue"

const showAlert = async (message) => {

  const alert = await alertController.create({
    header: "แจ้งเตือน",
    message: message,
    buttons: ["OK"]
  })

  await alert.present()

}

const register = async () => {

  if(!email.value || !password.value){
    await showAlert("กรุณากรอก Email และ Password ให้ถูกต้อง")
    return
  }

  try {

    await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    await showAlert("สมัครสำเร็จ")

    router.push("/login")

  } catch(error){

    await showAlert("ไม่สามารถสมัครสมาชิกได้")

  }

}

</script>

<style scoped>

.register-bg{
  --background: linear-gradient(
    160deg,
    #66c7d1,
    #8fa9d8
  );
}

.register-container{
  display:flex;
  justify-content:center;
  align-items:center;
  height:100%;
}

.register-card{
  width:90%;
  max-width:360px;
  background:white;
  padding:30px 25px;
  border-radius:22px;
  box-shadow:0 10px 30px rgba(0,0,0,0.12);
  text-align:center;
}

.register-card h2{
  color:#2c3e50;
  margin-bottom:25px;
  font-weight:600;
}

.input-box{
  margin-bottom:16px;
  --background:#f1f4f7;
  border-radius:12px;

  --padding-start:16px;   /* padding ซ้าย */
  --padding-end:16px;

  text-align:left;
  --color:#333;
}

ion-input::part(native){
  text-align:left;
}

.register-btn{
  margin-top:10px;
  --border-radius:14px;
  font-weight:600;
  letter-spacing:0.5px;
}

.divider{
  margin:18px 0 8px 0;
  color:#9aa0a6;
  font-size:14px;
}

.back-login{
  color:#4a7bd0;
  font-weight:500;
}

</style>