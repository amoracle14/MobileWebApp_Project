<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>บัญชีรายรับ - รายจ่าย หนี้สิน</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-segment value="expense">
  <ion-segment-button value="income">
    <ion-label>รายรับ</ion-label>
  </ion-segment-button>

  <ion-segment-button value="expense">
    <ion-label>รายจ่าย</ion-label>
  </ion-segment-button>

  <ion-segment-button value="debt">
    <ion-label>หนี้</ion-label>
  </ion-segment-button>
</ion-segment>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/vue'

</script>
