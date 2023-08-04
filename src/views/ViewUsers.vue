<template>
	<section class="users">
		<div class="users__top-line top-line">
			<div class="top-line__info info" v-for="(info, j) in appsInfo" :key="j">
				<p class="info__title">{{ apps[j] }}</p>
				<p class="info__value">{{ info }}</p>
			</div>
		</div>
		<div class="users__manage manage">
			<div class="manage__buttons buttons">
				<div class="buttons__container" v-if="isUser">
					<ButtonColored class="buttons__button button button-transparent" @click="clearUser">
						<IconClose />
						Сбросить поиск
					</ButtonColored>
					<ButtonColored class="buttons__button button button-transparent">
						<IconEye />
						Json
					</ButtonColored>
				</div>
				<div class="buttons__container" v-else>
					<ButtonColored class="buttons__button button">
						<IconPencil />
						Управление подпиской
					</ButtonColored>
					<ButtonColored class="buttons__button button button-search" @click="searchUser()">
						<IconSearch />
						Поиск пользователя
					</ButtonColored>
				</div>
				<ButtonColored class="buttons__button button button-transparent button-delete" @click="confirmDeletingUser()">
					<IconTrash />
					Удалить пользователя
				</ButtonColored>
			</div>
			<div class=" manage__preview preview">
				<div class="preview__user user" v-if="isUser">
					<ul class="user__list">
						<li class="user__item item">
							<p class="item__title">ID</p>
							<p class="item__value">{{ (selectedUser as User).id }}</p>
						</li>
						<li class="user__item item">
							<p class="item__title">Имя</p>
							<p class="item__value">{{ (selectedUser as User).name }}</p>
						</li>
						<li class="user__item item">
							<p class="item__title">Почта</p>
							<p class="item__value">{{ (selectedUser as User).email }}</p>
						</li>
						<li class="user__item item">
							<p class="item__title">Дата регистрации</p>
							<p class="item__value">{{ getDateFromString((selectedUser as User).registration_date) }}</p>
						</li>
						<li class="user__item item">
							<p class="item__title">Подписка PSY</p>
							<p class="item__value">
								{{
									(selectedUser as User).typePremium.psy.subscriptionDurationText !== ''
									?
									(selectedUser as User).typePremium.psy.subscriptionDurationText
									:
									'-'
								}}
							</p>
							<IconPencil class="item__edit" />
						</li>
						<li class="user__item item">
							<p class="item__title">Подписка Avocado</p>
							<p class="item__value">
								{{
									(selectedUser as User).typePremium.avocado.subscriptionDurationText !== ''
									?
									(selectedUser as User).typePremium.avocado.subscriptionDurationText
									:
									'-'
								}}
							</p>
							<IconPencil class="item__edit" />
						</li>
						<li class="user__item item">
							<p class="item__title">Уведомления</p>
							<p class="item__value">В{{ (selectedUser as User).sys_notifications_state ? '' : 'ы' }}ключены</p>
							<IconPencil class="item__edit" />
						</li>
						<li class="user__item item">
							<p class="item__title">Дата входа:</p>
							<p class="item__value">
								<span>
									<span>PSY</span>:
									{{ open_app.psy }}
								</span>
								<span>
									<span>Avocado</span>:
									{{ open_app.avocado }}
								</span>
							</p>
						</li>
					</ul>
				</div>
				<div class="preview__empty empty" v-else>
					<p class="empty__error" v-if="error === 'USER_IS_NOT_EXIST'">Пользователь не найден</p>
					<img src="@images/Users__Empty-Users.png" alt="Empty :(" class="empty__image" width="485" height="379">
				</div>
			</div>
		</div>

		<PopupUserDelete />
		<PopupSubscriptionActivation />
		<PopupSearchUser />
	</section>
</template>

<script setup lang="ts">
import ButtonColored from "@add-comps/ButtonColored.vue";
import IconPencil from "@icons/IconPencil.vue";
import IconSearch from "@icons/IconSearch.vue";
import IconTrash from "@icons/IconTrash.vue";
import IconClose from "@icons/IconClose.vue";
import IconEye from "@icons/IconEye.vue";
import PopupUserDelete from "@add-comps/PopupUserDelete.vue";
import PopupSubscriptionActivation from "@add-comps/PopupSubscriptionActivation.vue";
import PopupSearchUser from "@add-comps/PopupSearchUser.vue";
import { useRoute, useRouter } from "vue-router";
import { StoreGeneric, storeToRefs } from "pinia";
import { computed, ComputedRef, inject, ref, Ref, watch } from "vue";
import { User, NumberObject, PopupAdditionFields, ReturnedError, ReturnedData, StringObject, NumberOrStringObject } from "../../helpers";
import { cloneDeep } from "lodash";
import { clearVariable } from "../main";

const route = useRoute();
const router = useRouter();
const store = <StoreGeneric>inject("Store");
const { loading, commonInfo, apps, monthNames } = storeToRefs(store);

const user_creds: ComputedRef<string | undefined> = computed((): string | undefined => route.query.creds as string | undefined)
const selectedUser: Ref<User | {}> = ref({})
const isUser: ComputedRef<boolean> = computed((): boolean => Object.keys(selectedUser.value).length !== 0)
const appsInfo: ComputedRef<NumberObject> = computed(() => {
	let info: NumberObject = cloneDeep(commonInfo.value.users);
	delete info.all_users;
	return info;
})
const error: Ref<string> = ref('')

const open_app: ComputedRef<StringObject> = computed((): StringObject => {
	return {
		psy: getDateFromString((selectedUser.value as User).open_app['psy' as keyof NumberOrStringObject] as string),
		avocado: getDateFromString((selectedUser.value as User).open_app['avocado' as keyof NumberOrStringObject] as string),
	}
})

