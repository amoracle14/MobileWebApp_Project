<template>
  <ion-page>
    <ion-content class="ion-padding">

      <h2>Register</h2>

      <ion-input v-model="email" placeholder="Email"></ion-input>

      <ion-input v-model="password" type="password" placeholder="Password"></ion-input>

      <ion-button expand="full" @click="register">
        สมัครสมาชิก
      </ion-button>

      <ion-button fill="clear" router-link="/login">
        กลับไป Login
      </ion-button>

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

const register = async () => {

  try {

    await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    alert("สมัครสำเร็จ")

    router.push("/login")

  } catch(error){

    alert(error.message)

  }

}

</script>