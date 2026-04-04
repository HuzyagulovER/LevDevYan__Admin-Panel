<template>
  <section class="price-edit">
    <div class="price-edit__item-block item">
      <div class="item__row">
        <div class="item__column">
          <p class="price-edit__subtitle subtitle">Название</p>
          <div class="price-edit__wrapper">
            <div class="item__input-container span-1-4">
              <input type="text" v-model="price.name" name="name" maxlength="20" class="price-edit__input form__input"/>
            </div>
          </div>
        </div>
        <div class="item__column">
          <p class="price-edit__subtitle subtitle">Тэг</p>
          <div class="price-edit__wrapper">
            <div class="item__input-container span-1-3">
              <input type="text" v-model="price.tag" name="tag" maxlength="20" class="price-edit__input form__input"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="price-edit__item-block item">
      <p class="price-edit__subtitle subtitle">Приложение</p>
      <div class="price-edit__wrapper">
        <div class="item__input-container">
          <select v-model="price.app" name="app" class="price-edit__input form__input">
            <option v-for="(app, index) in apps" :key="index" :value="index">{{ app }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="price-edit__item-block item">
      <p class="price-edit__subtitle subtitle">Продолжительность</p>
      <div class="price-edit__wrapper">
        <div class="item__input-container">
          <select v-model="price.duration_timestamp" name="duration_timestamp" class="price-edit__input form__input">
            <option value="" disabled selected>Выберите продолжительность...</option>
            <option value="1 month">Месяц</option>
            <option value="3 month">3 месяца</option>
            <option value="1 year">Год</option>
            <option value="forever">Навсегда</option>
          </select>
        </div>
      </div>
    </div>
    <div class="price-edit__item-block item" id="test">
      <p class="price-edit__subtitle subtitle">Первая цена</p>
      <div class="price-edit__wrapper">
        <div class="item__input-container">
          <input type="number" v-model="price.price" class="price-edit__input form__input"/>
          <p>&#x20bd;</p>
        </div>
      </div>
    </div>
    <div class="price-edit__item-block second-price-item">
      <p class="price-edit__subtitle subtitle">Вторая цена</p>
      <div class="price-edit__wrapper">
        <div class="second-price-item__input-container" v-if="!price.is_divide">
          <input type="number" v-model="price.second_price" :class="{ _hidden: !price.second_price_visibility }"
                 class="price-edit__input form__input"/>
          <p>&#x20bd;</p>
        </div>
        <input type="number"
               :disabled="true"
               class="price-edit__input form__input"
               v-if="price.is_divide"
               :value="price.price_divison"
               :class="{ _hidden: !price.second_price_visibility }"/>

        <div class="price-edit__preview">
          <p :class="{
						strikethrough: price.strikethrough,
						_hidden: !price.second_price_visibility,
					}">
            {{
              price.is_divide && !isNull(price.price_divison)
                  ? Math.floor(price.price / price.price_divison)
                  : price.second_price
            }}
            <span>
							&#x20bd;<span v-if="price.second_price_per_month">/мес</span></span>
          </p>
        </div>
      </div>
      <div class="price-edit__buttons">
        <Button class="price-edit__button" :color="price.second_price_per_month ? blueColor : ''" @click="
					price.second_price_per_month = !price.second_price_per_month
					">
          В месяц
        </Button>
        <Button class="price-edit__button"
                :color="price.is_divide ? blueColor : ''"
                @click="price.is_divide = !price.is_divide"
                v-if="price.price_divison">
          Разделить
        </Button>
        <Button class="price-edit__button" :color="price.strikethrough ? blueColor : ''"
                @click="price.strikethrough = !price.strikethrough">
          Зачеркнуть
        </Button>
        <Button class="price-edit__button" :color="!price.second_price_visibility ? blueColor : ''" @click="
					price.second_price_visibility = !price.second_price_visibility
					">
          Скрыть
        </Button>
      </div>
    </div>
    <div class="price-edit__item-block text-item">
      <p class="price-edit__subtitle subtitle">Текст под ценой - 1</p>
      <div class="price-edit__wrapper">
				<textarea v-model="price.text_1" maxlength="255" :class="{ _hidden: !price.text_1_visibility }"
                  class="price-edit__input form__textarea span-1-4"></textarea>
      </div>
      <div class="price-edit__buttons">
        <Button class="price-edit__button" maxlength="255" :color="!price.text_1_visibility ? blueColor : ''"
                @click="price.text_1_visibility = !price.text_1_visibility">
          Скрыть
        </Button>
      </div>
    </div>
    <div class="price-edit__item-block text-item">
      <p class="price-edit__subtitle subtitle">Текст под ценой - 2</p>
      <div class="price-edit__wrapper">
				<textarea v-model="price.text_2" :class="{ _hidden: !price.text_2_visibility }"
                  class="price-edit__input form__textarea span-1-4"></textarea>
      </div>
      <div class="price-edit__buttons">
        <Button class="price-edit__button" :color="!price.text_2_visibility ? blueColor : ''"
                @click="price.text_2_visibility = !price.text_2_visibility">
          Скрыть
        </Button>
      </div>
    </div>
    <div class="price-edit__buttons-container">
      <ButtonColored class="price-edit__save" v-if="!isNew" color="#ff4545" @click="confirmDeleting">Удалить</ButtonColored>
      <ButtonColored class="price-edit__save" @click="createOrUpdatePrice"></ButtonColored>
    </div>
  </section>
</template>

<script setup lang="ts">
import ButtonColored from "@add-comps/ButtonColored.vue";
import Button from "@for-subscriptions/Button.vue";
import {useRoute, useRouter} from "vue-router";
import {Store} from "@stores/store";
import {StoreGeneric, storeToRefs} from "pinia";
import {
  computed,
  ComputedRef,
  inject,
  onUnmounted,
  ref,
  Ref,
  watch, watchEffect,
} from "vue";
import {AdditionalSubscription, Price, ReturnedData, ReturnedError} from "../../helpers";
import {isNull, isUndefined} from "lodash";

