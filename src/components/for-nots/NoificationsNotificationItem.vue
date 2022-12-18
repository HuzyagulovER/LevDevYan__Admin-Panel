<template>
	<div class="notification">
		<div class="notification__container">
			<p class="notification__notification">{{ notification.title }}</p>
			<div class="notification__wrapper">
				<div class="notification__time">
					<p>{{ notification.time }}</p>
				</div>
				<div class="notification__date">
					<p>{{ notification.date }}</p>
				</div>
				<div class="notification__type">
					<p>{{ notification.type }}</p>
				</div>
			</div>
			<div class="notification__repeat">
				<svg
					width="29"
					height="29"
					viewBox="0 0 29 29"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M27.6406 0.90625C26.8902 0.90625 26.2812 1.51525 26.2812 2.26565V6.04925C23.5825 2.2747 19.2415 0 14.5 0C6.50505 0 0 6.50505 0 14.5C0 22.4949 6.50505 29 14.5 29C20.3934 29 25.6559 25.4792 27.9071 20.0318C28.0502 19.6847 28.0394 19.3131 27.9062 18.9932C27.7729 18.6715 27.5165 18.4005 27.1685 18.2564C26.8223 18.1132 26.4507 18.1241 26.1299 18.2573C25.8091 18.3905 25.5381 18.6479 25.394 18.9941C23.5652 23.4212 19.2886 26.2812 14.5 26.2812C8.004 26.2812 2.71875 20.996 2.71875 14.5C2.71875 8.004 8.004 2.71875 14.5 2.71875C18.5654 2.71875 22.2666 4.77865 24.4225 8.15625H20.3906C19.6402 8.15625 19.0312 8.76525 19.0312 9.51565C19.0312 10.266 19.6402 10.875 20.3906 10.875H27.6406C28.391 10.875 29 10.266 29 9.51565V2.26565C29 1.51525 28.391 0.90625 27.6406 0.90625Z"
					/>
				</svg>
			</div>
			<div class="notification__delete">
				<IconTrash @click="confirmDeletingActive" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, ref, Ref, toRef, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { Notification } from "../../../helpers";
import IconTrash from "../add-comps/icons/IconTrash.vue";

const props = defineProps<{ index: number }>();
const emit = defineEmits(["confirmDeletingActive"]);

const store = <StoreGeneric>inject("Store");
const { notifications } = storeToRefs(store);

const notification: Ref<Notification> = ref({
	...notifications.value[props.index],
});

function confirmDeletingActive() {
	emit("confirmDeletingActive", props.index);
}
</script>

<style lang="scss" scoped>
@import "../../style.scss";

.notification {
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

	&__notification {
		font: {
			family: var(--f__mazzard-sb);
			size: 1.5rem;
		}
		text-align: center;
		line-height: 1.5rem;
		margin: 0 3rem 0 1rem;
		min-width: 10rem;
	}

	&__wrapper {
		display: flex;
		margin-top: 1.5rem;
	}

	&__time,
	&__date,
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
				size: 1.35rem;
			}
		}
	}

	&__time {
		margin-right: 2rem;
		padding: 0 2rem;
	}

	&__date,
	&__type {
		padding: 0 3rem;

		p {
			min-width: 6rem;
		}
	}

	&__repeat {
		width: auto;
		height: 100%;
		object-fit: contain;
		margin-left: auto;
		cursor: pointer;

		svg {
			width: 100%;
			height: 100%;
			fill: #8b2cf5;
		}
	}

	&__delete {
		width: auto;
		height: 100%;
		cursor: pointer;
		margin-left: 3rem;

		svg {
			width: 100%;
			height: 100%;
			object-fit: cover;
			fill: var(--c__red);
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		padding: 1.5rem 2rem;

		&__container {
			flex-wrap: wrap;
			height: auto;

			& > * {
				order: 3;
			}
		}

		&__wrapper {
			display: grid;
			grid-template: 1fr / 1fr 1fr;
			column-gap: 3rem;
			width: 100%;

			& > * {
				flex: 1;
				margin: 0;

				p {
					padding: 0.5rem;
					text-align: center;
					width: 100%;
				}
			}
		}

		&__type {
			margin-top: 0.8rem;
			grid-column: 1/3;
			word-break: break-all;
			white-space: break-spaces;
		}

		&__notification {
			order: 1;
			font-size: 1.8rem;
			line-height: unset;
		}

		&__repeat,
		&__delete {
			order: 2;
			width: 2.3rem;
			height: 2.3rem;
		}

		&__delete {
		}
	}
}
</style>