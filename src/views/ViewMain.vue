<template>
	<section class="home">
		<div class="home__container">
			<TheMainBanner />
			<div class="home__info info">
				<div class="info__users">
					<div class="info__container">
						<p class="info__title">Пользователи</p>
						<div class="info__filter">
							<IconFilter />
							<select v-model="filters.users">
								<option v-for="selection in selections" :key="selection.value" :value="selection.value">
									{{ selection.text }}
								</option>
							</select>
						</div>
					</div>
					<div class="info__container">
						<div class="info__wrapper">
							<MainInfoItem :value="commonInfo.users.all_users" text="Все пользователи" color_from="#E9F7FB"
								color_to="#CAE6FF" />
						</div>
						<div class="info__wrapper">
							<MainInfoItem :value="commonInfo.users.psy" text="PSY" color_from="rgba(219, 213, 255, 0.52)"
								color_to="rgba(149, 152, 244, 0.52)" />
						</div>
						<div class="info__wrapper">
							<MainInfoItem :value="commonInfo.users.avocado" text="Авокадо" color_from="#D5F8D6"
								color_to="#9CEA9E" />
						</div>
					</div>
				</div>
				<div class="info__subscriptions">
					<div class="info__container">
						<p class="info__title">Подписки</p>
						<div class="info__filter">
							<IconFilter />
							<select v-model="filters.subs">
								<option v-for="selection in selections" :key="selection.value" :value="selection.value">
									{{ selection.text }}
								</option>
							</select>
						</div>
					</div>
					<div class="info__container">
						<div class="info__wrapper">
							<MainInfoItem :value="commonInfo.subs.all_subs" text="Все подписки" color_from="#E9F7FB"
								color_to="#CAE6FF" />
						</div>
						<div class="info__wrapper">
							<MainInfoItem :value="commonInfo.subs.psy" text="PSY" color_from="rgba(219, 213, 255, 0.52)"
								color_to="rgba(149, 152, 244, 0.52)" />
						</div>
						<div class="info__wrapper">
							<MainInfoItem :value="commonInfo.subs.avocado" text="Авокадо" color_from="#D5F8D6"
								color_to="#9CEA9E" />
						</div>
					</div>
				</div>
				<div class="info__courses">
					<div class="info__container">
						<p class="info__title">Курсы</p>
					</div>
					<div class="info__container">
						<div class="info__wrapper">
							<MainInfoItem :value="commonInfo.courses.active_courses" text="Проходят сейчас" color_from="#D7FFF0"
								color_to="#98F2D2" />
						</div>
						<div class="info__wrapper">
							<MainInfoItem :value="commonInfo.courses.completed_courses" text="Пройдено курсов"
								color_from="#D5F8D6" color_to="#9CEA9E" />
						</div>
						<div class="info__wrapper">
							<MainInfoItem :value="commonInfo.courses.rejected_courses" text="Отказались" color_from="#FCEBEB"
								color_to="#F3C9C9" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import IconFilter from "@icons/IconFilter.vue";
import IconTrash from "@icons/IconTrash.vue";
import MainInfoItem from "@for-main/MainInfoItem.vue";
import TheMainBanner from "@for-main/TheMainBanner.vue";
import { inject, Ref, ref, watch } from "vue";
import { StoreGeneric, storeToRefs } from "pinia";
import { PopupAdditionFields, StringObject } from "../../helpers";

const store = <StoreGeneric>inject("Store");
const { loading, commonInfo } = storeToRefs(store);

const selections: Array<StringObject> = [
	{
		text: "Все",
		value: "all",
	},
	{
		text: "Android",
		value: "android",
	},
	{
		text: "Apple",
		value: "apple",
	},
];
const filters: Ref<StringObject> = ref({
	users: "all",
	subs: "all",
});

getUsersData();

watch(
	() => filters.value,
	() => {
		console.log(filters.value);
		getUsersData();
	},
	{
		deep: true,
	}
);
function getUsersData(): void {
	loading.value = true;
	store.getUsersData(filters.value).then((): void => {
		loading.value = false;
	});
}

</script>

<style lang="scss" scoped>
@import "@/style.scss";

.home {
	flex: 1;
	display: flex;

	&__container {
		display: flex;
		flex-direction: column;
		width: 100%;

		&>*+* {
			margin-top: 2.75rem;
		}
	}

	.info {
		display: flex;
		flex-direction: column;

		&>div+div {
			margin-top: 2.75rem;
		}

		&>* {
			display: flex;
			flex-direction: column;
			box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.13);
			border-radius: 3rem;
			padding: 2.2rem 3.4rem;
		}

		&__wrapper {
			display: flex;
			align-items: stretch;
		}

		&__container {
			&:first-child {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 1.8rem;
			}

			&:last-child {
				flex: 1;
				display: grid;
				grid-template: 1fr / repeat(3, 1fr);
				gap: 2.75rem;
			}
		}

		&__title {
			font-family: var(--f__mazzard-sb);
			font-weight: 600;
			font-size: 2.3rem;
		}

		&__filter {
			display: flex;
			align-items: center;
			background: rgba(219, 213, 255, 0.52);
			border-radius: 0.71rem;
			position: relative;

			svg {
				position: absolute;
				top: 50%;
				left: 1rem;
				transform: translateY(-50%);
				width: 2rem;
				height: 2rem;
				fill: $--c__violet;
				pointer-events: none;
			}

			select {
				width: 100%;
				height: 100%;
				padding: 1rem 1.2rem 1rem 3.8rem;
				font-weight: 600;
				background: transparent;
				border: 0;
				cursor: pointer;
			}
		}
	}

	&__user-delete {
		display: flex;
		align-self: flex-start;
		align-items: center;
		width: auto;
		height: auto;
		padding: 0.8rem 2rem;
		border: 0.1rem solid $--c__violet;
		border-radius: 1.2rem;
		background-color: #fff;
		cursor: pointer;

		p {
			margin-left: 1rem;
			font-size: 2rem;
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		.info {
			&__container:nth-child(2) {
				display: flex;
				flex-direction: column;
			}

			&__filter {
				p {
					font-size: 1.3rem;
					font-weight: 600;
				}
			}
		}
	}
}
</style>