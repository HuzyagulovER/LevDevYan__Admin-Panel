<template>
  <section class="referral-promocode">
    <form class="referral-promocode___form form">
      <div class="form__row">
        <div class="form__col">
          <p class="form__label">Название</p>
          <p>{{ promocode.code }}</p>
        </div>
        <div class="form__col">
          <p class="form__label">Привязан</p>
          <p>{{ promocode.chained_with }}</p>
        </div>
      </div>
      <div class="form__row">
        <div class="form__col">
          <p class="form__label">Дополнительная информация</p>
          <p>{{ promocode.description }}</p>
        </div>
      </div>
      <div class="form__row">
        <div class="form__col">
          <p class="form__label">Тип</p>
          <p>{{ promocode.type }}</p>
        </div>
      </div>
      <div class="form__row">
        <div class="form__col">
          <p class="form__label">Применен</p>
        </div>
      </div>
      <div class="form__row form__row_buttons row-flex-start margin-top-low">
        <div class="form__col" v-for="(typeObj, typeString) in types" :key="typeString">
          <p class="form__button form__button_unbordered"
             :class="{active: type === typeString}"
             @click="typeObj.onclick(typeString)">
            {{ typeObj.text }}
            <span v-if="typeString === 'date' && dates.from !== '' && dates.to !== ''">: {{ dates.from }} - {{
                dates.to
              }}</span>
          </p>
        </div>
        <div class="form__col">
          <p class="form__button form__button_bordered"
             @click="chooseTypeByAutopayment">
            {{ typesByAutopayment[typeByAutopayment] }}
          </p>
        </div>
      </div>
      <div class="form__row form__row_date row-flex-start margin-top-low">
        <p class="" v-if="promocodeApplied.summary.date_string">
          {{ promocodeApplied.summary.date_string }}
        </p>
      </div>
      <div class="form__row form__row_summary row-flex-start margin-top-low">
        <div class="form__col">
          <p class="">
            Всего применен: {{ promocodeApplied.summary.total_count }}
          </p>
        </div>
        <div class="form__col">
          <p class="">
            Сумма подписок: {{ promocodeApplied.summary.total_sum }}₽
          </p>
        </div>
        <div class="form__col flex-row">
          <div class="form__row form__row_calculator row-flex-start align-items-center margin-top-low">
            <div class="form__col flex-row align-items-center">
              <input name="percent" class="form__input" type="number" min="0" max="100" v-model="percent"/>%
            </div>
            <div class="form__col">
              <p>{{ (percent * promocodeApplied.summary.total_sum / 100).toFixed(2) }}₽</p>
            </div>
          </div>
        </div>
      </div>
      <div class="form__row margin-top-low">
        <table>
          <tr v-for="row in promocodeApplied.data" :key="row.id">
            <td>{{ row.user_name }}</td>
            <td>{{ row.user_email }}</td>
            <td>{{ row.premium_title }}</td>
            <td>{{ row.premium_date }}</td>
          </tr>
        </table>
      </div>
      <div class="form__row">
        <div class="form__col">
          <p class="form__label">Расчеты</p>
        </div>
      </div>
      <div class="form__row margin-top-low width-limitation">
        <input name="calculationText" class="form__input flex-1" type="text" maxlength="300"
               v-model="calculationText"/>
        <p class="form__button form__button_green" @click="createCalculations">Добавить</p>
      </div>
      <div class="form__row margin-top-low width-limitation align-items-start"
           v-for="promocodeCalculation in promocodeCalculations" :key="promocodeCalculation.id">
        <p class="flex-1">{{ promocodeCalculation.text }}</p>
        <p class="form__button form__button_red" @click="deleteCalculations(promocodeCalculation.id)">Удалить</p>
      </div>
    </form>
    <PopupReferralPromocodeDate/>
    <PopupReferralPromocodeTypeByAutopayment/>
  </section>
</template>

<script setup lang="ts">
import {inject, reactive, Ref, ref, watch} from "@vue/runtime-core";
import {StoreGeneric, storeToRefs} from "pinia";
import {
  ReferralPromocode, ReferralPromocodeApplied, ReferralPromocodeCalculations,
} from "../../helpers";
import {cloneDeep, isEmpty} from "lodash";
import {useRoute} from "vue-router";
import PopupReferralPromocodeDate from "@add-comps/PopupReferralPromocodeDate.vue";
import PopupReferralPromocodeTypeByAutopayment from "@add-comps/PopupReferralPromocodeTypeByAutopayment.vue";

type PropsTypes = {
  text: string,
  onclick: Function,
};
type DatesProps = {
  from: string,
  to: string,
}

const store = <StoreGeneric>inject("Store");
const {loading} = storeToRefs(store);
const route = useRoute();
const clearVariable = <Function>inject("clearVariable");
const defaultReferralPromocode: ReferralPromocode = {
  id: '',
  code: '',
  chained_with: '',
  description: '',
  type: '',
};
const types: Record<string, PropsTypes> = {
  currentMonth: {
    text: 'Текущий месяц',
    onclick: changeType,
  },
  previousMonth: {
    text: 'Прошлый месяц',
    onclick: changeType,
  },
  date: {
    text: 'Выбрать даты',
    onclick: chooseDates,
  },
};
const typesByAutopayment: Record<string, string> = {
  all: 'Все',
  new: 'Только новые',
  autopayment: 'Только автооплаты',
};

