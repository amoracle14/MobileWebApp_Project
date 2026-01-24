<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="้home" href="/tabs/Home">
          <ion-icon aria-hidden="true" :icon="triangle" />
          <ion-label>หน้าหลัก</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="transaction" href="/tabs/Transactions">
          <ion-icon aria-hidden="true" :icon="ellipse" />
          <ion-label>รายการ</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="summary" href="/tabs/Summary">
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>สรุปรายวัน</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="habbit" href="/tabs/Habits">
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>พฤติกรรม</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/Profile">
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>ฉัน</ion-label>
        </ion-tab-button>

        
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { ellipse, square, triangle } from 'ionicons/icons';
</script>
