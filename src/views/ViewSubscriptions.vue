<template>
	<section class="subscriptions">
		<div class="subscriptions__top-line top-line">
			<ButtonsPages class="top-line__buttons-pages" />
			<Filter :init-value="subs" @on-change-value="subs = $event" class="top-line__filter" />
		</div>
		<div class="subscriptions__block active">
			<p class="subscriptions__subtitle subtitle">Активные</p>
			<div class="subscriptions__wrapper">
				<SubscriptionsItem class="subscriptions__item item" :color="'#F3FFF4'"
					v-for="(activeSubscription, j) in activeSubscriptions" :key="j">
					<p class="item__name">{{ activeSubscription['name' as keyof ActiveSubscription] }}</p>
					<p class="item__value">{{ activeSubscription['count' as keyof ActiveSubscription] }}</p>
				</SubscriptionsItem>
			</div>
		</div>

		<div class="subscriptions__block settings">
			<p class="subscriptions__subtitle subtitle">Настройки</p>
			<div class="subscriptions__wrapper">
				<SubscriptionsItem class="subscriptions__item item" :color="'#F3FCFF'" v-for="(price, j) in prices" :key="j">
					<p class="item__name">{{ price['name' as keyof Price] }}</p>
					<p class="item__value">{{ price['price' as keyof Price] }} <span>&#x20bd;</span></p>
					<div class="item__second-price">
						<p :class="{ strikethrough: price['strikethrough' as keyof Price] }"
							v-if="price['second_price_visibility' as keyof Price]">
							{{
								price['price_divison' as keyof Price] > 1
								? Math.floor(
									(price['price' as keyof Price] as number)
									/
									(price['price_divison' as keyof Price] as number)
								)
								: price['second_price' as keyof Price]
							}}
							<span>
								&#x20bd;<span v-if="price['second_price_per_month' as keyof Price]">/мес</span></span>
						</p>
						<p class="empty" v-else>Текста нет</p>
					</div>
					<div class="item__icon">
						<RouterLink :to="'/subscription-edit/' + app + '/' + price['id' as keyof Price]">
							<IconPencil />
						</RouterLink>
					</div>
				</SubscriptionsItem>
			</div>
		</div>

		<div class="subscriptions__block schedule">
			<div class="schedule__top-line">
				<p class="subscriptions__subtitle subtitle">Запланированные платежи</p>
				<input type="date" class="schedule__date-select" v-model="date" @change.prevent="selectDate" />
			</div>
			<div class="subscriptions__wrapper" v-if="Object.keys(scheduleSubscriptionTypes).length !== 0">
				<div class="subscriptions__container" v-for="(scheduleSubscriptionType, j) in scheduleSubscriptionTypes"
					:key="j">
					<div class="schedule__item item"
						v-for="scheduleSubscription in scheduleSubscriptionType['users' as keyof ScheduleSubscriptionType]"
						:key="j">
						<p class="item__name">{{ scheduleSubscriptionType['name' as keyof ScheduleSubscriptionType] }}</p>
						<p class="item__value">
							{{ scheduleSubscriptionType['price' as keyof ScheduleSubscriptionType] }} <span>&#x20bd;</span>
						</p>
						<p class="item__user-email">{{ (<unknown>scheduleSubscription as ScheduleSubscriptionTypeUser).email }}
						</p>
						<p class="item__user-id">id: {{ (<unknown>scheduleSubscription as ScheduleSubscriptionTypeUser).id }}</p>
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
import Filter from "@add-comps/Filter.vue";
import ButtonsPages from "@add-comps/ButtonsPages.vue";
import IconPencil from "@icons/IconPencil.vue";
import SubscriptionsItem from "@for-subscriptions/SubscriptionsItem.vue";
import { useRoute } from "vue-router";
import { StoreGeneric, storeToRefs } from "pinia";
import { computed, ComputedRef, inject, ref, Ref, watch } from "vue";
import {
	Prices,
	Price,
	ActiveSubscriptions,
	ActiveSubscription,
	ScheduleSubscriptionTypes,
	ScheduleSubscriptionType,
	ScheduleSubscriptionTypeUser,
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
const subs: Ref<string> = ref('all')
loadData();

watch(
	() => app.value,
	() => loadData()
);
watch(
	() => subs.value,
	async () => {
		loading.value = true;
		await getActiveSubscriptions();
		loading.value = false;
	}
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
		.getActiveSubscriptions(app.value, subs.value)
		.then((r: ActiveSubscriptions) => {
			activeSubscriptions.value = r;
		});
}
async function getScheduleSubscriptions(date: string): Promise<void> {
	await store
		.getScheduleSubscriptions(app.value, date)
		.then((r: ScheduleSubscriptionTypes) => {
			scheduleSubscriptionTypes.value = r;
			console.log(scheduleSubscriptionTypes.value);

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
@import "@/style.scss";

.subscriptions {
	padding-right: 20rem;

	.top-line {
		display: flex;
		align-items: center;
		margin-bottom: 2rem;

		&__button-create {
			margin-left: auto;
		}

		&__filter {
			margin-left: auto;
		}
	}

	&__block+&__block {
		margin-top: 3rem;
	}

	&__subtitle {}

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
				fill: $--c__blue;
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
					color: $--c__grey;
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

			span>span {
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
			border: 0.1rem solid $--c__light-violet;
			border-radius: 1.6rem;
			gap: 0;
		}

		.subscriptions__container {
			&+.subscriptions__container {
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

			color: $--c__violet;
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

			&>*+* {
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

		&__item+.item {
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
				&>* {
					font-size: 1.2rem;

					&+* {
						margin-left: 1rem;
					}
				}
			}
		}

		.top-line {
			display: grid;
			grid-template: 1fr 1fr / repeat(6, 1fr);
			gap: 1.5rem 2.5rem;
			height: auto;

			&__button-create {
				width: 100%;
				grid-column: 2/6;
			}
		}
	}
}
</style>