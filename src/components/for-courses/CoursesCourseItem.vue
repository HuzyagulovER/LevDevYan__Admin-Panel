<template>
	<div class="course">
		<div class="course__container">
			<div class="course__course-image course-image">
				<img class="course-image__image" :src="about.image" alt="" v-if="about.image" />
				<p class="course-image__empty-image" v-else>Без<br />изображения</p>
			</div>

			<div class="course__info info">
				<p class="info__title"><span>Название</span>: {{ about.title }}</p>
				<p class="info__days-amount">
					<span>Сколько дней</span>: {{ about.period }}
				</p>
				<p class="info__price"><span>Стоимость</span>: {{ about.price }}</p>
				<p class="info__category">
					<span>Категория</span>: {{ about.category }}
				</p>
				<p class="info__active">
					<span>Активных</span>: {{ active }}
				</p>
			</div>
			<div class="course__buttons buttons">
				<div class="buttons__wrapper">
					<IconTrash class="buttons__delete icon-trash" @click="confirmDeletingActive" />
					<RouterLink class="buttons__button" :to="`/courses/create-edit/${courseId}/about`">
						Редактировать
					</RouterLink>
				</div>
				<div class="buttons__wrapper">
					<p>Доступность в МП</p>
					<Checkbox :defaultChecked="props.production ? true : false" class="promocode__active"
						@change-state="changeCourseProduction" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import IconTrash from "@icons/IconTrash.vue";
import Checkbox from "@add-comps/Checkbox.vue";
import { CourseAbout } from "../../../helpers";

const props = defineProps<{
	courseId: string;
	active: string | number;
	about: CourseAbout;
	production: number;
}>();
const emit = defineEmits(["confirmDeletingActive", "changeCourseProduction"]);

function confirmDeletingActive() {
	emit("confirmDeletingActive", props.courseId);
}

function changeCourseProduction(state: boolean) {
	emit("changeCourseProduction", props.courseId, state);
}
</script>

<style lang="scss" scoped>
@import "../../style.scss";
$vertical-padding: 2.3rem;

.course {
	padding: $vertical-padding;
	border: 0.25rem solid var(--c__light-violet);
	border-radius: 1.8rem;

	&+& {
		margin-top: 1.7rem;
	}

	&__container {
		display: flex;
		width: 100%;
		height: 100%;
	}

	.course-image {
		display: flex;
		justify-content: center;
		align-items: center;
		aspect-ratio: 26/11;
		height: calc(13.5rem - 2 * $vertical-padding);
		width: auto;
		overflow: hidden;
		border-radius: 0.8rem;

		&__image {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}

		&__empty-image {
			text-align: center;
			font-size: 2.5rem;
		}
	}

	.info {
		flex: 1;
		margin: 0 2rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		&>* {
			font-size: 1.4rem;
			white-space: break-spaces;
			word-break: break-all;
			margin-bottom: .45rem;

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
			border: 0.2rem solid var(--c__light-violet);
			transition: var(--transition-03);
			text-align: center;

			&:hover {
				color: var(--c__white);
				background-color: var(--c__violet);
				border-color: var(--c__violet);
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
				background-color: var(--c__white);
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