watch(() => selectedUser.value,
	() => {
		console.log(selectedUser.value);
	},
	{ deep: true }
)

getUsersData()

if (user_creds.value) {
	loading.value = true
	getUser(user_creds.value)
}

watch(() => user_creds.value,
	() => {
		if (user_creds.value) {
			loading.value = true
			getUser(user_creds.value as string)
		} else {
			selectedUser.value = {}
		}
	}
)

function getUsersData(): void {
	loading.value = true;
	store.getUsersData({
		users: "all",
		subs: "all",
	}).then((): void => {
		loading.value = false;
	});
}
async function confirmDeletingUser(addition_data?: {
	[key: string]: string;
}): Promise<void> {
	await store
		.callPopupWithData("", { type: "user_delete", creds: user_creds.value, ...addition_data })
		.then((r: PopupAdditionFields): void => {
			if (Object.hasOwn(r, "user_creds")) {
				store.deleteUser(r["user_creds" as keyof PopupAdditionFields]).then(
					(r: boolean): void => {
						console.log(r);
						store.clearPopup();
						store.callInfoPopup(
							'Пользователь удален',
							{
								isSuccess: true
							}
						)
						if (user_creds.value) {
							getUser(user_creds.value)
						}
					},
					async (e: ReturnedError) => {
						error.value = e.error.status
						console.log(e);
						await store.clearPopup();
						confirmDeletingUser({ error: e.error.status });
					}
				);
			}
		});
}
async function searchUser(addition_data?: {
	[key: string]: string;
}): Promise<void> {
	await store
		.callPopupWithData("", { type: "search_user", ...addition_data })
		.then((r: PopupAdditionFields): void => {
			if (Object.hasOwn(r, "user_creds")) {
				router.push({
					name: "Users",
					query: {
						creds: r['user_creds' as keyof PopupAdditionFields] as string | number
					}
				})
				// loading.value = true
				// getUser(r["user_creds" as keyof PopupAdditionFields])
			}
		});
}
function getUser(data: string | number) {
	store.getUser(data).then(
		(r: ReturnedError | ReturnedData): void => {
			selectedUser.value = (r as ReturnedData).data.user
			store.clearPopup();
			loading.value = false
		},
		async (e: ReturnedError) => {
			error.value = e.error.status
			store.clearPopup();
			loading.value = false
			setTimeout(() => {
				error.value = clearVariable(error.value)
				router.push({ name: "Users" })
			}, 2000);
		}
	);
}

function getDateFromString(init_date: string | number): string {
	if (init_date) {
		let day: number
		let month: string
		let year: number
		let date = new Date(+init_date ? init_date as number * 1000 : init_date as string)

		day = date.getDate()
		month = monthNames.value[date.getMonth()]
		year = date.getFullYear()

		return day + ' ' + month + ' ' + year
	} else return '-'
}
function clearUser(): void {
	router.push({ name: "Users" })
}
</script>

<style lang="scss" scoped>
@import "@/style.scss";

.users {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__top-line {}

	&__manage {}
}

.top-line {
	display: flex;
	align-items: center;
	margin-bottom: 4rem;

	.info {
		display: flex;
		font-size: 2rem;
		padding: 1.5rem 2rem;
		border: .1rem solid rgba($color: $--c__grey, $alpha: 0.5);
		border-radius: 1.5rem;
		margin-right: 2rem;

		&:first-child {
			background-color: $--c__light-violet;
		}

		&:nth-child(2) {
			background-color: $--c__light-green;
		}

		&__title {
			margin-right: 2.5rem;
		}

		&__value {
			font-weight: bold;
		}
	}
}

.manage {
	display: flex;
	flex-direction: column;
	width: 80rem;
	height: 100%;

	.preview {
		flex: 1;

		.user {
			width: 100%;
			height: 100%;

			&__list {
				display: grid;
				grid-template: 1fr / 1fr;
				row-gap: 1rem;
				list-style: none;
			}

			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 1rem 3rem 1rem 2rem;
				background-color: rgba($color: $--c__yellow, $alpha: 0.3);
				border: .1rem solid rgba($color: $--c__grey, $alpha: 0.5);
				border-radius: 1.5rem;
				font-size: 1.4rem;
				position: relative;

				&__title {
					font-weight: bold;
				}

				&__value {
					&>span {
						span {
							font-weight: bold;
						}

						&+span {
							margin-left: 2rem;
						}
					}
				}

				&__edit {
					position: absolute;
					width: 1.5rem;
					height: 1.5rem;
					top: 50%;
					left: calc(100% + 0.8rem);
					transform: translateY(-50%);
					cursor: pointer;
					fill: $--c__blue;
				}
			}
		}

		.empty {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			&__image {
				width: 34.6rem;
				height: auto;
			}

			&__error {
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-50%);
				color: $--c__red;
				font-size: 2rem;
			}
		}
	}

	.buttons {
		display: flex;
		margin-bottom: 2rem;

		&__container {
			display: flex;
		}

		.button {
			margin-right: 3rem;
			font-size: 1.3rem;
			padding: 0 3rem;
			height: 3rem;

			svg {
				fill: $--c__white;
				height: auto;
				width: 1.8rem;
				margin-right: 1rem;
			}

			&-search {
				background-color: $--c__orange;
			}

			&-transparent {
				background-color: transparent;
				color: var(--c__black);

				svg {
					fill: $--c__grey;
				}
			}

			&-delete {
				margin-left: auto;
				margin-right: 0;

				svg {
					fill: $--c__red;
				}
			}
		}
	}
}
</style>