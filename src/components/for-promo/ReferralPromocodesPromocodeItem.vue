<template>
  <div class="referral-promocode">
    <div class="referral-promocode__container">
      <div class="referral-promocode__wrapper referral-promocode__wrapper_main">
        <div class="referral-promocode__item referral-promocode__item_promocode">
          <p>{{ promocode.code }}</p>
        </div>
        <div class="referral-promocode__item referral-promocode__item_highlight">
          <p>{{ promocode.chained_with }}</p>
        </div>
        <div class="referral-promocode__item referral-promocode__item_highlight">
          <p>Использовано: {{ promocode.referred_count }}</p>
        </div>
        <div class="referral-promocode__item referral-promocode__item_highlight">
          <p>Текущий месяц: {{ promocode.referred_last_month_count }}</p>
        </div>
      </div>
      <div class="referral-promocode__wrapper referral-promocode__wrapper_buttons">
        <RouterLink :to="{name: 'ReferralPromocodesShow', params: {id: promocode.id} }" class="referral-promocode__show">
          <IconEye />
        </RouterLink>
        <div class="referral-promocode__edit">
          <ButtonEditPencil :to="{name: 'ReferralPromocodesCreateEdit', params: {id: promocode.id} }"/>
        </div>
        <div class="referral-promocode__delete">
          <IconTrash @click="confirmDeleting" class="icon-trash"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {inject} from "@vue/runtime-core";
import {StateTree} from "pinia";
import {ReferralPromocode} from "../../../helpers";
import IconEye from "@add-comps/icons/IconEye.vue";
import IconTrash from "@add-comps/icons/IconTrash.vue";
import ButtonEditPencil from "@add-comps/ButtonEditPencil.vue";

const store = <StateTree>inject("Store");
const props = defineProps<{ promocode: ReferralPromocode }>();
const emit = defineEmits(["confirmDeleting"]);

function confirmDeleting() {
  emit("confirmDeleting", props.promocode.id);
}
</script>

<style lang="scss" scoped>
@import "@styles/_variables.scss";

.referral-promocode {
  padding: 0.8rem 2rem;
  border: 0.25rem solid $--c__light-violet;
  border-radius: 0.6rem;

  & + & {
    margin-top: 1.7rem;
  }

  &__container {
    display: flex;
    align-items: center;
    gap: 4rem;
  }

  &__wrapper {
    display: grid;
    gap: 2rem;
    height: 100%;

    &_main {
      flex-grow: 9;
      grid-template-columns: minmax(0, 2fr) minmax(0, 3fr) minmax(0, 3fr) minmax(0, 3fr);
    }

    &_buttons {
      grid-template-columns: repeat(3, 1fr);

      & > * {
        width: 2rem;
        height: 2rem;
      }
    }
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 0 2rem;
    align-self: flex-start;

    p {
      flex-grow: 1;
      width: 100%;
    }

    &_highlight {
      p {
        text-align: center;
        background-color: $--c__light-blue;
        border-radius: 0.6rem;
        font-weight: bold;
        padding: 0.4rem 2rem;
        word-wrap: break-word;

        font: {
          size: 1.35rem;
        }
      }
    }

    &_promocode {
      padding: 0.4rem 0;

      p {
        font: {
          family: var(--f__mazzard-sb);
          size: 1.5rem;
        }
        text-align: center;
        line-height: 1.5rem;
        padding: 0;
      }
    }
  }

  &__show {
    svg {
      fill: $--c__blue;
    }
  }

  &__show,
  &__delete {
    svg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  @media screen and (max-width: $mobile--breakpoint) {
    padding: 2rem 2rem;

    &__container {
      flex-wrap: wrap;
      height: auto;
      flex-direction: column;
      position: relative;
    }

    &__wrapper {
      width: 100%;

      &_main {
        grid-template: repeat(4, auto) / 1fr;
        gap: 2rem;
      }

      &_buttons {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: absolute;
        top: -1rem;
        left: -1rem;
        width: auto;
        height: auto;
      }
    }

    &__item {
      padding: 0.4rem 3rem;

      p {
        text-align: center;
        word-break: break-all;
        white-space: break-spaces;

        font: {
          size: 1.7rem;
        }
      }
    }

    &__item {
      display: flex;
      align-items: center;
      padding: 0 2rem;
      align-self: flex-start;

      p {
        flex-grow: 1;
        width: 100%;
      }

      &_highlight {
        p {
          text-align: center;
          background-color: $--c__light-blue;
          border-radius: 0.6rem;
          font-weight: bold;
          padding: 0.4rem 2rem;
          word-wrap: break-word;
        }
      }

      &_promocode {
        p {
          font: {
            size: 3rem;
          }
          line-height: 3rem;
        }
      }
    }

    &__delete,
    &__edit,
    &__show {
      width: 2.3rem;
      height: 2.3rem;
    }
  }
}
</style>