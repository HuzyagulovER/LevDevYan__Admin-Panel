<template>
  <section class="notification-create">
    <form class="notification-create__form form" @submit.prevent="notificationChangeHandler($event)">
      <InputImage class="form__file-input" :image="image" :name="'notification_image'" :currentError="currentError"
                  :disabled="disabledForm" @display-image="displayImage($event)"/>

      <div class="form__input-container input-container">
        <div class="input-container__wrapper">
          <label for="input_time" class="form__label">Время</label>
          <input id="input_time" type="time" class="form__input" :class="{ _error: error.includes('time') }"
                 name="time" :disabled="disabledForm" v-model="notification.time"
                 @input="error = clearVariable(error)"/>
        </div>
        <div class="input-container__wrapper">
          <label for="input_date" class="form__label">Дата</label>
          <input id="input_date" type="date" class="form__input" :class="{ _error: error.includes('date') }"
                 name="date" :disabled="!isEnabledDate" v-model="notification.date"
                 @input="error = clearVariable(error)"/>
        </div>
      </div>

      <div class="form__input-container input-container checkbox-container">
        <label for="is_active" class="form__label">Активность</label>
        <input type="checkbox" id="is_active" name="is_active" :class="{ _error: error.includes('is_active') }"
               :disabled="disabledForm" v-model="notification.is_active" class="form__checkbox"
               @input="error = clearVariable(error)"/>
      </div>

      <div class="form__input-container input-container">
        <div class="input-container__wrapper">
          <label for="input_title" class="form__label">Заголовок</label>
          <input id="input_title" type="text" class="form__input" :class="{ _error: error.includes('title') }"
                 name="title"
                 :disabled="disabledForm" v-model="notification.title" @input="error = clearVariable(error)"/>
        </div>
      </div>

      <div class="form__input-container input-container">
        <div class="input-container__wrapper">
          <label for="input_body" class="form__label">Текст</label>
          <input id="input_body" type="text" name="text" class="form__input" :class="{ _error: error.includes('text') }"
                 :disabled="disabledForm" v-model="notification.text" @input="error = clearVariable(error)"/>
        </div>
      </div>

      <div class="form__input-container input-container">
        <div class="input-container__wrapper">
          <label for="input_repeat-times" class="form__label">
            Число повторений
            <span class="form__comment">(0 - неограниченное количество раз)</span>
          </label>
          <input id="input_repeat-times" type="number" name="repeat_times" class="form__input"
                 :class="{ _error: error.includes('repeat_times') }" :disabled="disabledForm"
                 v-model="notification.count_total" @input="error = clearVariable(error)" min="0" step="1"/>
        </div>
      </div>

      <div class="form__input-container input-container">
        <div class="input-container__wrapper">
          <label for="input_app" class="form__label">Приложение</label>
          <div class="select-container">
            <select id="input_app" name="app" class="form__input" :class="{ _error: error.includes('app') }"
                    v-model="notification.app" :disabled="disabledForm">
              <option v-for="app in apps" :key="app" :value="app.toLowerCase()">
                {{ app }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="form__input-container input-container">
        <div class="input-container__wrapper">
          <label for="input_premium_app" class="form__label">
            Подписки в приложении
          </label>
          <div class="select-container">
            <select id="input_premium_app"
                    name="premium_availability"
                    class="form__input"
                    :class="{ _error: error.includes('premium_availability') }"
                    v-model="premiumAvaliability"
                    :disabled="disabledForm">
              <option v-for="(premiumAppType, j) in premiumAppTypes" :key="j" :value="j">
                {{ premiumAppType }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="form__input-container input-container" v-if="false">
        <div class="input-container__wrapper">
          <label for="input_type" class="form__label">Тип</label>
          <input id="input_type" type="text" class="form__input" :class="{ _error: error.includes('text') }" name="type"
                 :disabled="disabledForm" v-model="notification.type" @input="error = clearVariable(error)"
                 v-if="false"/>

          <div class="form__input" :class="{ _error: error.includes('type') }" v-if="false">
            <select id="input_type" name="type" v-model="notification.type" :disabled="disabledForm">
              <option value="notification">Нотификация</option>
              <option value="in_app">В приложении</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form__input-container input-container">
        <div class="input-container__wrapper">
          <label for="input_lang" class="form__label">Язык</label>
          <div class="select-container">
            <select id="input_lang" name="language" class="form__input" :class="{ _error: error.includes('language') }"
                    v-model="notification.language" :disabled="disabledForm">
              <option v-for="(language, j) in languages" :key="j" :value="j">
                {{ language }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="form__input-container input-container">
        <div class="input-container__wrapper">
          <label for="input_days-without-open-app" class="form__label">
            Дней не входил в приложение
          </label>
          <input id="input_days-without-open-app" type="number" name="days_since_last_visit" class="form__input"
                 :class="{ _error: error.includes('days_since_last_visit') }" :disabled="disabledForm"
                 v-model="notification.days_since_last_visit" @input="error = clearVariable(error)" min="0"/>
        </div>
      </div>

      <div class="form__input-container input-container" v-if="notification.premium_availability === false">
        <div class="input-container__wrapper">
          <div>
            <label for="input_days-without-sub" class="form__label">
              Дней без подписки
            </label>
            <input id="input_days-without-sub" type="number" name="days_without_premium" class="form__input"
                   :class="{ _error: error.includes('days_without_premium') }" :disabled="disabledForm"
                   v-model="notification.days_without_premium" @input="error = clearVariable(error)" min="0"/>
          </div>
        </div>
      </div>

      <div class="form__input-container input-container">
        <div class="input-container__wrapper">
          <label for="input_os" class="form__label">ОС для доп информации</label>
          <div class="select-container">
            <select id="input_os" name="os" class="form__input" v-model="notification.os" :disabled="disabledForm"
                    @input="osChange">
              <option value="">Нет выбора</option>
              <option v-for="(os, key) in OS" :key="key" :value="key">
                {{ os }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="form__input-container input-container" v-if="notification.os">
        <div class="input-container__wrapper">
          <label for="input_info" class="form__label">
            Дополнительная информация
          </label>
          <input v-if="notification.os" id="input_info" type="text" name="info" class="form__input"
                 :class="{ _error: error.includes('info') }" :disabled="disabledForm" v-model="notification.info"
                 @input="error = clearVariable(error)"/>
        </div>
      </div>

      <div class="form__input-container input-container checkbox-container">
        <label for="is_test" class="form__label">Тестовое уведомление</label>
        <input type="checkbox" id="is_test" name="is_test" :class="{ _error: error.includes('is_test') }"
               :disabled="disabledForm" v-model="notification.is_test" class="form__checkbox"
               @input="error = clearVariable(error)"/>
      </div>

      <div class="form__input-container input-container">
        <div class="input-container__wrapper">
          <ButtonColored type="submit" :disabled="disabledForm" class="form__button">
          </ButtonColored>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import {ComputedRef, ref, Ref} from "@vue/reactivity";
import {inject, watch, onMounted, computed, reactive} from "@vue/runtime-core";
import {StoreGeneric, storeToRefs} from "pinia";
import {
  Notification,
  Notifications,
  ReturnedData,
  ReturnedError,
} from "../../helpers";
import ButtonColored from "@add-comps/ButtonColored.vue";
import InputImage from "@add-comps/InputImage.vue";
import {useRoute, useRouter} from "vue-router";
import {cloneDeep, isEmpty, isNull, merge} from "lodash";

const store = <StoreGeneric>inject("Store");
const {
  loading,
  premiumAppTypes,
  languages,
  apps,
  OS,
  activeApp,
} = storeToRefs(store);
const clearVariable = <Function>inject("clearVariable");
const route = useRoute();
const router = useRouter();

const requiredFields: ReadonlyArray<string> = [
  "language",
  "time",
  "app",
];

const notification: Ref<Notification> = ref({
  language: "",
  title: "",
  text: "",
  date: "",
  time: "",
  app: "",
  count_total: null,
  count_completed: null,
  premium_availability: null,
  days_since_last_visit: null,
  days_without_premium: null,
  os: null,
  info: "",
  is_test: false,
  image: null,
  is_active: false,
});

const disabledForm: Ref<boolean> = ref(false);
const error: Ref<Array<string>> = ref([]);
const image: Ref<string> = ref("");
const newImage: Ref<Blob | null> = ref(null);
const currentError: Ref<string> = ref("");
const isImageLoaded: Ref<boolean> = ref(false);
const premiumAvaliability: Ref<string | boolean | null> = ref(null);

const isNew: ComputedRef<boolean> = computed(() => {
  return route.params.id === "new"
});
const isEnabledDate: ComputedRef<boolean> = computed((): boolean => {
  return !disabledForm.value &&
      (notification.value.count_total === 1 || !isNull(notification.value.date) && isNotificationCompleted.value)
});
const isNotificationCompleted: ComputedRef<boolean> = computed((): boolean => {
  return notification.value.count_completed === notification.value.count_total && !isNull(notification.value.count_total)
});

if (!isNew.value) {
  loading.value = true;

  store.getNotification(route.params.id).then((r: Array<null> | Notification) => {
    loading.value = false;
    if (Array.isArray(r)) {
      router.replace({path: "/notifications"});
    }

    notification.value = cloneDeep(r as Notification);

    premiumAvaliability.value = notification.value.premium_availability;

    if (!isEmpty(notification.value.image)) {
      image.value = <string>notification.value.image;
    }
  });
} else {
  notification.value.app = activeApp.value;
  console.log(notification.value);
}

function displayImage(data: boolean | [boolean, string]): void {
  if (Array.isArray(data)) {
    isImageLoaded.value = data[0];
    if (data[0]) {
      image.value = data[1];
      // Получаем файл из input элемента
      const inputElement = document.getElementById('input_image') as HTMLInputElement;
      if (inputElement && inputElement.files && inputElement.files.length > 0) {
        newImage.value = inputElement.files[0];
      }
    } else {
      image.value = "";
      newImage.value = null;
    }
  } else {
    isImageLoaded.value = false;
    image.value = "";
    newImage.value = null;
  }
}

function parseValue(value: string | boolean | null): boolean | null {
  return JSON.parse(String(value));
}

function notificationChangeHandler(e: Event): void {
  disabledForm.value = true;

  if (notification.value.premium_availability === false) {
    notification.value.days_without_premium = 0;
  }

  requiredFields.forEach((field) => {
    if (
        notification.value.hasOwnProperty(field as keyof Notification) &&
        notification.value[field as keyof Notification] === ""
    )
      error.value.push(field);
  });

  if (error.value.length) {
    disabledForm.value = false;
    setTimeout(() => {
      error.value = clearVariable(error.value);
    }, 2000);
    return;
  }

  const dataToSend = cloneDeep(notification.value);

  if (newImage.value) {
    dataToSend.image = newImage.value;
  } else if (!image.value) {
    dataToSend.image = null;
  } else {
    delete dataToSend.image;
  }

  loading.value = true;

  if (isNew.value) {
    store
        .createNotification(dataToSend)
        .then((r: ReturnedData | ReturnedError) => returnHandler(r));
  } else {
    store
        .updateNotification(notification.value.id, dataToSend)
        .then((r: ReturnedData | ReturnedError) => returnHandler(r));
  }
}

watch(() => premiumAvaliability.value,
    () => {
      notification.value.premium_availability = parseValue(premiumAvaliability.value)
    }
);

function returnHandler(r: ReturnedData | ReturnedError) {
  disabledForm.value = false;
  loading.value = false;

  if (r.success) {
    notification.value = clearVariable(notification.value);
    router.push({name: "Notifications"});
  } else {
    currentError.value = r.error.status;

    setTimeout(() => {
      currentError.value = "";
    }, 2000);
  }
}

function osChange(): void {
  if (notification.value.os === "android") {
  }
}

/*
function createNotification(e: Event) {
	disabledForm.value = true;
	if (notification.value.premium_app_type === "not") {
		notification.value.days_without_premium = 0;
	}
	const fd: FormData = new FormData(e.target as HTMLFormElement);

	requiredFields.forEach((field) => {
		if (
			notification.value.hasOwnProperty(field as keyof Notification) &&
			notification.value[field as keyof Notification] === ""
		)
			error.value.push(field);
	});

	if (error.value.length) {
		disabledForm.value = false;
		setTimeout(() => {
			error.value = clearVariable(error.value);
		}, 2000);
		return;
	}

	loading.value = true;

	store.createNotification(fd).then((r: ReturnedData | ReturnedError) => {
		disabledForm.value = false;
		loading.value = false;

		if (r.success) {
			notification.value = clearVariable(notification.value);
			router.push({ name: "Notifications" });
		} else {
			currentError.value = r.error.status;

			setTimeout(() => {
				currentError.value = "";
			}, 2000);
		}
	});
}
*/
</script>

<style scoped lang="scss">
@import "@/style.scss";

.notification-create {
  .form {
    max-width: 450px;

    &__comment {
      color: $--c__grey;
      font-size: 0.9rem;
    }

    &__label {
      margin-bottom: .3rem;
    }

    &__input, .select-container {
      margin-bottom: 0;
    }

    .input-container {
      display: flex;
      flex-direction: row;
      width: 100%;
      gap: 1.5rem;
      margin-bottom: 1.3rem;

      &__wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      &.checkbox-container {
        width: auto;
        gap: 1rem;

        .form__label {
          width: auto;
        }
      }
    }
  }

  @media screen and (max-width: $mobile--breakpoint) {
    .form {
      max-width: unset;

      &__label {
        font: {
          size: 2rem;
        }
      }

      &__input {
        font: {
          size: 1.7rem;
        }

        padding: 0.5rem 1.2rem;
        height: unset;
      }

      button {
        margin-top: 2rem;
      }
    }
  }
}
</style>