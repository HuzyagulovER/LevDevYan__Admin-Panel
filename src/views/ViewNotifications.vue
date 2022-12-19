<template>
	<section class="notifications">
		<div class="notifications__top-line top-line">
			<ButtonCreate
				create_name="Создать уведомление"
				to="/notifications/create"
				class="top-line__button-create"
			/>
		</div>
		<div class="notifications__empty" v-if="isEmpty">
			<img
				src="@images/Notifications__Empty-Notifications.png"
				alt=""
				width="234"
				height="288"
			/>
			<p>Уведомлений еще нет...</p>
		</div>
		<TransitionGroup tag="div" name="list">
			<NoificationsNotificationItem
				v-for="(notification, j) in nots"
				:key="notification?.id"
				:index="j"
				class="notifications__notification"
				@confirm-deleting-active="confirmDeletingActive"
			/>
		</TransitionGroup>
	</section>
</template>

<script setup lang="ts">
import ButtonCreate from "@/components/add-comps/ButtonCreate.vue";
import NoificationsNotificationItem from "@for-nots/NoificationsNotificationItem.vue";
import TheLoader from "@add-comps/TheLoader.vue";
import Popup from "@add-comps/Popup.vue";
import { inject, Ref, ref, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { Courses, Notification, Notifications } from "../../helpers";
import { cloneDeep } from "lodash";

const store = <StoreGeneric>inject("Store");
const { notifications, loading } = storeToRefs(store);

let isEmpty: Ref<boolean> = ref(false);
const nots: Ref<Notifications> = ref([]);
let popup: Ref<boolean> = ref(false);
let deleteIndex: Ref<number> = ref(0);

watch(
	() => nots.value,
	() => {
		if (!nots.value.length && !loading.value) {
			isEmpty.value = true;
		}
	},
	{
		deep: true,
	}
);

store.getNotifications().then(() => {
	nots.value = cloneDeep(notifications.value);
});

function deleteNotification(index: number) {
	nots.value.splice(index, 1);
}

function deleteTarget(ans: boolean) {
	if (ans) {
		nots.value.splice(deleteIndex.value, 1);
		deleteIndex.value = 0;
	}
	popup.value = false;
}

async function confirmDeletingActive(index: number) {
	deleteIndex.value = index;
	await store.callPopup("Удалить это уведомление?").then((r: boolean) => {
		if (r) {
			nots.value.splice(deleteIndex.value, 1);
			deleteIndex.value = 0;
		}
	});
}
</script>

<style scoped lang="scss">
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
}
</style>