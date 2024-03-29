<template>
	<div class="notification">
		<div class="notification__container">
			<div class="notification__image" v-if="notification.image">
				<img :src="notification.image" alt="Notification image" />
			</div>

			<p class="notification__empty-image" v-else>Без<br />изображения</p>
			<div class="notification__wrapper">
				<div class="notification__time">
					<p>
						{{ notification.time.substring(0, notification.time.length - 3) }}
					</p>
				</div>
				<div class="notification__date" v-if="notification.date !== '0000-00-00'">
					<p>{{ notification.date }}</p>
				</div>
				<div class="notification__type" v-if="notification.type">
					<p>{{ notification.type }}</p>
				</div>
				<div class="notification__lang" v-if="notification.lang">
					<p>{{ languages[notification.lang] }}</p>
				</div>
				<div class="notification__premium-app-type" v-if="notification.premium_app_type">
					<p>{{ premiumAppTypes[notification.premium_app_type] }}</p>
				</div>
				<div class="notification__os" v-if="notification.os">
					<p>{{ OS[notification.os] }}</p>
				</div>
				<div class="notification__test" v-if="notification.is_test">
					<p>Тест</p>
				</div>
			</div>
			<div class="notification__repeat repeat">
				<p class="repeat__repeat-times">
					{{
						notification.repeat_times == -1 ? "x" : notification.repeat_times
					}}
				</p>
				<div class="repeat__img">
					<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M27.6406 0.90625C26.8902 0.90625 26.2812 1.51525 26.2812 2.26565V6.04925C23.5825 2.2747 19.2415 0 14.5 0C6.50505 0 0 6.50505 0 14.5C0 22.4949 6.50505 29 14.5 29C20.3934 29 25.6559 25.4792 27.9071 20.0318C28.0502 19.6847 28.0394 19.3131 27.9062 18.9932C27.7729 18.6715 27.5165 18.4005 27.1685 18.2564C26.8223 18.1132 26.4507 18.1241 26.1299 18.2573C25.8091 18.3905 25.5381 18.6479 25.394 18.9941C23.5652 23.4212 19.2886 26.2812 14.5 26.2812C8.004 26.2812 2.71875 20.996 2.71875 14.5C2.71875 8.004 8.004 2.71875 14.5 2.71875C18.5654 2.71875 22.2666 4.77865 24.4225 8.15625H20.3906C19.6402 8.15625 19.0312 8.76525 19.0312 9.51565C19.0312 10.266 19.6402 10.875 20.3906 10.875H27.6406C28.391 10.875 29 10.266 29 9.51565V2.26565C29 1.51525 28.391 0.90625 27.6406 0.90625Z" />
					</svg>
				</div>
			</div>
			<div class="notification__play" @click="updateNotificationState('1')"
				v-if="!notification.state || notification.repeat_times == -1"
				:class="{ _inactive: notification.repeat_times == -1 }">
				<IconPlay class="play-button" />
			</div>
			<div class="notification__pause" v-else @click="updateNotificationState('0')">
				<IconPause class="pause-button" />
			</div>
			<div class="notification__delete">
				<IconTrash @click="confirmDeletingActive" class="icon-trash" />
			</div>
		</div>
		<div class="notification__container">
			<div class="notification__texts">
				<p class="notification__title">{{ notification.title }}</p>
				<p class="notification__body">{{ notification.body }}</p>
			</div>
			<div class="notification__edit">
				<RouterLink class="buttons__button" :to="`/notifications/create-edit/${props.notification.notification_id}/`">
					Редактировать
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, ref, Ref, toRef, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { Notification, ReturnedData } from "../../../helpers";
import IconTrash from "@add-comps/icons/IconTrash.vue";
import IconPlay from "@add-comps/icons/IconPlay.vue";
import IconPause from "@add-comps/icons/IconPause.vue";

const props = defineProps<{
	index: number;
	notification: Notification;
}>();
const emit = defineEmits(["confirmDeletingActive"]);

const store = <StoreGeneric>inject("Store");
const { notifications, languages, premiumAppTypes, OS } = storeToRefs(store);

function confirmDeletingActive() {
	emit("confirmDeletingActive", props.notification.notification_id);
}

function updateNotificationState(state: string) {
	if (props.notification.repeat_times != -1) {
		let fd = new FormData();
		fd.append("state", state);
		fd.append("notification_id", props.notification.notification_id as string);
		store.updateNotification(fd).then((r: ReturnedData) => {
			if (r.data.is_updated) props.notification.state = +state;
		});
	}
}
</script>

<style lang="scss" scoped>
@import "@/style.scss";

