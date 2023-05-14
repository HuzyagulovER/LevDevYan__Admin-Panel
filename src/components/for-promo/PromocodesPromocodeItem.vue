<template>
	<div class="promocode">
		<div class="promocode__container">
			<p class="promocode__promocode">
				{{ promocode.promocode }}
			</p>
			<div class="promocode__wrapper">
				<div class="promocode__value" v-if="promocode.value">
					<p>{{ promocode.value }}</p>
				</div>
				<div class="promocode__type" v-if="promocode.type">
					<p>{{ promocode.type }}</p>
				</div>
			</div>
			<Checkbox
				:defaultChecked="props.promocode.sended"
				class="promocode__active"
				@change-state="changePromocodeState"
			/>
			<!-- <div
				class="promocode__active active"
				:class="{ _active: props.promocode.sended }"
			>
				<input
					type="checkbox"
					v-model="props.promocode.sended"
					class="active__input"
					@change.prevent="changePromocodeState"
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
			</div> -->
			<div class="promocode__delete">
				<IconTrash @click="confirmDeleting" class="icon-trash" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, ref, Ref, toRef, watch } from "@vue/runtime-core";
import { StateTree } from "pinia";
import { Promocode } from "../../../helpers";
import Checkbox from "@add-comps/Checkbox.vue";
import IconTrash from "@add-comps/icons/IconTrash.vue";

const store = <StateTree>inject("Store");
const props = defineProps<{ promocode: Promocode }>();
const emit = defineEmits(["confirmDeleting", "changePromocodeState"]);

const promo: Ref<Promocode> = ref({ ...props.promocode });

function confirmDeleting() {
	emit("confirmDeleting", props.promocode.promocode);
}

function changePromocodeState(state: boolean): void {
	emit("changePromocodeState", props.promocode.promocode, state);
}
</script>

<style lang="scss" scoped>
@import "../../style.scss";

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

	&__wrapper {
		display: flex;
		height: 100%;
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

	&__delete {
		width: auto;
		height: 100%;
		margin-left: auto;

		svg {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		padding: 1rem 2rem;

		&__container {
			flex-wrap: wrap;
			height: auto;
			overflow: hidden;

			& > * {
				order: 4;
			}
		}

		&__wrapper {
			width: 100%;
			margin-top: 1.5rem;
		}

		&__value,
		&__type {
			padding: 0.4rem 3rem;

			p {
				text-align: center;
				word-break: break-all;
				white-space: break-spaces;

				font: {
					size: 1.7rem;
				}
			}
		}

		&__promocode {
			margin: 0 0 0 1rem;
			order: 1;
			width: 70%;
			font-size: 1.9rem;
			line-height: unset;
			text-align: left;
		}

		&__delete {
			order: 3;
		}

		.active {
			order: 2;
		}
	}
}
</style>