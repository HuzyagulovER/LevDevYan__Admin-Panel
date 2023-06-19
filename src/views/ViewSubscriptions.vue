<template>
	<section class="subscriptions">
		<div class="subscriptions__top-line top-line">
			<ButtonsPages class="top-line__buttons-pages" />
		</div>
		<div class="subscriptions__block active">
			<p class="subscriptions__subtitle subtitle">Активные</p>
			<div class="subscriptions__wrapper">
				<SubscriptionsItem
					class="subscriptions__item item"
					:color="'#F3FFF4'"
					v-for="(activeSubscription, j) in activeSubscriptions"
					:key="j"
				>
					<p class="item__name">{{ activeSubscription.name }}</p>
					<p class="item__value">{{ activeSubscription.count }}</p>
				</SubscriptionsItem>
			</div>
		</div>

		<div class="subscriptions__block settings">
			<p class="subscriptions__subtitle subtitle">Настройки</p>
			<div class="subscriptions__wrapper">
				<SubscriptionsItem
					class="subscriptions__item item"
					:color="'#F3FCFF'"
					v-for="(price, j) in prices"
					:key="j"
				>
					<p class="item__name">{{ price.name }}</p>
					<p class="item__value">{{ price.price }} <span>&#x20bd;</span></p>
					<div class="item__second-price">
						<p
							:class="{ strikethrough: price.strikethrough }"
							v-if="price.second_price_visibility"
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
						<p class="empty" v-else>Текста нет</p>
					</div>
					<div class="item__icon">
						<RouterLink :to="'/subscription-edit/' + app + '/' + price.id">
							<IconPencil
						/></RouterLink>
					</div>
				</SubscriptionsItem>
			</div>
		</div>

		<div class="subscriptions__block schedule">
			<div class="schedule__top-line">
				<p class="subscriptions__subtitle subtitle">Запланированные платежи</p>
				<input
					type="date"
					class="schedule__date-select"
					v-model="date"
					@change.prevent="selectDate"
				/>
			</div>
			<div
				class="subscriptions__wrapper"
				v-if="Object.keys(scheduleSubscriptionTypes).length !== 0"
			>
				<div
					class="subscriptions__container"
					v-for="(scheduleSubscriptionType, j) in scheduleSubscriptionTypes"
					:key="j"
				>
					<div
						class="schedule__item item"
						v-for="scheduleSubscription in scheduleSubscriptionType.users"
						:key="scheduleSubscription.id"
					>
						<p class="item__name">{{ scheduleSubscriptionType.name }}</p>
						<p class="item__value">
							{{ scheduleSubscriptionType.price }} <span>&#x20bd;</span>
						</p>
						<p class="item__user-email">{{ scheduleSubscription.email }}</p>
						<p class="item__user-id">id: {{ scheduleSubscription.id }}</p>
						<p class="item__pay-number">платеж X</p>
					</div>
				</div>
			</div>
			<div class="subscriptions__wrapper empty" v-else>
				<p>Оплат на сегодня не намечается &#128564;</p>
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
import { computed, ComputedRef, inject, ref, Ref, watch } from "vue";
import {
	Prices,
	Price,
	ActiveSubscriptions,
	ScheduleSubscriptionTypes,
} from "../../helpers";

const route = useRoute();
const store = <StoreGeneric>inject("Store");
const { loading } = storeToRefs(store);

const prices: Ref<Prices> = ref({});
const activeSubscriptions: Ref<ActiveSubscriptions> = ref({});
const scheduleSubscriptionTypes: Ref<ScheduleSubscriptionTypes> = ref({});
const date: Ref<string> = ref(dateForm());
const app: ComputedRef<string> = computed(() =>
	route.query.app ? <string>route.query.app : "psy"
);

loadData();

watch(
	() => app.value,
	() => loadData()
);

async function loadData(): Promise<void> {
	loading.value = true;
	await getActiveSubscriptions();
	await getPrices();
	await getScheduleSubscriptions(date.value);
	loading.value = false;
}

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
async function getScheduleSubscriptions(date: string): Promise<void> {
	await store
		.getScheduleSubscriptions(app.value, date)
		.then((r: ScheduleSubscriptionTypes) => {
			scheduleSubscriptionTypes.value = r;
			return;
		});
}
function dateForm(): string {
	const d: Date = new Date();

	let day: string = ("00" + d.getDate()).slice(-2);
	let month: string = ("00" + (d.getMonth() + 1)).slice(-2);
	let year: number = d.getFullYear();

	return `${year}-${month}-${day}`;
}
function selectDate() {
	loading.value = true;
	getScheduleSubscriptions(date.value).then(() => (loading.value = false));
}
</script>

<style lang="scss" scoped>
@import "../style.scss";

.subscriptions {
	padding-right: 20rem;

	.top-line {
		margin-bottom: 2rem;
	}

	&__block + &__block {
		margin-top: 3rem;
	}

	&__subtitle {
	}

	&__wrapper {
		display: grid;
		grid-template: 1fr / 1fr 1fr;
		grid-auto-rows: 1fr;
		gap: 2rem;

		&.empty {
			display: flex;
			align-items: center;
			justify-content: center;

			p {
				font: {
					size: 2rem;
				}
			}
		}
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

			p {
				position: relative;

				&.empty {
					color: var(--c__grey);
				}

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
			}
		}

		span {
			line-height: 1.6rem;
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
			gap: 0;
		}

		.subscriptions__container {
			& + .subscriptions__container {
				margin-top: 2rem;
			}
		}

		&__top-line {
			display: flex;
			justify-content: space-between;
			margin-bottom: 1rem;

			p {
				margin-bottom: 0;
			}
		}

		&__date-select {
			border: 0;
			background-color: transparent;
			font: {
				size: 2rem;
				weight: bold;
			}
			color: var(--c__violet);
			width: 13rem;

			&::-webkit-inner-spin-button {
				display: none;
				width: 0;
			}
			&::-webkit-calendar-picker-indicator {
				background: url(/assets/Down-arrow.svg) no-repeat center/contain;
				width: 1.1rem;
				height: 100%;
			}
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

			&__name,
			&__value,
			&__user-id,
			&__pay-number {
				flex: 1;
			}
			&__user-email {
				flex: 3;
				word-break: break-word;
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

			&__pay-number {
				display: none;
			}
		}

		&__item + .item {
			margin-top: 2rem;
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		padding: 0;

		&__wrapper {
			grid-template: 1fr / 1fr;
		}

		.schedule {
			.subscriptions__wrapper {
				padding: 2rem 2rem;
			}

			&__date-select {
				font-size: 1.5rem;
				width: auto;
				max-width: 11rem;

				&::-webkit-calendar-picker-indicator {
					width: 1rem;
				}
			}

			.item {
				& > * {
					font-size: 1.2rem;
					& + * {
						margin-left: 1rem;
					}
				}
			}
		}
	}
}
</style>