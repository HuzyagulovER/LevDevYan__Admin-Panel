<template>
  <div class="buttons-top-routes" :data-links-number="props.additionLinksNumber">
    <RouterLink v-for="link in links" class="buttons-top-routes__link"
                :to="{ path: link.path }"
                :class="{ js_active: route.path === link.path, ...link.class }">
      {{ link.text }}
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";

const props = defineProps<{
  additionLinksNumber?: number
  links?: Array<{
    path: string
    text: string
    class: Array<string | null>
  }>
}>();

const route = useRoute();
</script>

<style lang="scss">
@import "@styles/_variables.scss";

.buttons-top-routes {
  display: flex;

  & > * + * {
    margin-left: 2rem;
  }

  .buttons-top-routes__link {
    border-radius: 0.7rem;
    border: 0.2rem solid $--c__violet;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.7rem 3.25rem;

    &.js_active {
      background-color: $--c__violet;
      color: $--c__white;
    }
  }

  @media screen and (max-width: $mobile--breakpoint) {
    grid-column: 1/7;
    display: grid;
    grid-template: 1fr / 1fr 1fr;
    column-gap: 2.5rem;

    &[data-links-number="1"] {
      grid-template: 1fr / repeat(3, 1fr);
    }

    & > * {
      margin: 0;
    }
  }
}
</style>