const promocode: Ref<ReferralPromocode> = ref(defaultReferralPromocode);
const promocodeApplied: Ref<ReferralPromocodeApplied> = ref({summary: {total_count: 0, total_sum: 0, date_string: ''}, data: {}});
const promocodeCalculations: Ref<ReferralPromocodeCalculations> = ref({});
const type: Ref<string> = ref('currentMonth');
const dates: DatesProps = reactive({from: '', to: ''});
const typeByAutopayment: Ref<string> = ref('all');
const percent: Ref<number> = ref(0);
const calculationText: Ref<string> = ref('');
const id: string = route.params.id as string;

getReferralPromocode()
    .then(
        async () => await getReferralPromocodeApplied()
    )
    .then(
        async () => await getCalculations()
    );

watch(
    [type, typeByAutopayment],
    () => {
      if (!isEmpty(type.value)) {
        if (type.value !== 'date') {
          const cleared: DatesProps = clearVariable(dates);
          Object.keys(cleared).forEach((key: string): void => {
            dates[key as keyof DatesProps] = cleared[key as keyof DatesProps]
          });
        }
        getReferralPromocodeApplied();
      }
    },
    {
      flush: 'sync'
    }
);

function getReferralPromocode(): Promise<ReferralPromocode> {
  loading.value = true;

  return store.getReferralPromocode(id)
      .then((r: ReferralPromocode): void => {
        promocode.value = cloneDeep(r);
        loading.value = false;
      });
}

function getReferralPromocodeApplied(): Promise<ReferralPromocodeApplied> {
  loading.value = true;
  console.log('getReferralPromocodeApplied')
  return store.getReferralPromocodeApplied(
      id,
      type.value,
      typeByAutopayment.value,
      dates.from !== '' && dates.to !== '' ? dates : null,
  )
      .then((r: ReferralPromocodeApplied): void => {
        promocodeApplied.value = cloneDeep(r)
        loading.value = false;
      });
}

function changeType(typeValue: string): void {
  type.value = typeValue
}

async function chooseDates() {
  const addition_data = {};

  await store
      .callPopupWithData('', {
        type: 'referral-promocode-date',
        ...addition_data
      })
      .then(async (r: any) => {
        dates.from = r.dateFrom;
        dates.to = r.dateTo;
        await store.clearPopup();
      });

  if (dates.from !== '' && dates.to !== '') {
    if (type.value === 'date') {
      await getReferralPromocodeApplied();
    } else {
      changeType('date')
    }
  }
}

async function chooseTypeByAutopayment() {
  console.log({
    type: 'referral-promocode-type-by-autopayment',
    values: typesByAutopayment
  })
  await store
      .callPopupWithData('', {
        type: 'referral-promocode-type-by-autopayment',
        values: typesByAutopayment
      })
      .then(async (r: any) => {
        console.log(r);
        typeByAutopayment.value = r.selected;
        console.log(typeByAutopayment.value)
      })
      .then(() => store.clearPopup());
}

async function getCalculations() {
  loading.value = true;

  return store.getCalculations(id)
      .then((r: ReferralPromocodeCalculations): void => {
        promocodeCalculations.value = cloneDeep(r);
        loading.value = false;
      });
}

async function createCalculations() {
  if (calculationText.value) {
    loading.value = true;

    await store.createCalculations(id, calculationText.value)
        .then(async (): Promise<void> => {
          await getCalculations();
          calculationText.value = '';
        })
        .then((): void => {
          loading.value = false;
        });
  }
}

async function deleteCalculations(calculationId: string) {
  await store.callPopup("Удалить эту запись?").then(async (r: boolean) => {
    if (r) {
      loading.value = true;
      await store.deleteCalculations(calculationId)
          .then(async (): Promise<void> => {
            await getCalculations();
          })
          .then((): void => {
            loading.value = false;
          });
    }
  });
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

    table {
      border-spacing: 0;

      td, th {
        word-break: break-all;
        padding: 0.5rem;

        &:last-child {
          padding-right: 0;
        }

        &:first-child {
          padding-left: 0;
        }
      }
    }

    &__row {
      &.row-flex-start {
        align-items: flex-start;
        width: unset;
      }

      &_summary {
        align-items: center !important;
        gap: 6rem;
        margin-top: 1rem;
      }

      &_date {
        margin-top: 1rem;
        color: $--c__violet;
      }
    }

    &__button {
      &_green {
        color: $--c__green;
      }

      &_red {
        color: $--c__red;
      }
    }
  }

  @media screen and (max-width: $mobile--breakpoint) {
    .form {
      table {
        border-spacing: 0;
        width: 100%;

        td, th {
          word-break: break-all;
          padding: 0.25rem;

          &:last-child {
            padding-right: 0;
          }

          &:first-child {
            padding-left: 0;
          }
        }
      }

      &__row {
        &_summary {
          gap: 1rem;
        }

        &_calculator {
          gap: 1rem;
        }

        &_buttons {
          flex-flow: wrap;
          gap: 1rem;
        }
      }

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

.width-limitation {
  max-width: 400px;
}
</style>