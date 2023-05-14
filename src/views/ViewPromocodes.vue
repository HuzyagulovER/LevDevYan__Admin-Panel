<template>
	<section class="promocodes">
		<div class="promocodes__top-line top-line">
			<p class="top-line__text">
				Отправленные {{ activePromosNumber }}/{{ promosNumber }}
			</p>
			<ButtonCreate to="/promocodes/create" class="top-line__button-create">
				Создать промокод
			</ButtonCreate>
		</div>

		<div class="promocodes__empty" v-if="isEmpty">
			<img
				src="@images/Promocodes__Empty-Promocodes.png"
				alt=""
				width="256"
				height="256"
			/>
			<p>Промокодов еще нет...</p>
		</div>
		<TransitionGroup tag="div" name="list">
			<PromocodesPromocodeItem
				v-for="(promocode, j) in promos"
				:key="j"
				:promocode="promocode"
				class="promocodes__promocode"
				@confirm-deleting="confirmDeletingActive"
				@change-promocode-state="changePromocodeState"
			/>
		</TransitionGroup>
	</section>
</template>

<script setup lang="ts">
import ButtonCreate from "@/components/add-comps/ButtonCreate.vue";
import PromocodesPromocodeItem from "@for-promo/PromocodesPromocodeItem.vue";
import { inject, Ref, ref, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import {
	Promocode,
	Promocodes,
	ReturnedData,
	ReturnedError,
} from "../../helpers";
import { cloneDeep } from "lodash";

const store = <StoreGeneric>inject("Store");
const { promocodes, loading } = storeToRefs(store);

let isEmpty: Ref<boolean> = ref(false);

let activePromosNumber: Ref<number> = ref(0);
let promosNumber: Ref<number> = ref(0);
const promos: Ref<Promocodes> = ref({});
let deletePromocode: Ref<string> = ref("");

watch(
	() => promos.value,
	() => {
		if (!Object.keys(promos.value).length && !loading.value) {
			isEmpty.value = true;
		}
	},
	{ deep: true }
);

watch(
	() => promos.value,
	() => {
		let sended: number = 0;
		for (const key in promos.value) {
			const promocode: Promocode = promos.value[key as keyof Promocodes];
			if (promocode?.sended) {
				sended++;
			}
		}
		activePromosNumber.value = sended;
		promosNumber.value = Object.keys(promos.value).length;
	},
	{
		deep: true,
	}
);

getPromocodes();

function getPromocodes(): void {
	loading.value = true;
	store.getPromocodes().then(() => {
		promos.value = cloneDeep(promocodes.value);
		loading.value = false;
	});
}

async function confirmDeletingActive(index: string) {
	deletePromocode.value = index;
	await store.callPopup("Удалить этот промокод?").then((r: boolean) => {
		store
			.deletePromocode(deletePromocode.value)
			.then((r: ReturnedData | ReturnedError) => {
				if (r.success && r.data.is_deleted) {
					getPromocodes();
				}
				deletePromocode.value = "";
			});
	});
}

async function changePromocodeState(
	promocode: string,
	newPromocodeState: boolean
) {
	store
		.updatePromocode(promocode, { sended: newPromocodeState ? 1 : 0 })
		.then((r: ReturnedData | ReturnedError) => {
			if (r.success && r.data.is_updated) {
				getPromocodes();
			}
		});
}
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

	&__empty {
		width: 100%;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		img {
			width: 20rem;
			height: auto;
		}

		p {
			font: {
				size: 1.9rem;
				weight: bold;
			}
		}
	}
}
</style>