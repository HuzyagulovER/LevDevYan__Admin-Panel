<template>
  <section class="promocodes">
    <div class="promocodes__top-line top-line">
      <ButtonsTopRoutes :links="links"/>
    </div>

    <RouterView v-slot="{ Component }">
      <Component :is="Component" class="promocodes__container"/>
    </RouterView>
  </section>
</template>

<script setup lang="ts">
import {inject} from "@vue/runtime-core";
import {StoreGeneric} from "pinia";
import ButtonsTopRoutes from "@add-comps/ButtonsTopRoutes.vue";
import routes from "../routes";
import {computed, ComputedRef} from "@vue/reactivity";
import {RouteRecordNormalized} from "vue-router";

type Link = {
  path: string
  text: string
  class: Array<string | null>
}
type Links = Array<Link>

const store = <StoreGeneric>inject("Store");
const names: Array<string> = ['PromocodesOnce', 'PromocodesReferral'];

const links: ComputedRef<Links> = computed((): Links => {
  const links = routes.getRoutes()
      .filter((r): boolean => names.includes(r.name as string));

  return names.map((name: string): RouteRecordNormalized | undefined => {
    return links
        .find((r: RouteRecordNormalized): RouteRecordNormalized | undefined => {
          if (name === r.name) {
            return r;
          }
        });
  })
      .filter((r): r is RouteRecordNormalized => r !== undefined)
      .map((r: RouteRecordNormalized): Link => {
        return {
          path: r.path,
          text: r.meta.nav_title as string,
          class: [],
        } as Link;
      }) as Links;
});
</script>

<style scoped lang="scss">
.promocodes {
  flex: 1;
  display: flex;
  flex-direction: column;

  .top-line {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    height: 3.3rem;

    &__button-create {
      align-self: stretch;
    }
  }
}
</style>