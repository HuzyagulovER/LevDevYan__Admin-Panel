<template>
	<div class="course">
		<div class="course__container">
			<div class="course__image">
				<img :src="props.about.image" alt="" />
			</div>
			<div class="course__info info">
				<p class="info__title">
					<span>Название</span>: {{ props.about.title }}
				</p>
				<p class="info__days-amount">
					<span>Сколько дней</span>: {{ props.about.period }}
				</p>
				<p class="info__price">
					<span>Стоимость</span>: {{ props.about.price }}
				</p>
				<p class="info__category">
					<span>Категория</span>: {{ props.about.category }}
				</p>
			</div>
			<div class="course__button-container">
				<IconTrash class="course__delete" @click="confirmDeletingActive" />
				<RouterLink
					class="course__button"
					:to="`/courses/create-edit/${props.index}/about`"
				>
					Редактировать
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import IconTrash from "@icons/IconTrash.vue";
import { inject, ref, Ref } from "@vue/runtime-core";
import { StateTree } from "pinia";
import { useRoute } from "vue-router";
import { CourseAbout } from "../../../helpers";

const store = <StateTree>inject("Store");
const props = defineProps<{ about: CourseAbout; index: number }>();
const emit = defineEmits(["confirmDeletingActive"]);

function confirmDeletingActive() {
	emit("confirmDeletingActive", props.index);
}
</script>

<style lang="scss" scoped>
@import "../../style.scss";

.course {
	padding: 2.3rem;
	border: 0.25rem solid var(--c__light-violet);
	border-radius: 1.8rem;
	height: 13.5rem;

	& + & {
		margin-top: 1.7rem;
	}

	&__container {
		display: flex;
		width: 100%;
		height: 100%;
	}

	&__image {
		aspect-ratio: 26/11;
		height: 100%;
		width: auto;
		overflow: hidden;
		border-radius: 0.8rem;

		img {
			width: 100%;
			height: 100%;
		}
	}

	.info {
		flex: 1;
		margin: 0 2rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		& > * {
			font-size: 1.4rem;
			white-space: break-spaces;
			word-break: break-all;

			span {
				font-family: var(--f__mazzard-sb);
			}
		}
	}

	&__button-container {
		align-self: flex-start;
		display: flex;
		align-items: center;
	}

	&:hover {
		.course__delete {
			opacity: 1;
		}
	}

	&__delete {
		width: 2.3rem;
		height: 2.3rem;
		margin-right: 1.5rem;
		fill: var(--c__red);
		cursor: pointer;
		opacity: 0;
		transition: var(--transition-03);
	}

	&__button {
		cursor: pointer;
		padding: 0.8rem 1.6rem;
		border-radius: 0.8rem;
		font-size: 1.4rem;
		line-height: 1.4rem;
		border: 0.2rem solid var(--c__light-violet);
		transition: var(--transition-03);

		&:hover {
			color: var(--c__white);
			background-color: var(--c__violet);
			border-color: var(--c__violet);
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

			& > * {
				font-size: 1.7rem;
				margin-bottom: 0.5rem;
			}
		}

		&__button-container {
			align-self: unset;
			justify-content: center;
			width: 100%;
		}

		&__delete {
			width: 3rem;
			height: 3rem;
			position: absolute;
			margin: 0;
			top: 1rem;
			right: 1rem;
			background-color: var(--c__white);
			padding: 0.5rem;
			border-radius: 25%;
		}

		&__button {
			padding: 0.8rem 1.6rem;
			border-radius: 0.8rem;
			font-size: 1.7rem;
			line-height: unset;
		}
	}
}
</style>