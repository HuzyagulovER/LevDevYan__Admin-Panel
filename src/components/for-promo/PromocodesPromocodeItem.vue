<template>
	<div class="promocode" :class="{ 'js-active': props.promocode.active }">
		<div class="promocode__container">
			<p class="promocode__promocode">
				{{ promocode.promocode }}
			</p>
			<div class="promocode__value">
				<p>{{ promocode.value }}</p>
			</div>
			<div class="promocode__type">
				<p>{{ promocode.type }}</p>
			</div>
			<div class="promocode__active active">
				<input
					type="checkbox"
					v-model="props.promocode.active"
					class="active__input"
				/>
				<div class="active__background"></div>
				<svg
					width="15"
					height="11"
					viewBox="0 0 15 11"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M5.47875 10.4498L0.776245 5.7473L1.95187 4.57167L5.47875 8.09855L13.0481 0.529175L14.2237 1.7048L5.47875 10.4498Z"
					/>
				</svg>
			</div>
			<div class="promocode__delete">
				<IconTrash @click="confirmDeletingActive" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, ref, Ref, toRef, watch } from "@vue/runtime-core";
import { StateTree } from "pinia";
import { Promocode } from "../../../helpers";
import IconTrash from "../add-comps/icons/IconTrash.vue";

const store = <StateTree>inject("Store");
const props = defineProps<{ promocode: Promocode; index: number }>();
const emit = defineEmits(["confirmDeletingActive"]);

const promo: Ref<Promocode> = ref({ ...props.promocode });

function confirmDeletingActive() {
	emit("confirmDeletingActive", props.index);
}
</script>

<style lang="scss" scoped>
.promocode {
	padding: 0.8rem 2rem;
	border: 0.25rem solid var(--c__light-violet);
	border-radius: 0.6rem;

	& + & {
		margin-top: 1.7rem;
	}

	&__container {
		display: flex;
		align-items: center;
		height: 2.3rem;
	}

	&__promocode {
		font: {
			family: var(--f__mazzard-sb);
			size: 1.5rem;
		}
		text-align: center;
		line-height: 1.5rem;
		margin: 0 3rem 0 1rem;
		min-width: 10rem;
	}

	&__value,
	&__type {
		background-color: var(--c__light-blue);
		align-self: stretch;
		display: flex;
		align-items: center;
		border-radius: 0.6rem;
		font-weight: bold;

		p {
			text-align: center;
			font: {
				// family: var(--f__mazzard-sb);
				size: 1.35rem;
			}
		}
	}

	&__value {
		margin-right: 2rem;
		padding: 0 2rem;
	}

	&__type {
		padding: 0 3rem;

		p {
			min-width: 6rem;
		}
	}

	&.js-active {
		.active {
			border-width: 0;

			&__background {
			}

			&__input ~ svg {
				transform: scale(1);
			}

			&__input ~ .active__background {
				transform: scale(1);
			}
		}
	}

	.active {
		margin-left: auto;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		border: 0.2rem solid #929292;
		transition: var(--transition-03);

		&__background {
			position: absolute;
			background-color: #04d370;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			z-index: 2;
		}

		&__input {
			position: absolute;
			width: 100%;
			height: 100%;
			opacity: 0;
			z-index: 4;
		}

		svg {
			fill: #fff;
			width: 60%;
			height: 60%;
			z-index: 3;
		}

		&__background,
		svg {
			transform: scale(0);
			transition: all 0.3s ease-in;
		}
	}

	&__delete {
		width: auto;
		height: 100%;
		cursor: pointer;
		margin-left: 2rem;

		svg {
			width: 100%;
			height: 100%;
			object-fit: cover;
			fill: var(--c__red);
		}
	}
}
</style>