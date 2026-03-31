<template>
  <section class="courses-create-edit">
    <div class="courses-create-edit__top-line top-line">
      <RouterLink class="top-line__link-about" :to="`/courses/create-edit/${route.params.courseId}/about`"
                  :class="{ js_active: route.path.includes('about') }">
        О курсе
      </RouterLink>
      <RouterLink class="top-line__link-days" :class="{ js_active: page === 'days' }"
                  :to="`/courses/create-edit/${route.params.courseId}/days`">
        Программа курса
      </RouterLink>
      <ButtonCreate class="top-line__button-create" v-if="page === 'days'" @click="createNewDay">
        Добавить день
      </ButtonCreate>
      <LanguageChoice :isCookie="false" v-else :defaultLang="(activeData as CourseAbout).language"
                      @return-lang="changeLang"
                      class="top-line__lang-choice"/>
    </div>
    <div class="courses-create-edit__container">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <Component :is="Component" :data="activeData" :courseId="route.params.courseId"
                     :current-error="currentError" :disabled-form="disabledForm" @save-course="saveCourse"
                     @update-course="updateCourse"/>
        </KeepAlive>
      </RouterView>
    </div>
  </section>
</template>

<script setup lang="ts">
import ButtonCreate from "@/components/add-comps/ButtonCreate.vue";
import LanguageChoice from "@add-comps/LanguageChoice.vue";
import {useRoute, useRouter} from "vue-router";
import {
  computed,
  ComputedRef,
  inject,
  onMounted,
  onUnmounted,
  ref,
  Ref,
  watch,
} from "@vue/runtime-core";
import {StoreGeneric, storeToRefs} from "pinia";
import {
  Course,
  Courses,
  CourseAbout,
  CourseDays,
  ReturnedData,
  ReturnedError,
  CourseDay,
} from "../../helpers";
import {cloneDeep, isArray, merge} from "lodash";

const store = <StoreGeneric>inject("Store");
let clearVariable = <Function>inject("clearVariable");
let getSHA256Hash = <Function>inject("getSHA256Hash");
const {defaultDayItem, loading, mainTitle, languages} =
    storeToRefs(store);
const route = useRoute();
const router = useRouter();
const defaultCourse: Course = {
  id: "",
  title: "",
  duration_days: 0,
  description: "",
  for_whom: "",
  results: "",
  image: "",
  price: 0,
  category: "",
  language: "",
  is_in_production: false,
  days: {}
};

let disabledForm: Ref<boolean> = ref(false);
let isOpenedPage: boolean = <boolean>router.options.history.state.replaced;
let currentError: Ref<string> = ref("");
const activeCourse: Ref<Course> = ref({...cloneDeep(defaultCourse),});
const page: ComputedRef<string> = computed(() => {
  return route.path.split("/")[route.path.split("/").length - 1];
});
const about: Ref<CourseAbout | {}> = ref({})
const days: Ref<CourseDays> = ref({})

if (route.params.courseId === "new") {
  mainTitle.value = "Создание курса";
  onMounted(() => {
    changeLang(Object.keys(languages.value)[0]);
  });
  loading.value = false;
} else {
  store.getCourse(route.params.courseId)
      .then((r: Courses | Array<null>) => {
        if (Array.isArray(r)) {
          router.replace({path: "/courses"});
        }
        mainTitle.value = "Редактирование курса";

        activeCourse.value = cloneDeep(r as Course);

        for (const dayId in activeCourse.value.days) {
          let day: CourseDay = (activeCourse.value.days as CourseDays)[dayId as keyof CourseDays];

          if (isArray(day.tasks)) {
            day.tasks = {};
          }
        }
      })
      .then(() => loading.value = false);
}

const activeData: ComputedRef<CourseDays | CourseAbout> = computed(
    (): CourseDays | {} => {
      if (page.value === 'days') {
        return days.value;
      } else {
        return about.value;
      }
    }
);

onUnmounted(() => {
  mainTitle.value = "";
});

watch(
    () => activeCourse.value,
    () => {
      splitActiveCourseToVars()
    },
    {
      deep: true
    }
);

watch(
    () => currentError,
    (): void => {
      if (currentError.value === "") disabledForm.value = false;
    }
);

function splitActiveCourseToVars() {
  const course: CourseAbout = cloneDeep(activeCourse.value);
  delete course.days;
  about.value = course as CourseAbout;
  days.value = cloneDeep(activeCourse.value.days)
}

function saveCourse(): void {
  disabledForm.value = true;
  loading.value = true;
  const pushCourse: Course = merge(about.value as CourseAbout, {days: days.value});

  if (pushCourse.image) {
    delete pushCourse.image;
  }

  store
      .addCourse(pushCourse)
      .then((r: ReturnedData | ReturnedError) => {
        if (r.success) {
          router.push({path: "/courses"});
        } else {
          currentError.value = r.error.status;
          setTimeout(() => {
            currentError.value = "";
          }, 2000);
        }
      })
      .then(() => loading.value = false);

  disabledForm.value = false;
}

function updateCourse(): void {
  disabledForm.value = true;
  loading.value = true;
  const pushCourse: Course = merge(about.value as CourseAbout, {days: days.value});

  if (pushCourse.image) {
    delete pushCourse.image;
  }

  store
      .updateCourse(pushCourse)
      .then((r: ReturnedData | ReturnedError) => {
        loading.value = false;
        if (r.success) {
          router.push({path: "/courses"});
        } else {
          currentError.value = r.error.status;
          setTimeout(() => {
            currentError.value = "";
          }, 2000);
        }
      });
  disabledForm.value = false;
}

async function createNewDay(): Promise<void> {
  let hash: string = await getSHA256Hash(Date.now());
  (days.value as CourseDays)[hash] = cloneDeep(defaultDayItem.value);
}

function changeLang(language: string) {
  (about.value as CourseAbout).language = language;
}
</script>

<style scoped lang="scss">
@import "@/style.scss";

.courses-create-edit {
  flex: 1;
  display: flex;
  flex-direction: column;

  &__container {
    flex: 1;
  }

  .top-line {
    display: flex;
    margin-bottom: 2rem;

    &__link-about,
    &__link-days {
      border-radius: 0.7rem;
      border: 0.2rem solid $--c__violet;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;

      &.js_active {
        background-color: $--c__violet;
        color: $--c__white;
      }
    }

    &__link-about {
      padding: 0.7rem 3.5rem;
      margin-right: 2rem;
    }

    &__link-days {
      padding: 0.7rem 3rem;
    }

    &__button-create {
      margin-left: auto;
    }

    &__lang-choice {
      margin-left: auto;
      margin-bottom: 0;
    }
  }

  @media screen and (max-width: $mobile--breakpoint) {
    .top-line {
      display: grid;
      grid-template: auto / auto auto;
      row-gap: 1rem;
      margin-bottom: 2.5rem;

      &__link-about,
      &__link-days {
        font-size: 1.9rem;
        text-align: center;
        padding: 1rem 3rem;
      }

      &__link-about {
        flex: 1;
      }

      &__link-days {
        flex: 2;
      }

      &__lang-choice {
        grid-column: 2/3;
      }

      .button-create {
        grid-column: 1/3;
        display: flex;
        justify-content: center;
        padding: 1.4rem 3rem;
        margin: 1rem auto 0;
        width: 100%;
        font-size: 2rem;
      }
    }
  }
}
</style>