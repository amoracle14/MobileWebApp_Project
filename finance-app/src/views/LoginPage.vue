<template>
  <ion-page>
    <ion-content class="ion-padding">

      <h2>Login</h2>

      <ion-input
        v-model="email"
        placeholder="Email">
      </ion-input>

      <ion-input
        v-model="password"
        type="password"
        placeholder="Password">
      </ion-input>

      <ion-button expand="full" @click="login">
        Login
      </ion-button>

      <ion-button fill="clear" router-link="/register">
        สมัครสมาชิก
      </ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup>

import { ref } from "vue"
import { useRouter } from "vue-router"

import { signInWithEmailAndPassword } from "firebase/auth"
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

const login = async () => {

  if(!email.value || !password.value){
    alert("กรุณากรอก Email และ Password")
    return
  }

  try {

    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    alert("Login success")

    router.push("/tabs/home")

  } catch(error){

    alert(error.message)

  }

}

</script>