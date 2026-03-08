<template>
  <ion-page>
    <ion-content class="login-bg">

      <div class="login-container">


        <div class="login-card">

          <h2>เข้าสู่ระบบ</h2>

          <ion-input
            class="input-box"
            v-model="email"
            placeholder="Email"
            type="email">
          </ion-input>

          <ion-input
            class="input-box"
            v-model="password"
            type="password"
            placeholder="Password">
          </ion-input>

        

          <ion-button expand="block" class="login-btn" @click="login">
            เข้าสู่ระบบ
          </ion-button>

          <div class="divider">
            <span>OR</span>
          </div>

          <ion-button fill="clear" router-link="/register">
            สมัครสมาชิก
          </ion-button>

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>

import { ref } from "vue"
import { useRouter } from "vue-router"

import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase"
import { alertController } from "@ionic/vue"

import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonCheckbox,
  IonIcon
} from "@ionic/vue"

import { walletOutline } from "ionicons/icons"

const email = ref("")
const password = ref("")
const router = useRouter()

const showErrorAlert = async (message) => {

  const alert = await alertController.create({
    header: "ไม่สามารถเข้าสู่ระบบได้",
    message: message,
    buttons: ["OK"]
  })

  await alert.present()

}

const login = async () => {

  if(!email.value || !password.value){
    await showErrorAlert("กรุณากรอก Email และ Password")
    return
  }

  try {

    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    router.push("/tabs/home")

  } catch(error){

    await showErrorAlert("กรุณากรอก Email หรือ Password ให้ถูกต้อง")

  }

}

</script>

<style scoped>

.login-bg{
  --background: linear-gradient(
    160deg,
    #66c7d1,
    #8fa9d8
  );
}

.login-container{
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  height:100%;
}


.login-card{
  width:90%;
  max-width:360px;
  background:white;
  padding:30px 25px;
  border-radius:22px;
  box-shadow:0 10px 30px rgba(0,0,0,0.12);
  text-align:center;
}

.login-card h2{
  color:#2c3e50;
  font-weight:600;
  margin-bottom:25px;
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

.forgot-row{
  width:100%;
  text-align:center;
  margin-top:4px;
  margin-bottom:18px;
}

.forgot{
  font-size:14px;
  color:#4a7bd0;
  cursor:pointer;
}

.login-btn{
  margin-top:5px;
  --border-radius:14px;
  font-weight:600;
  letter-spacing:1px;
}

.divider{
  margin:20px 0 10px 0;
  color:#9aa0a6;
  font-size:14px;
}

ion-button[fill="clear"]{
  font-weight:500;
  color:#4a7bd0;
}

</style>