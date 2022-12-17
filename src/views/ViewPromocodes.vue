<template>
	<section class="promocodes">
		<div class="promocodes__top-line top-line">
			<p class="top-line__text">
				Активные {{ activePromosNumber }}/{{ promosNumber }}
			</p>
			<ButtonCreate
				create_name="Создать промокод"
				to="/promocodes/create"
				class="top-line__button-create"
			/>
		</div>

		<div class="promocodes__empty" v-if="isEmpty">
			<img src="@images/Courses__Empty-Courses.png" alt="" />
			<p>Промокодов еще нет...</p>
		</div>
		<TransitionGroup tag="div" name="list">
			<PromocodesPromocodeItem
				v-for="(promocode, j) in promos"
				:key="promocode?.id"
				:index="j"
				:promocode="promocode"
				class="promocodes__promocode"
				@confirm-deleting-active="confirmDeletingActive"
			/>
		</TransitionGroup>
	</section>
</template>

<script setup lang="ts">
import ButtonCreate from "@/components/add-comps/ButtonCreate.vue";
import PromocodesPromocodeItem from "@for-promo/PromocodesPromocodeItem.vue";
import TheLoader from "@add-comps/TheLoader.vue";
import Popup from "@add-comps/Popup.vue";
import { inject, Ref, ref, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { Promocode, Promocodes } from "../../helpers";
import { cloneDeep } from "lodash";

const store = <StoreGeneric>inject("Store");
const { promocodes, loading } = storeToRefs(store);

let isEmpty: Ref<boolean> = ref(false);

let activePromosNumber: Ref<number> = ref(0);
let promosNumber: Ref<number> = ref(0);
const promos: Ref<Promocodes> = ref([]);
let deleteIndex: Ref<number> = ref(0);

watch(
	() => {}, //! FIX
	() => {
		if (!promocodes.value.length && !loading.value) {
			isEmpty.value = true;
		}
	},
	{ deep: true }
);

store.getPromocodes().then(() => {
	promos.value = cloneDeep(promocodes.value);
});

watch(
	() => promos.value,
	() => {
		let active: number = 0;
		promos.value.map((promo: Promocode | null): void => {
			if (promo?.active) {
				active++;
			}
		});
		activePromosNumber.value = active;

		promosNumber.value = promos.value.length;
	},
	{
		deep: true,
	}
);

async function confirmDeletingActive(index: number) {
	deleteIndex.value = index;
	await store.callPopup("Удалить этот промокод?").then((r: boolean) => {
		if (r) {
			promos.value.splice(deleteIndex.value, 1);
			deleteIndex.value = 0;
		}
	});
}
</script>

<style scoped lang="scss">
.promocodes {
	.top-line {
		display: flex;
		align-items: center;
		margin-bottom: 2rem;
		height: 3.3rem;

		&__text {
			margin-right: auto;
			line-height: 1.6rem;

			font: {
				family: var(--f__mazzard-sb);
				size: 1.6rem;
			}
		}

		&__button-create {
			align-self: stretch;
		}
	}
}
</style>