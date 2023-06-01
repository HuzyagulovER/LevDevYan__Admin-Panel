<template>
	<ButtonColored :color="color ? color : 'transparent'">
		<slot></slot>
	</ButtonColored>
</template>

<script lang="ts" setup>
import ButtonColored from "@add-comps/ButtonColored.vue";
const { color } = defineProps<{ color?: string }>();
</script>


<style lang="scss" scoped>
button {
}
</style>