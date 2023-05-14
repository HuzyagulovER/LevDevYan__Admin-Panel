<template>
	<div class="banner">
		<div class="banner__container">
			<div class="banner__info info">
				<div class="info__date">
					<IconCalendar />
					<p>{{ currentTime }}</p>
				</div>
				<p class="info__welcome">Привет , администратор!</p>
				<p class="info__wish">Хорошего дня!</p>
			</div>
			<img
				src="@images/cat.png"
				alt=""
				class="banner__image"
				width="92"
				height="120"
			/>
			<div class="banner__backgroud background">
				<div class="background__container">
					<div class="background__bubbles_first"><MainBubblesList /></div>
					<div class="background__bubbles_second"><MainBubblesList /></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import IconCalendar from "@add-comps/icons/IconCalendar.vue";
import MainBubblesList from "./MainBubblesList.vue";

const store = <StoreGeneric>inject("Store");
let { currentTime } = storeToRefs(store);
</script>

<style lang="scss" scoped>
@import "../../style.scss";

.banner {
	height: 13rem;
	background: linear-gradient(
		91.25deg,
		rgba(219, 211, 255, 0.52) 1.31%,
		rgba(255, 214, 251, 0.52) 77.81%
	);
	padding: 0.75rem;
	border-radius: 3rem;
	margin-bottom: 2.75rem;

	&__container {
		display: flex;
		position: relative;
		height: 100%;
		width: 100%;
	}

	.info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		font-weight: bold;
		margin-right: 1rem;
		padding: 1.35rem 2.05rem;

		&__date {
			display: flex;
			align-items: center;
			height: 3.3rem;
			width: auto;
			padding: 0.55rem 0.8rem;
			background-color: var(--c__white);
			border-radius: 0.6rem;

			p {
				font-size: 1.2rem;
			}
			svg {
				height: 100%;
				width: auto;
				margin-right: 1rem;
				fill: var(--c__violet);
			}
		}

		&__welcome {
			font-family: var(--f__mazzard-sb);
			font-size: 2.1rem;
			margin-top: 0.5rem;
		}

		&__wish {
			font-size: 1.2rem;
		}
	}

	&__image {
		height: 100%;
		width: auto;
		transform: scale(1.2);
		transform-origin: center bottom;
	}

	.background {
		height: 100%;
		width: 17rem;
		margin-left: auto;

		&__container {
			height: 100%;
			width: 100%;
			display: flex;
			align-items: flex-end;
		}

		&__bubbles {
			&_first {
				height: 100%;
				width: 3.5rem;
				transform: rotate(45deg);
				margin-right: 2rem;
			}

			&_second {
				height: 90%;
				width: 3rem;
				transform-origin: center 70%;
				transform: rotate(70deg);
			}
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		.background {
			display: none;
		}

		.info {
			&__welcome {
				font-size: 1.7rem;
			}
		}

		&__image {
			margin-left: auto;
			transform: scale(1.1);
		}
	}
}
</style>