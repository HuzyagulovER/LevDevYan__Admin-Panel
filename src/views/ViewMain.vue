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
							<p>Фильтр</p>
						</div>
					</div>
					<div class="info__container">
						<div class="info__wrapper">
							<MainInfoItem
								value="2000"
								text="Зарегестрировано"
								color_from="#E9F7FB"
								color_to="#CAE6FF"
							/>
						</div>
						<div class="info__wrapper">
							<MainInfoItem
								value="2000"
								text="Подписки PSY"
								color_from="rgba(219, 213, 255, 0.52)"
								color_to="rgba(149, 152, 244, 0.52)"
							/>
						</div>
						<div class="info__wrapper">
							<MainInfoItem
								value="2000"
								text="Подписки Авокадо"
								color_from="#D5F8D6"
								color_to="#9CEA9E"
							/>
						</div>
					</div>
				</div>
				<div class="info__courses">
					<div class="info__container">
						<p class="info__title">Курсы</p>
						<div class="info__filter">
							<IconFilter />
							<p>Фильтр</p>
						</div>
					</div>
					<div class="info__container">
						<div class="info__wrapper">
							<MainInfoItem
								value="2000"
								text="Проходят сейчас"
								color_from="#E9F7FB"
								color_to="#CAE6FF"
							/>
						</div>
						<div class="info__wrapper">
							<MainInfoItem
								value="2000"
								text="Пройдено курсов"
								color_from="#D5F8D6"
								color_to="#9CEA9E"
							/>
						</div>
						<div class="info__wrapper">
							<MainInfoItem
								value="2000"
								text="Отказались"
								color_from="#FCEBEB"
								color_to="#F3C9C9"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import IconFilter from "@icons/IconFilter.vue";
import MainInfoItem from "@for-main/MainInfoItem.vue";
import TheMainBanner from "@for-main/TheMainBanner.vue";
</script>

<style lang="scss" scoped>
@import "../style.scss";

.home {
	flex: 1;
	display: flex;

	&__container {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.info {
		display: flex;
		flex-direction: column;

		& > div + div {
			margin-top: 2.75rem;
		}

		&__users,
		&__courses {
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
			padding: 0.6rem 1.2rem;
			border-radius: 0.71rem;
			cursor: pointer;

			svg {
				margin-right: 0.5rem;
				width: 2rem;
				height: 2rem;
				fill: var(--c__violet);
			}

			p {
				font-weight: 600;
			}
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