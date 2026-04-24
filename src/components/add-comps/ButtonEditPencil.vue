<template>
  <div class="button-pencil">
    <RouterLink :to="to">
      <IconPencil/>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import IconPencil from "@icons/IconPencil.vue";
import {computed, ComputedRef} from "@vue/reactivity";
import {LocationAsRelativeRaw, MatcherLocationAsPath, RouteParamsRaw} from "vue-router";

const props = defineProps<{ to: { name?: string, params?: RouteParamsRaw, path?: string } }>();

const to: ComputedRef<LocationAsRelativeRaw | MatcherLocationAsPath>
    = computed(
    () => props.to.path
        ? {path: props.to.path}
        : {name: props.to.name, params: props.to.params}
);
</script>

<style lang="scss" scoped>
@import "@styles/_variables.scss";

.button-pencil {
  display: flex;
  justify-content: flex-end;

  & * {
    fill: $--c__blue;
  }

  a {
    width: 100%;
    height: 100%;
  }

  svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: pointer;
  }
}
</style>