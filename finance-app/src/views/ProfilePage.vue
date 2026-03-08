<template>
  <ion-page>
    <ion-content class="profile-bg">
      <div class="header-container">
        <div class="profile-wrapper">
          

          <div>

            <div class="profile-header">

              <img
                class="avatar"
                :src="avatar"
                @click="openFile"
              />

              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                @change="changeAvatar"
                style="display:none"
              />

              <h2>{{ userName }}</h2>

            </div>

            <div class="profile-card">

              <div class="info-row">
                <span>สถานะ</span>
                สมาชิก
              </div>

              <div class="info-row">
                <span>ผู้ใช้งาน</span>
                {{ userEmail }}
              </div>

            </div>

          </div>

          <ion-button
            expand="block"
            class="logout-btn"
            @click="logout"
          >
            ออกจากระบบ
          </ion-button>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>

import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

import { signOut, onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/firebase"

import { doc, setDoc, getDoc } from "firebase/firestore"

import {
  IonPage,
  IonContent,
  IonButton
} from "@ionic/vue"

const router = useRouter()

const userEmail = ref("")
const userName = ref("ผู้ใช้งาน")

const avatar = ref("/gojo.jpg")
const fileInput = ref(null)

onMounted(() => {

  onAuthStateChanged(auth, async (user) => {

    if (user) {

      userEmail.value = user.email

      if (user.displayName) {
        userName.value = user.displayName
      }

      /* โหลด avatar จาก firestore */

      const docRef = doc(db,"users",user.uid)

      const docSnap = await getDoc(docRef)

      if(docSnap.exists()){

        const data = docSnap.data()

        if(data.avatar){
          avatar.value = data.avatar
        }

      }

    }

  })

})

/* เปิด file picker */

const openFile = () => {

  fileInput.value.click()

}

/* เปลี่ยนรูป */

const changeAvatar = (event) => {

  const file = event.target.files[0]

  if(!file) return

  const reader = new FileReader()

  reader.onload = async () => {

    const base64 = reader.result

    avatar.value = base64

    const user = auth.currentUser

    if(!user) return

    await setDoc(
      doc(db,"users",user.uid),
      {
        email:user.email,
        avatar:base64
      },
      { merge:true }
    )

  }

  reader.readAsDataURL(file)

}



/* logout */

const logout = async () => {

  await signOut(auth)

  router.push("/login")

}

</script>

<style scoped>

.profile-bg{
  --background: linear-gradient(180deg, #74d7e9 0%, #bff0f3 60%, #b2cff4 100%);
}



.profile-wrapper{
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  min-height:100%;
  padding:24px;
}

.profile-header{
  text-align:center;
  margin-top:20px;
}

.avatar{
  width:90px;
  height:90px;
  border-radius:50%;
  margin-bottom:10px;
  cursor:pointer;
}

.profile-card{
  background:white;
  margin-top:25px;
  border-radius:18px;
  padding:18px;
  box-shadow:0 6px 16px rgba(0,0,0,0.08);
}

.info-row{
  display:flex;
  justify-content:space-between;
  padding:12px 0;
  border-bottom:1px solid #eee;
  font-size: larger;
}

.info-row:last-child{
  border-bottom:none;
}

.logout-btn{
  --background:#ff4d4f;
  --border-radius:14px;
  margin-top:200px;
}

</style>