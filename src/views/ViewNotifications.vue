<template>
	<section class="notifications">
		<div class="notifications__top-line top-line">
			<ButtonsPages class="top-line__buttons-pages" />

			<ButtonCreate
				to="/notifications/create-edit/new"
				class="top-line__button-create"
			>
				Создать уведомление
			</ButtonCreate>
		</div>
		<LanguageChoice @return-lang="changeLang" :isCookie="true" />
		<div class="notifications__empty" v-if="isEmpty">
			<img
				src="@images/Notifications__Empty-Notifications.png"
				width="234"
				height="288"
			/>
			<p>Уведомлений еще нет...</p>
		</div>
		<TransitionGroup tag="div" :name="transitionName">
			<NoificationsNotificationItem
				v-for="(notification, j) in nots"
				:key="notification?.notification_id"
				:index="j"
				:notification="notification"
				class="notifications__notification"
				@confirm-deleting-active="deleteNotification"
			/>
		</TransitionGroup>
	</section>
</template>

<script setup lang="ts">
import ButtonCreate from "@add-comps/ButtonCreate.vue";
import ButtonsPages from "@add-comps/ButtonsPages.vue";
import NoificationsNotificationItem from "@for-nots/NoificationsNotificationItem.vue";
import LanguageChoice from "@add-comps/LanguageChoice.vue";
import { inject, Ref, ref, toRef, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import {
	Courses,
	Notification,
	Notifications,
	ReturnedData,
	ReturnedError,
} from "../../helpers";
import { cloneDeep } from "lodash";
import { useRoute } from "vue-router";
import { useCookies } from "vue3-cookies";

const store = <StoreGeneric>inject("Store");
const { notifications, loading, languages } = storeToRefs(store);
const route = useRoute();
const { cookies } = useCookies();

let isEmpty: Ref<boolean> = ref(false);
const nots: Ref<Notifications> = ref([]);
let popup: Ref<boolean> = ref(false);
let deleteNotificationId: Ref<string> = ref("");
let transitionName: Ref<string> = ref("list");
let pageName: Ref = toRef(route, "name");
let lang = cookies.get(`${pageName.value}Lang`);
const language = function (): string {
	return !lang || !languages.value[lang]
		? Object.keys(languages.value)[0]
		: cookies.get(`${pageName.value}Lang`);
};

watch(
	() => nots.value,
	() => {
		isEmpty.value = !nots.value.length && !loading.value;
	},
	{
		deep: true,
	}
);

watch(
	() => route.query.app,
	() => {
		transitionName.value = "disabled-list";
		nots.value = [];
		getNotifications(
			(route.query.app ? route.query.app : "psy") as string,
			language()
		);
	}
);

getNotifications(
	(route.query.app ? route.query.app : "psy") as string,
	language()
);

function getNotifications(app: string, lang: string): void {
	store.getNotifications(app, lang).then(() => {
		nots.value = cloneDeep(notifications.value);
	});
}

function getAppNotifications(app: string | undefined) {
	let allNotifications = cloneDeep(notifications.value);
	let appNotifications = allNotifications.filter(
		(notification: Notification) => {
			return app === undefined
				? notification.app === "psy"
				: notification.app === app;
		}
	);
	return appNotifications;
}

async function deleteNotification(notification_id: string) {
	await store.callPopup("Удалить это уведомление?").then((r: boolean) => {
		if (r) {
			let fd = new FormData();
			fd.append("notification_id", notification_id);
			store.deleteNotification(fd).then((r: ReturnedData | ReturnedError) => {
				if (r.success && r.data.is_deleted) {
					getNotifications(
						(route.query.app ? route.query.app : "psy") as string,
						language()
					);
				}
			});
		}
	});
}

function changeLang(lang: string): void {
	getNotifications((route.query.app ? route.query.app : "psy") as string, lang);
}
</script>

<style lang="scss">
@import "../style.scss";

.notifications {
	flex: 1;
	display: flex;
	flex-direction: column;

	.top-line {
		display: flex;
		align-items: center;
		margin-bottom: 2rem;
		height: 3.3rem;

		& > * {
			height: 100%;
		}

		&__button-create {
			margin-left: auto;
		}
	}

	&__empty {
		width: 100%;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		img {
			width: 20rem;
			height: auto;
			transform: translateX(4rem);
		}

		p {
			margin-top: -2rem;
			font: {
				size: 1.9rem;
				weight: bold;
			}
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
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