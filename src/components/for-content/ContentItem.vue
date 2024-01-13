<template>
	<div class="content-item">
		<div class="content-item__container">
			<div class="content-item__content-image content-image">
				<img class="content-image__image" :src="content.image" alt="" v-if="content.image" />
				<p class="content-image__empty-image" v-else>Без<br />изображения</p>
			</div>

			<div class="content-item__info info">
				<p class="info__title">
					<span>Content ID</span>: {{ content.content_id }}
				</p>
				<p class="info__title"><span>ID</span>: {{ content.id }}</p>
				<p class="info__title" v-if="!apps[content.app]">
					<span>Приложение</span>: {{ content.app }}
				</p>
				<p class="info__title"><span>Название</span>: {{ content.title }}</p>
				<p class="info__type"><span>Тип</span>: {{ content.type }}</p>
				<p class="info__text">
					<span>Текст</span>: {{ Object.keys(content.texts).length }}
				</p>
			</div>
			<div class="content-item__buttons buttons">
				<div class="buttons__wrapper">
					<IconTrash class="buttons__delete icon-trash" @click="confirmDeleteContent" />
					<RouterLink class="buttons__button" :to="`/content/create-edit/${contentId}`">
						Редактировать
					</RouterLink>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import IconTrash from "@icons/IconTrash.vue";
import { inject } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { Content } from "../../../helpers";

const store = <StoreGeneric>inject("Store");
const props = defineProps<{
	contentId: string;
	content: Content;
}>();
const emit = defineEmits(["confirmDeleteContent"]);
const { apps } = storeToRefs(store);

function confirmDeleteContent() {
	emit("confirmDeleteContent", props.contentId);
}
</script>

<style lang="scss" scoped>
@import "@/style.scss";

.content-item {
	padding: 2.3rem;
	border: 0.25rem solid $--c__light-violet;
	border-radius: 1.8rem;
	position: relative;
	background-color: $--c__white;
	// height: 13.5rem;

	&__container {
		display: flex;
		width: 100%;
		height: 100%;
	}

	.content-image {
		display: flex;
		justify-content: center;
		align-items: center;
		aspect-ratio: 26/11;
		height: 7rem;
		width: 18rem;
		overflow: hidden;
		border-radius: 0.8rem;
		margin-bottom: 1rem;

		&__image {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}

		&__empty-image {
			text-align: center;
			font-size: 2rem;
		}
	}

	.info {
		flex: 1;
		margin: 0 2rem;
		display: flex;
		flex-direction: column;

		&>* {
			font-size: 1.4rem;
			white-space: break-spaces;
			word-break: break-all;
			margin-bottom: 1rem;

			span {
				font-family: var(--f__mazzard-sb);
			}
		}
	}

	&:hover {
		.buttons__delete {
			opacity: 1;
		}
	}

	.buttons {
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
		height: auto;

		&__container {
			display: flex;
			flex-direction: column;
			position: relative;
		}

		&__image {
			margin-bottom: 2rem;
		}

		.info {
			margin: 0 0 2rem;

			&>* {
				font-size: 1.7rem;
				margin-bottom: 0.8rem;
			}
		}

		&__buttons {
			align-self: unset;
			justify-content: center;
			width: 100%;
		}

		.buttons {
			flex-direction: row;
			align-items: center;

			&__delete {
				width: 3rem;
				height: 3rem;
				position: absolute;
				margin: 0;
				top: 1rem;
				right: 1rem;
				background-color: $--c__white;
				padding: 0.5rem;
				border-radius: 25%;
			}

			&__button {
				padding: 0.8rem 1.6rem;
				border-radius: 0.8rem;
				font-size: 1.7rem;
				line-height: unset;
				width: 100%;
			}
		}
	}
}
</style>