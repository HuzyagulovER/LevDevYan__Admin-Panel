<template>
  <section class="referral-promocode">
    <form class="referral-promocode___form form" @submit.prevent="savePromocode">
      <div class="form__row">
        <div class="form__col">
          <label for="promocode" class="form__label">Название</label>
          <input id="promocode"
                 type="text"
                 maxlength="20"
                 class="form__input"
                 :class="{ _error: errors.includes('promocode') }"
                 name="promocode"
                 :disabled="disabledForm"
                 v-model="promocode.code"
                 @input="clearErrors"
          />
        </div>
        <div class="form__col">
          <label for="chained_with" class="form__label">Привязан</label>
          <input id="chained_with"
                 type="text"
                 maxlength="64"
                 class="form__input"
                 :class="{ _error: errors.includes('chained_with') }"
                 name="chained_with"
                 :disabled="disabledForm"
                 v-model="promocode.chained_with"
                 @input="clearErrors"
          />
        </div>
      </div>
      <div class="form__row">
        <div class="form__col">
          <label for="description" class="form__label">Дополнительная информация</label>
          <textarea id="description"
                    maxlength="512"
                    class="form__textarea"
                    :class="{ _error: errors.includes('description') }"
                    name="description"
                    :disabled="disabledForm"
                    v-model="promocode.description"
                    @input="clearErrors"
          />
        </div>
      </div>
      <!--      <label for="type" class="form__label">Тип</label>-->
      <!--      <input id="type" type="text" class="form__input" :class="{ _error: error.includes('value') }" name="type"-->
      <!--             :disabled="disabledForm" v-model="newPromocode.value" @input="error = clearVariable(error)" />-->
      <!--      <label for="value" class="form__label">Значение</label>-->
      <!--      <input id="value" type="text" class="form__input" :class="{ _error: error.includes('type') }" name="value"-->
      <!--             :disabled="disabledForm" v-model="newPromocode.type" @input="error = clearVariable(error)" />-->

      <ButtonColored type="submit" :disabled="disabledForm"></ButtonColored>
    </form>
  </section>
</template>

<script setup lang="ts">
import {inject, Ref, ref, computed, ComputedRef} from "@vue/runtime-core";
import {StoreGeneric, storeToRefs} from "pinia";
import {
  ReferralPromocode,
  ReturnedData,
  ReturnedError,
} from "../../helpers";
import {cloneDeep, isEmpty} from "lodash";
import ButtonColored from "@add-comps/ButtonColored.vue";
import router from "../routes";
import {useRoute} from "vue-router";

const store = <StoreGeneric>inject("Store");
const {loading} = storeToRefs(store);
const route = useRoute();
const clearVariable = <Function>inject("clearVariable");
const defaultReferralPromocode: ReferralPromocode = {
  id: '',
  code: '',
  chained_with: '',
  description: '',
};

const promocode: Ref<ReferralPromocode> = ref(defaultReferralPromocode);
const isNew: ComputedRef<boolean> = computed(() => isEmpty(route.params.id));
const errors: Ref<Array<string>> = ref([]);
const disabledForm: Ref<boolean> = ref(false);

if (!isNew.value) {
  getReferralPromocode();
}

function getReferralPromocode(): void {
  loading.value = true;

  store.getReferralPromocode(route.params.id)
      .then((r: ReferralPromocode) => {
        promocode.value = cloneDeep(r);
        loading.value = false;
      });
}

function savePromocode(): void {
  disabledForm.value = false;

  if (isNew.value) {
    store.createReferralPromocode(restrictObject(promocode.value, defaultReferralPromocode))
        .then((r: ReturnedData | ReturnedError) => returnHandler(r))
  } else {
    store.updateReferralPromocode(promocode.value.id, restrictObject(promocode.value, defaultReferralPromocode))
        .then((r: ReturnedData | ReturnedError) => returnHandler(r))
  }
}

function returnHandler(r: ReturnedData | ReturnedError) {
  disabledForm.value = false;
  loading.value = false;

  if (r.success) {
    promocode.value = clearVariable(promocode.value);
    router.push({name: "PromocodesReferral"});
  } else {
    errors.value = r.error.status;

    setTimeout(() => {
      errors.value = [];
    }, 2000);
  }
}

function clearErrors() {
  errors.value = clearVariable(errors.value)
}

function restrictObject(toRestrict: Record<string | number, any>, restrictBy: Record<string | number, any>, byKey: boolean = true): Record<string | number, any> {
  if (byKey) {
    const extraKeys = Object.keys(toRestrict).filter((r: string): boolean => !Object.keys(restrictBy).includes(r));

    extraKeys.forEach((r: string) => {
      delete toRestrict[r];
    });
  }

  return toRestrict;
}
</script>

<style scoped lang="scss">
@import "@styles/_variables.scss";

.referral-promocode {
  .form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 1000px;
    width: 100%;
  }

  @media screen and (max-width: $mobile--breakpoint) {
    .form {
      .file-input {
        border-width: 0.3rem;
        height: 18rem;
      }

      &__label {
        font-size: 2rem;
      }

      &__input {
        height: unset;
        padding: 0.5rem 1.2rem;
        font-size: 1.8rem;
        margin-bottom: 0;
      }

      input + label {
        margin-top: 1.3rem;
      }

      button {
        margin-top: 2rem;
      }
    }
  }
}
</style>