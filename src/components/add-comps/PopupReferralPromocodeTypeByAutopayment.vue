<template>
  <Teleport to="body">
    <Transition name="list">
      <div class="referral-promocode-type-by-autopayment"
           v-if="popup.isActive && popup.type === 'referral-promocode-type-by-autopayment'">
        <div class="referral-promocode-type-by-autopayment__container">
          <div class="referral-promocode-type-by-autopayment__form form">
            <button id="input_date"
                    v-for="(value, index) in values"
                    type="button"
                    class="form__button form__button_unbordered"
                    @click="confirm(index as string)">
              {{ value }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {ref, Ref} from "@vue/reactivity";
import {inject, watch} from "@vue/runtime-core";
import {isEmpty} from "lodash";
import {StoreGeneric, storeToRefs} from "pinia";

const store = <StoreGeneric>inject("Store");
const {popup} = storeToRefs(store);

const disabled: Ref<boolean> = ref(false);
const disable: Ref<boolean> = ref(false);
const values: Ref<Record<string, string>> = ref(popup.value.additionFields.values ?? {});

watch(
    popup.value,
    () => {
      if (isEmpty(values.value))
        values.value = popup.value.additionFields.values
    },
    {deep: true,}
)

function confirm(index: string): void {
  if (!disable.value) {
    disabled.value = true;
    popup.value.answer = true;
    popup.value.isReturned = true;
    popup.value.additionFields.selected = index;

    setTimeout(() => {
      disabled.value = false;
    }, 1000);
  }
}
</script>

<style scoped lang="scss">
@import "@styles/_variables.scss";

.referral-promocode-type-by-autopayment {
  position: absolute;
  z-index: 9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 5rem 0 $--c__grey;
  border-radius: 2rem;
  background-color: $--c__white;
  padding: 2rem 10rem;

  &__container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem 2rem;
    position: relative;
    width: 100%;
  }

  &__text {
    margin-bottom: 3rem;
    text-align: center;

    font: {
      family: var(--f__montserrat-sb);
      size: 2rem;
    }
  }

  &__form {
    display: flex;
    width: 100%;
    gap: 2rem;
    align-items: center;

    font: {
      family: var(--f__montserrat-sb);
      size: 2rem;
    }
  }

  .form {
    &__button {
      margin-left: unset;
      font-weight: bold;
    }
  }

  &__wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 4rem;
  }

  &__button {
    background-color: $--c__white;
    border: 0.25rem solid $--c__light-violet;
    padding: 0.6rem 0;
    border-radius: 0.8rem;
    transition: var(--transition-03);
    cursor: pointer;
    flex: 1;

    font: {
      family: var(--f__montserrat-sb);
      size: 1.5rem;
    }

    &:focus,
    &:hover {
      background-color: $--c__violet;
      border-color: $--c__violet;
      color: $--c__white;
    }
  }

  &__close {
    position: absolute;
    top: 0;
    right: 0;
    width: 3rem;
    height: 3rem;
    cursor: pointer;

    svg {
      width: 100%;
      height: 100%;
      fill: $--c__violet;
    }
  }

  @media screen and (max-width: $mobile--breakpoint) {
    position: fixed;
    width: 90%;
    padding: 2rem 0;
    min-width: unset;

    &__input {
      .form__label {
        font: {
          size: 1.8rem;
        }
      }
    }

    &__button {
      padding: 0.6rem 4rem;

      font: {
        size: 1.2rem;
      }
    }
  }
}
</style>