.notification {
	padding: 0.8rem 2rem;
	border: 0.25rem solid $--c__light-violet;
	border-radius: 0.6rem;

	._inactive,
	._inactive * {
		color: $--c__grey !important;
		fill: $--c__grey !important;
		stroke: $--c__grey !important;
	}

	&+& {
		margin-top: 1.7rem;
	}

	&__container {
		display: flex;

		&>* {
			height: 2.3rem;
		}

		&+& {
			margin-top: 1rem;

			&>* {
				height: unset;
			}
		}
	}

	&__title,
	&__body {
		font: {
			family: var(--f__mazzard-sb);
			size: 1.3rem;
		}

		line-height: 1.5rem;
		height: auto;
	}

	&__title {
		font-size: 1.5rem;
		text-decoration: underline;
		margin: 0 3rem 0.5rem 0;
	}

	&__wrapper {
		display: flex;
		align-self: stretch;
		flex-wrap: wrap;

		div+div {
			margin-left: 2rem;
		}
	}

	&__time,
	&__date,
	&__type,
	&__lang,
	&__premium-app-type,
	&__os,
	&__test {
		background-color: $--c__light-blue;
		display: flex;
		align-items: center;
		border-radius: 0.6rem;
		font-weight: bold;
		height: 2.3rem;

		p {
			text-align: center;

			font: {
				size: 1.35rem;
			}
		}
	}

	&__time,
	&__test {
		padding: 0 2rem;
	}

	&__date,
	&__type,
	&__lang,
	&__premium-app-type,
	&__os {
		padding: 0 3rem;

		p {
			min-width: 6rem;
		}
	}

	&__image {
		width: 5rem;
		height: 5rem;
		margin: 0 3rem 1.8rem 0;

		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}

	&__empty-image {
		margin: 0 2rem 1.8rem 0;
	}

	&__pause,
	&__play,
	&__delete {
		width: 2.3rem;
		height: 2.3rem;
		margin-left: 3rem;
		cursor: pointer;

		svg {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.repeat {
		display: flex;
		align-items: center;
		margin-left: auto;

		&__img {
			width: 2rem;
			height: 2rem;
			object-fit: contain;

			svg {
				width: 100%;
				height: 100%;
				fill: #8b2cf5;
			}
		}

		&__repeat-times {
			font-size: 1.5rem;
			margin-right: 1rem;
			margin-left: 1rem;
		}
	}

	&__texts {
		flex: 1;
		margin-right: 2rem;
	}

	&__edit {
		display: flex;
		align-items: flex-start;
	}

	.buttons {
		height: unset;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;

		&__delete {
			margin-right: 1.5rem;
			opacity: 0;
			transition: var(--transition-03);
		}

		&__button {
			cursor: pointer;
			padding: 0.8rem 1.6rem;
			border-radius: 0.8rem;
			font-size: 1.4rem;
			line-height: 1.4rem;
			border: 0.2rem solid $--c__light-violet;
			transition: var(--transition-03);
			text-align: center;

			&:hover {
				color: $--c__white;
				background-color: $--c__violet;
				border-color: $--c__violet;
			}
		}

		&__wrapper {
			display: flex;
			align-items: center;

			&:last-child {
				p {
					font-size: 1.4rem;
					margin-right: 1rem;
				}
			}
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		padding: 1.5rem 2rem;

		&__container {
			flex-wrap: wrap;
			height: auto;

			&+& {
				margin-top: 1.5rem;
				flex-direction: column;
			}

			&>* {
				// order: 3;
				display: flex;
			}
		}

		&__wrapper {
			display: grid;
			grid-template: 1fr / 1fr 1fr;
			gap: 1rem 3rem;
			width: 100%;
			// margin-top: 1.5rem;
			height: auto;
			order: 3;

			div+div {
				margin: 0;
			}

			&>* {
				margin: 0;

				p {
					padding: 0.5rem;
					text-align: center;
					width: 100%;
					height: unset;
				}
			}

			.notification__time,
			.notification__date,
			.notification__type {
				margin: 0;
			}

			.notification__type {
				margin-top: 0.8rem;
			}
		}

		&__repeat,
		&__delete,
		&__pause,
		&__play {
			order: 2;
		}

		&__notification {
			order: 1;
			font-size: 1.8rem;
			line-height: unset;
		}

		&__title,
		&__body {
			height: auto;
		}

		&__title {
			font-size: 1.8rem;
			margin-bottom: 1rem;
		}

		&__body {
			font-size: 1.65rem;
			line-height: 1.7rem;
		}

		&__texts {
			flex-direction: column;
			margin: 0;
			margin-bottom: 2rem;
		}

		&__edit {
			justify-content: flex-end;
		}
	}
}
</style>