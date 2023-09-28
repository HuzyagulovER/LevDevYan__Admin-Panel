<template>
	<div class="filter">
		<IconFilter />
		<select v-model="filterValue">
			<option v-for="selection in selections" :key="selection.value" :value="selection.value">
				{{ selection.text }}
			</option>
		</select>
	</div>
</template>

<script setup lang="ts">
import IconFilter from "@icons/IconFilter.vue";
import { StringObject } from "../../../helpers";
import { Ref, ref, watch } from "vue";

const props = defineProps<{
	initValue: string
}>();
const emit = defineEmits(["onChangeValue"]);

const filterValue: Ref<string> = ref(props.initValue);

const selections: Array<StringObject> = [
	{
		text: "Все",
		value: "all",
	},
	{
		text: "Android",
		value: "android",
	},
	{
		text: "Apple",
		value: "apple",
	},
];

watch(() => filterValue.value,
	() => {
		emit("onChangeValue", filterValue.value)
	})

</script>

<style lang="scss" scoped>
@import "@/style.scss";

.filter {
	display: flex;
	align-items: center;
	background: rgba(219, 213, 255, 0.52);
	border-radius: 0.71rem;
	position: relative;

	svg {
		position: absolute;
		top: 50%;
		left: 1rem;
		transform: translateY(-50%);
		width: 2rem;
		height: 2rem;
		fill: $--c__violet;
		pointer-events: none;
	}

	select {
		width: 100%;
		height: 100%;
		padding: 1rem 1.2rem 1rem 3.8rem;
		font-weight: 600;
		background: transparent;
		border: 0;
		cursor: pointer;
	}
}
</style>