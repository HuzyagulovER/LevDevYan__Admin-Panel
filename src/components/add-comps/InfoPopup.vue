<template>
	<Teleport to="body">
		<Transition name="list">
			<div class="info-popup" v-if="info_popup.isActive">
				<div class="info-popup__container">
					<img src="@images/Popup.png" alt="" width="164" height="116" class="info-popup__image" />
					<p class="info-popup__text"
						:class="{ _success: info_popup.additionFields.isSuccess, _error: info_popup.additionFields.isError }">
						{{ info_popup.text }}
					</p>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import { inject } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";

const store = <StoreGeneric>inject("Store");
const { info_popup } = storeToRefs(store);
</script>

<style scoped lang="scss">
@import "../../style.scss";

.info-popup {
	position: absolute;
	z-index: 9;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 0 5rem 0 var(--c__grey);
	border-radius: 2rem;
	background-color: var(--c__white);
	padding: 2rem;

	&__container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem 10rem;
		position: relative;
	}

	&__image {
		width: 12rem;
		height: auto;
		margin-bottom: 3rem;
	}

	&__text {
		margin-bottom: 3rem;
		text-align: center;

		font: {
			family: var(--f__montserrat-sb);
			size: 2rem;
		}

		&._success {
			color: $input-success-color;
		}

		&._error {
			color: $input-error-color;
		}
	}

	&__wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	&__button {
		background-color: var(--c__white);
		border: 0.25rem solid var(--c__light-violet);
		padding: 0.6rem 5rem;
		border-radius: 0.8rem;
		transition: var(--transition-03);
		cursor: pointer;

		font: {
			family: var(--f__montserrat-sb);
			size: 1.5rem;
		}

		&+& {
			margin-left: 4rem;
		}

		&:focus,
		&:hover {
			background-color: var(--c__violet);
			border-color: var(--c__violet);
			color: var(--c__white);
		}
	}

	&__close {
		position: absolute;
		top: 0;
		right: 0;
		width: 3rem;
		height: 3rem;
		cursor: pointer;

		svg {
			width: 100%;
			height: 100%;
			fill: var(--c__violet);
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		position: fixed;
		width: 90%;
	}
}
</style>