const route = useRoute();
const router = useRouter();
const store = <StoreGeneric>inject("Store");
const {mainTitle, loading, apps} = storeToRefs(store);
const clearVariable = <Function>inject("clearVariable");
const blueColor = "#E7FBFF";

const price: Ref<AdditionalSubscription> = ref({
  id: "",
  tag: "",
  name: "",
  app: "",
  price: 0,
  second_price: null,
  second_price_visibility: true,
  text_1: "",
  text_1_visibility: true,
  text_2: "",
  text_2_visibility: true,
  strikethrough: false,
  second_price_per_month: false,
  price_divison: null,
  is_divide: false,
  duration_timestamp: null,
});

const app: ComputedRef<string> = computed(() =>
    route.query.app ? <string>route.query.app : "psy"
);
const subscriptionId: Ref<string | undefined> = ref(<string>route.params.subscriptionId);
const currentError: Ref<string> = ref("");

const isNew: ComputedRef<boolean> = computed(() => isUndefined(subscriptionId.value));

watchEffect(() => {
  mainTitle.value = route.meta.title
      + ' ' +
      (apps.value[price.value.app] ?? '') +
      (price.value.name
          ? ' (' +
          price.value.name +
          ')'
          : '');
})

watch(
    () => route.params.subscriptionId,
    () => {
      subscriptionId.value = <string>route.params.subscriptionId;
      getPrice();
    }
);

onUnmounted(() => {
  mainTitle.value = "";
});

if (!isNew.value) {
  getPrice();
}

async function getPrice(): Promise<void> {
  loading.value = true;
  await store.getAdditionalPrice(subscriptionId.value)
      .then((r: Price) => {
        price.value = r;
        loading.value = false;
      });
}

function createOrUpdatePrice() {
  loading.value = true;
  if (isNew.value) {
    store
        .createAdditionalPrice(price.value)
        .then((r: ReturnedData | ReturnedError) => {
          loading.value = false;
          if (r.success) {
            price.value = clearVariable(price.value);
            router.push({path: "/subscriptions", query: {app: app.value}});
          } else {
            currentError.value = r.error.status;
            setTimeout(() => {
              currentError.value = "";
            }, 2000);
          }
        });
  } else {
    store
        .updateAdditionalPrice(subscriptionId.value, price.value)
        .then((r: ReturnedData | ReturnedError) => {
          loading.value = false;
          if (r.success) {
            let app = price.value.app;
            price.value = clearVariable(price.value);
            router.push({path: "/subscriptions", query: {app: app}});
          } else {
            currentError.value = r.error.status;
            setTimeout(() => {
              currentError.value = "";
            }, 2000);
          }
        });
  }
}

async function confirmDeleting() {
  await store.callPopup("Удалить эту подписку?")
      .then((r: boolean) => {
        if (r) {
          loading.value = true;
          store.deleteAdditionalPrice(price.value.id)
              .then((r: ReturnedData | ReturnedError) => {
                if (r.success) {
                  let app = price.value.app;
                  price.value = clearVariable(price.value);
                  router.push({path: "/subscriptions", query: {app: app}});
                }
              })
              .finally(() => loading.value = false);
        }
      });
}
</script>

<style lang="scss" scoped>
@import "@/style.scss";

.price-edit {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 50rem;

  @for $i from 1 through 4 {
    *.span-1-#{$i} {
      grid-column: 1/#{$i};
    }
  }

  &__item-block {
    width: 100%;
    margin-bottom: 2rem;
  }

  &__wrapper,
  &__buttons {
    display: grid;
    grid-template: 1fr / repeat(3, 1fr);
    gap: 1.5rem;
  }

  &__input {
    margin: 0;
  }

  &__buttons {
    margin-top: 1rem;
  }

  &__button {
    color: black;
    border: 0.1rem solid $--c__grey;
    border-radius: 0.5rem;
    font-size: 1.5rem;
    padding: 0;
  }

  &__buttons-container {
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 2rem;
  }

  .second-price-item {
    .price-edit__buttons {
      grid-template: 1fr / repeat(4, 1fr);
    }

    ._hidden {
      color: $--c__grey;
    }
  }

  .text-item {
    ._hidden {
      color: $--c__grey;
    }

    textarea {
      min-height: 5rem;
      max-height: 10rem;
    }
  }

  .item {
    &__row {
      display: flex;
      flex-direction: row;
      gap: 2rem;
    }

    &__column {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
  }

  .second-price-item,
  .item {
    &__input-container {
      position: relative;
      align-self: flex-start;

      input {

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          opacity: 0;
          pointer-events: none;
        }
      }

      p {
        font: {
          size: 1.7rem;
        }

        position: absolute;
        top: 50%;
        right: 0.6rem;
        transform: translateY(-50%);
      }
    }
  }

  &__preview {
    display: flex;
    align-items: center;

    p {
      position: relative;
      font-size: 1.7rem;

      &.strikethrough {
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          height: 0.1rem;
          width: 105%;
          transform: translate(-50%, -50%);
          background-color: #000;
        }
      }

      &._hidden.strikethrough {
        &::after {
          background-color: $--c__grey;
        }
      }
    }
  }

  @media screen and (max-width: $mobile--breakpoint) {
    padding-right: 0;

    &__wrapper {
      grid-template: 1fr / repeat(2, 1fr);
    }

    &__button {
      height: 3.3rem;
    }

    .text-item {
      button {
        grid-column: 3/4;
      }
    }
  }
}
</style>