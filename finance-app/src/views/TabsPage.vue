<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="้home" href="/tabs/Home">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label>หน้าหลัก</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="transaction" href="/tabs/Transactions">
          <ion-icon aria-hidden="true" :icon="gridOutline" />
          <ion-label>รายการ</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="summary" href="/tabs/Summary">
          <ion-icon aria-hidden="true" :icon="calendar" />
          <ion-label>สรุปรายวัน</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="habbit" href="/tabs/Habits">
          <ion-icon aria-hidden="true" :icon="syncCircle" />
          <ion-label>พฤติกรรม</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/Profile">
          <ion-icon aria-hidden="true" :icon="person" />
          <ion-label>ฉัน</ion-label>
        </ion-tab-button>

        
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>


<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, IonList } from '@ionic/vue';
import { gridOutline, calendar, ellipse, home, list, listCircle, listSharp, logoTableau, micCircle, people, person, square, syncCircle, tabletLandscape, tabletLandscapeSharp, tabletPortraitSharp, triangle, grid } from 'ionicons/icons';
import Tab1Page from './Tab1Page.vue';
</script>



