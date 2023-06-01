<template>
	<section class="price-edit">
		<div class="price-edit__item-block price-item">
			<p class="price-edit__subtitle subtitle">Первая цена</p>
			<div class="price-edit__wrapper">
				<div class="price-item__input-container">
					<input
						type="number"
						v-model="price.price"
						class="price-edit__input form__input"
					/>
					<p>&#x20bd;</p>
				</div>
			</div>
		</div>
		<div class="price-edit__item-block second-price-item">
			<p class="price-edit__subtitle subtitle">Вторая цена</p>
			<div class="price-edit__wrapper">
				<div
					class="second-price-item__input-container"
					v-if="price.price_divison === 1"
				>
					<input
						type="number"
						v-model="price.second_price"
						:class="{ _hidden: !price.second_price_visibility }"
						class="price-edit__input form__input"
					/>
					<p>&#x20bd;</p>
				</div>
				<input
					type="number"
					step="1"
					min="1"
					v-model="price.price_divison"
					v-if="price.price_divison !== 1"
					:class="{ _hidden: !price.second_price_visibility }"
					class="price-edit__input form__input"
				/>

				<div class="price-edit__preview">
					<p
						:class="{
							strikethrough: price.strikethrough,
							_hidden: !price.second_price_visibility,
						}"
					>
						{{
							price.price_divison > 1
								? Math.floor(price.price / price.price_divison)
								: price.second_price
						}}
						<span>
							&#x20bd;<span v-if="price.second_price_per_month"
								>/мес</span
							></span
						>
					</p>
				</div>
			</div>
			<div class="price-edit__buttons">
				<Button
					class="price-edit__button"
					:color="price.second_price_per_month ? blueColor : ''"
					@click="
						price.second_price_per_month = price.second_price_per_month ? 0 : 1
					"
				>
					В месяц
				</Button>
				<Button
					class="price-edit__button"
					:color="price.price_divison !== 1 ? blueColor : ''"
					@click="price.price_divison = price.price_divison === 1 ? 2 : 1"
				>
					Разделить
				</Button>
				<Button
					class="price-edit__button"
					:color="price.strikethrough ? blueColor : ''"
					@click="price.strikethrough = price.strikethrough ? 0 : 1"
				>
					Зачеркнуть
				</Button>
				<Button
					class="price-edit__button"
					:color="!price.second_price_visibility ? blueColor : ''"
					@click="
						price.second_price_visibility = price.second_price_visibility
							? 0
							: 1
					"
				>
					Скрыть
				</Button>
			</div>
		</div>
		<div class="price-edit__item-block text-item">
			<p class="price-edit__subtitle subtitle">Текст под ценой - 1</p>
			<div class="price-edit__wrapper">
				<textarea
					type="text"
					v-model="price.text_1"
					:class="{ _hidden: !price.text_1_visibility }"
					class="price-edit__input form__textarea span-1-4"
				></textarea>
			</div>
			<div class="price-edit__buttons">
				<Button
					class="price-edit__button"
					:color="!price.text_1_visibility ? blueColor : ''"
					@click="price.text_1_visibility = price.text_1_visibility ? 0 : 1"
				>
					Скрыть
				</Button>
			</div>
		</div>
		<div class="price-edit__item-block text-item">
			<p class="price-edit__subtitle subtitle">Текст под ценой - 2</p>
			<div class="price-edit__wrapper">
				<textarea
					type="text"
					v-model="price.text_2"
					:class="{ _hidden: !price.text_2_visibility }"
					class="price-edit__input form__textarea span-1-4"
				></textarea>
			</div>
			<div class="price-edit__buttons">
				<Button
					class="price-edit__button"
					:color="!price.text_2_visibility ? blueColor : ''"
					@click="price.text_2_visibility = price.text_2_visibility ? 0 : 1"
				>
					Скрыть
				</Button>
			</div>
		</div>
		<ButtonColored
			class="price-edit__save"
			@click="updatePrice"
		></ButtonColored>
	</section>
</template>

<script setup lang="ts">
import ButtonColored from "@add-comps/ButtonColored.vue";
import Button from "@for-subscriptions/Button.vue";
import { useRoute, useRouter } from "vue-router";
import { Store } from "../stores/store";
import { StoreGeneric, storeToRefs } from "pinia";
import {
	computed,
	ComputedRef,
	inject,
	onUnmounted,
	ref,
	Ref,
	watch,
} from "vue";
import { Price, Prices, ReturnedData, ReturnedError } from "../../helpers";

const route = useRoute();
const router = useRouter();
const store = <StoreGeneric>inject("Store");
const { mainTitle, loading, apps } = storeToRefs(store);
const clearVariable = <Function>inject("clearVariable");
const blueColor = "#E7FBFF";

const price: Ref<Price> = ref({
	id: "",
	name: "",
	price: 0,
	second_price: 0,
	second_price_visibility: 1,
	text_1: "",
	text_1_visibility: 1,
	text_2: "",
	text_2_visibility: 1,
	strikethrough: 0,
	second_price_per_month: 0,
	price_divison: 1,
});
const app: ComputedRef<string> = computed(() =>
	route.params.app ? <string>route.params.app : "psy"
);
const subscriptionId: Ref<string> = ref(<string>route.params.subscriptionId);
const currentError: Ref<string> = ref("");

watch(
	() => route.params.subscriptionId,
	() => {
		subscriptionId.value = <string>route.params.subscriptionId;
		getPrice();
	}
);

watch(
	() => price.value.price_divison,
	() => {
		if (price.value.price_divison < 1) {
			price.value.price_divison = 1;
		}
	}
);

onUnmounted(() => {
	mainTitle.value = "";
});

getPrice();

async function getPrice(): Promise<void> {
	loading.value = true;
	await store.getPrices(app.value, subscriptionId.value).then((r: Prices) => {
		price.value = r[subscriptionId.value as keyof Prices];
		let curApp = apps.value.filter(
			(i: string) => i.toLowerCase() === app.value
		);
		mainTitle.value =
			"Редактирование подписки " + curApp[0] + " (" + price.value.name + ")";
		loading.value = false;
	});
}

function updatePrice() {
	loading.value = true;
	store
		.updatePrice(app.value, price.value)
		.then((r: ReturnedData | ReturnedError) => {
			loading.value = false;
			if (r.success) {
				price.value = clearVariable(price.value);
				router.push({ path: "/subscriptions", query: { app: app.value } });
			} else {
				currentError.value = r.error.status;
				setTimeout(() => {
					currentError.value = "";
				}, 2000);
			}
		});
}
</script>

<style lang="scss" scoped>
@import "../style.scss";

.price-edit {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	padding-right: 50rem;

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

	&__wrapper {
		& > *.span-1-4 {
			grid-column: 1/4;
		}
	}

	&__input {
		margin: 0;
	}

	&__buttons {
		margin-top: 1rem;
	}

	&__button {
		color: black;
		border: 0.1rem solid var(--c__grey);
		border-radius: 0.5rem;
		font-size: 1.5rem;
		padding: 0;
	}

	&__save {
		margin-top: 2rem;
	}

	.second-price-item {
		.price-edit__buttons {
			grid-template: 1fr / repeat(4, 1fr);
		}

		._hidden {
			color: var(--c__grey);
		}
	}

	.text-item {
		._hidden {
			color: var(--c__grey);
		}

		textarea {
			min-height: 5rem;
			max-height: 10rem;
		}
	}

	.second-price-item,
	.price-item {
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
					background-color: var(--c__grey);
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