<template>
	<section class="notifications">
		<div class="notifications__top-line top-line">
			<RouterLink
				class="top-line__link-psy"
				:to="{ query: { app: 'psy' } }"
				:class="{ js_active: route.query.app === 'psy' || !route.query.app }"
			>
				PSY
			</RouterLink>
			<RouterLink
				class="top-line__link-avocado"
				:to="{ query: { app: 'avocado' } }"
				:class="{ js_active: route.query.app === 'avocado' }"
			>
				Avocado
			</RouterLink>

			<ButtonCreate
				create_name="Создать уведомление"
				to="/notifications/create"
				class="top-line__button-create"
			/>
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
import ButtonCreate from "@/components/add-comps/ButtonCreate.vue";
import NoificationsNotificationItem from "@for-nots/NoificationsNotificationItem.vue";
import TheLoader from "@add-comps/TheLoader.vue";
import Popup from "@add-comps/Popup.vue";
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
		getNotitifications(
			(route.query.app ? route.query.app : "psy") as string,
			language()
		);
	}
);

getNotitifications(
	(route.query.app ? route.query.app : "psy") as string,
	language()
);

function getNotitifications(app: string, lang: string): void {
	store.getNotifications(app, lang).then(() => {
		nots.value = cloneDeep(notifications.value);
		// transitionName.value = "list";
		// nots.value = getAppNotifications(
		// 	route.query.app as string | undefined
		// ).reverse();
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

// function deleteNotification(index: number) {
// 	nots.value.splice(index, 1);
// }

// function deleteTarget(ans: boolean) {
// 	if (ans) {
// 		nots.value.splice(deleteNotificationId.value, 1);
// 		deleteNotificationId.value = 0;
// 	}
// 	popup.value = false;
// }

async function deleteNotification(notification_id: string) {
	await store.callPopup("Удалить это уведомление?").then((r: boolean) => {
		if (r) {
			let fd = new FormData();
			fd.append("notification_id", notification_id);
			store.deleteNotification(fd).then((r: ReturnedData | ReturnedError) => {
				if (r.success && r.data.is_deleted) {
					getNotitifications(
						(route.query.app ? route.query.app : "psy") as string,
						language()
					);
				}
			});
		}
	});
}

function changeLang(lang: string): void {
	getNotitifications(
		(route.query.app ? route.query.app : "psy") as string,
		lang
	);
}
</script>

<style scoped lang="scss">
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

		&__link-psy,
		&__link-avocado {
			border-radius: 0.7rem;
			border: 0.2rem solid var(--c__violet);
			font-size: 1.5rem;
			display: flex;
			align-items: center;
			justify-content: center;

			&.js_active {
				background-color: var(--c__violet);
				color: var(--c__white);
			}
		}

		&__link-psy {
			padding: 0.7rem 3.5rem;
			margin-right: 2rem;
		}

		&__link-avocado {
			padding: 0.7rem 3rem;
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

			&__link-psy,
			&__link-avocado {
				margin: 0;
			}

			&__link-psy {
				grid-column: 1/4;
			}

			&__link-avocado {
				grid-column: 4/7;
			}

			&__button-create {
				width: 100%;
				grid-column: 2/6;
			}
		}
	}
}
</style>