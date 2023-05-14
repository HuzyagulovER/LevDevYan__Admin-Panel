<template>
	<section class="subscriptions">
		<div class="subscriptions__top-line top-line">
			<ButtonsPages class="top-line__buttons-pages" />
		</div>
		<div class="subscriptions__block active">
			<p class="subscriptions__subtitle">Активные</p>
			<div class="subscriptions__wrapper">
				<SubscriptionsItem class="subscriptions__item item" :color="'#F3FFF4'">
					<p class="item__name">1 месяц</p>
					<p class="item__value">220</p>
				</SubscriptionsItem>
				<SubscriptionsItem class="subscriptions__item item" :color="'#F3FFF4'">
					<p class="item__name">3 месяца</p>
					<p class="item__value">220</p>
				</SubscriptionsItem>
				<SubscriptionsItem class="subscriptions__item item" :color="'#F3FFF4'">
					<p class="item__name">1 год</p>
					<p class="item__value">220</p>
				</SubscriptionsItem>
				<SubscriptionsItem class="subscriptions__item item" :color="'#F3FFF4'">
					<p class="item__name">Навсегда</p>
					<p class="item__value">220</p>
				</SubscriptionsItem>
			</div>
		</div>

		<div class="subscriptions__block settings">
			<p class="subscriptions__subtitle">Настройки</p>
			<div class="subscriptions__wrapper">
				<SubscriptionsItem
					class="subscriptions__item item"
					:color="'#F3FCFF'"
					v-for="(price, j) in prices"
					:key="j"
				>
					<p class="item__name">{{ price.name }}</p>
					<p class="item__value">{{ price.price }} <span>&#x20bd;</span></p>
					<p class="item__second-price" v-if="price.second_price !== -1">
						{{
							Math.floor(
								(price.second_price ? price.second_price : price.price) /
									price.price_divison
							)
						}}
						<span>
							&#x20bd;<span v-if="price.second_price_per_month"
								>/мес</span
							></span
						>
					</p>
					<p class="item__second-price empty" v-else>Текста нет</p>
					<div class="item__icon">
						<RouterLink :to="'/subscription-edit/' + app + '/' + price.id">
							<IconPencil
						/></RouterLink>
					</div>
				</SubscriptionsItem>
			</div>
		</div>

		<div class="subscriptions__block schedule">
			<p class="subscriptions__subtitle">Запланированные платежи</p>
			<div class="subscriptions__wrapper">
				<div class="schedule__item item">
					<p class="item__name">1 месяц</p>
					<p class="item__value">249 <span>&#x20bd;</span></p>
					<p class="item__user-email">email@email.com</p>
					<p class="item__user-id">id: 8000</p>
					<p class="item__pay-number">платеж 2</p>
				</div>
				<div class="schedule__item item">
					<p class="item__name">Год</p>
					<p class="item__value">990 <span>&#x20bd;</span></p>
					<p class="item__user-email">email@email.com</p>
					<p class="item__user-id">id: 8000</p>
					<p class="item__pay-number">платеж 5</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import ButtonsPages from "@add-comps/ButtonsPages.vue";
import IconPencil from "@icons/IconPencil.vue";
import SubscriptionsItem from "@for-subscriptions/SubscriptionsItem.vue";
import { useRoute } from "vue-router";
import { Store } from "../stores/store";
import { StoreGeneric, storeToRefs } from "pinia";
import { computed, ComputedRef, inject, ref, Ref } from "vue";
import {
	Prices,
	Price,
	ActiveSubscriptions,
	ActiveSubscription,
	ScheduleSubscriptions,
	ScheduleSubscription,
} from "../../helpers";

const route = useRoute();
const store = <StoreGeneric>inject("Store");
const { loading } = storeToRefs(store);

const prices: Ref<Prices> = ref({});
const activeSubscriptions: Ref<ActiveSubscriptions> = ref({});
const scheduleSubscriptions: Ref<ScheduleSubscriptions> = ref({});
const app: ComputedRef<string> = computed(() =>
	route.query.app ? <string>route.query.app : "psy"
);

(async () => {
	loading.value = true;
	await getPrices();
	await getActiveSubscriptions();
	await getScheduleSubscriptions();
	loading.value = false;
})();

async function getPrices(): Promise<void> {
	await store.getPrices(app.value).then((r: Prices) => {
		prices.value = r;
	});
}
async function getActiveSubscriptions(): Promise<void> {
	await store
		.getActiveSubscriptions(app.value)
		.then((r: ActiveSubscriptions) => {
			activeSubscriptions.value = r;
		});
}
async function getScheduleSubscriptions(): Promise<void> {
	await store
		.getScheduleSubscriptions(app.value)
		.then((r: ScheduleSubscriptions) => {
			scheduleSubscriptions.value = r;
		});
}
</script>

<style lang="scss" scoped>
.subscriptions {
	padding-right: 20rem;

	.top-line {
		margin-bottom: 2rem;
	}

	&__block + &__block {
		margin-top: 3rem;
	}

	&__subtitle {
		margin-bottom: 1rem;
		font: {
			size: 2rem;
			family: var(--f__mazzard-sb);
		}
	}

	&__wrapper {
		display: grid;
		grid-template: 1fr 1fr / 1fr 1fr;
		gap: 2rem;
	}

	.item {
		&__name,
		&__value {
			font: {
				size: 2rem;
			}
		}
		&__name {
			font: {
				family: var(--f__mazzard-r);
			}
		}
		&__value {
			text-align: right;
			font: {
				family: var(--f__mazzard-b);
			}
		}

		&__icon {
			display: flex;
			justify-content: flex-end;
			& * {
				fill: var(--c__blue);
			}

			a {
				width: 2rem;
				height: 2rem;
			}

			svg {
				width: 100%;
				height: 100%;
				object-fit: contain;
				cursor: pointer;
			}
		}

		&__second-price {
			display: flex;
			align-items: flex-end;
			font: {
				size: 1.6rem;
			}

			&.empty {
				color: var(--c__grey);
			}
		}

		span {
			line-height: 1.6rem;
			margin-left: 0.5rem;
			font: {
				size: 0.92em;
			}
		}
	}

	.settings {
		.item {
			padding-right: 2.2rem !important;

			span > span {
				margin: 0;
				font-size: 1.085em;
			}
		}
	}

	.schedule {
		.subscriptions__wrapper {
			display: flex;
			flex-direction: column;
			background-color: rgba(251, 245, 187, 0.17);
			padding: 2rem 3rem;
			border: 0.1rem solid var(--c__light-violet);
			border-radius: 1.6rem;
		}

		.item {
			// display: grid;
			// grid-template: 1fr / 2fr 2fr 3fr 2fr 2fr;
			// gap: 1rem;
			display: flex;
			justify-content: space-between;

			& > * + * {
				margin-left: 2rem;
			}

			&__name {
				flex: 1;
			}
			&__value {
				flex: 1;
			}
			&__user-email {
				flex: 2;
			}
			&__user-id {
				flex: 1;
			}
			&__pay-number {
				flex: 1;
			}

			&__value,
			&__user-email,
			&__user-id {
				text-align: center;
			}
			&__pay-number {
				text-align: end;
			}

			&__user-email,
			&__user-id,
			&__pay-number {
				font: {
					size: 1.7rem;
				}
			}
		}
	}
}
</style>