<template>
  <div class="referral-promocodes">
    <div class="referral-promocodes__subtop-line subtop-line">
      <ButtonCreate :to="{name: 'ReferralPromocodesCreate' }" class="subtop-line__button-create">
        Создать подписку
      </ButtonCreate>
    </div>

    <div class="referral-promocodes__empty" v-if="isEmpty">
      <img
          src="@images/Promocodes__Empty-Promocodes.png"
          alt=""
          width="256"
          height="256"
      />
      <p>Промокодов еще нет...</p>
    </div>
    <TransitionGroup tag="div" name="list" v-else>
      <ReferralPromocodesPromocodeItem
          v-for="promocode in promos"
          :key="promocode['id' as keyof ReferralPromocode]"
          :promocode="promocode"
          class="referral-promocodes__promocode"
          @confirm-deleting="confirmDeletingActive"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import ButtonCreate from "@/components/add-comps/ButtonCreate.vue";
import ReferralPromocodesPromocodeItem from "@for-promo/ReferralPromocodesPromocodeItem.vue";
import {inject, Ref, ref, computed, ComputedRef} from "@vue/runtime-core";
import {StoreGeneric, storeToRefs} from "pinia";
import {
  ReferralPromocode,
  ReferralPromocodes,
  ReturnedData,
  ReturnedError,
} from "../../helpers";
import {cloneDeep} from "lodash";

const store = <StoreGeneric>inject("Store");
const {loading} = storeToRefs(store);

const promos: Ref<ReferralPromocodes> = ref({});
const isEmpty: ComputedRef<boolean> = computed(() => promos.value && !Object.keys(promos.value).length && !loading.value);

let deletePromocode: Ref<string> = ref("");

getReferralPromocodes();

function getReferralPromocodes(): void {
  loading.value = true;
  store.getReferralPromocodes().then((r: ReferralPromocodes) => {
    promos.value = cloneDeep(r);
    loading.value = false;
  });
}

async function confirmDeletingActive(id: string) {
  deletePromocode.value = id;
  await store.callPopup("Удалить этот промокод?").then((r: boolean) => {
    if (r)
      store
          .deleteReferralPromocode(deletePromocode.value)
          .then((r: ReturnedData | ReturnedError) => {
            if (r.success && r.data.is_deleted) {
              getReferralPromocodes();
            }
            deletePromocode.value = "";
          });
  });
}
</script>

<style scoped lang="scss">
.referral-promocodes {
  flex: 1;
  display: flex;
  flex-direction: column;

  .subtop-line {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    height: 3.3rem;

    &__button-create {
      margin-left: auto;
      align-self: stretch;
    }
  }

  &__empty {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
      width: 20rem;
      height: auto;
    }

    p {
      font: {
        size: 1.9rem;
        weight: bold;
      }
    }
  }
}
</style>