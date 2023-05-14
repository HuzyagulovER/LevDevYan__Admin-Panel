<template>
	<div class="checkbox" :class="{ _active: checked }">
		<input
			type="checkbox"
			v-model="checked"
			class="checkbox__input"
			@change.prevent="changeState"
		/>
		<div class="checkbox__background"></div>
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
	</div>
</template>

<script lang="ts" setup>
import { clone } from "lodash";
import { ref, Ref } from "vue";

const emit = defineEmits(["changeState"]);

const { defaultChecked } = defineProps<{
	defaultChecked: boolean | undefined;
}>();

const checked: Ref<boolean> = ref(false);
checked.value = clone(defaultChecked as boolean);

function changeState() {
	console.log("Checkbox:" + checked.value);

	emit("changeState", +checked.value);
}
</script>

<style lang="scss" scoped>
@import "../../style.scss";

.checkbox {
	margin-left: auto;
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	border: 0.2rem solid #929292;
	transition: var(--transition-03);
	cursor: pointer;

	&__background {
		position: absolute;
		background-color: #04d370;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		z-index: 2;
	}

	&__input {
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: 0;
		z-index: 4;
	}

	svg {
		fill: #fff;
		width: 60%;
		height: 60%;
		z-index: 3;
	}

	&__background,
	svg {
		transform: scale(0);
		transition: all 0.3s ease-in;
	}

	@media screen and (max-width: $mobile--breakpoint) {
		width: 2.3rem;
		height: 2.3rem;
	}
}

._active.checkbox {
	border-width: 0;

	svg {
		transform: scale(1);
	}

	.checkbox__background {
		transform: scale(1);
	}
}
</style>
