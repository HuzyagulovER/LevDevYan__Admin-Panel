<template>
	<section class="promocodes-create">
		<form class="promocodes-create__form form" @submit.prevent="addPromocode">
			<label for="promocode" class="form__label">Название</label>
			<input
				id="promocode"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('promocode') }"
				name="promocode"
				:disabled="disabledForm"
				v-model="newPromocode.promocode"
				@input="error = clearVariable(error)"
			/>
			<label for="type" class="form__label">Тип</label>
			<input
				id="type"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('value') }"
				name="type"
				:disabled="disabledForm"
				v-model="newPromocode.value"
				@input="error = clearVariable(error)"
			/>
			<label for="value" class="form__label">Значение</label>
			<input
				id="value"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('type') }"
				name="value"
				:disabled="disabledForm"
				v-model="newPromocode.type"
				@input="error = clearVariable(error)"
			/>

			<ButtonGreen type="submit" :disabled="disabledForm"></ButtonGreen>
		</form>
	</section>
</template>

<script setup lang="ts">
import { ref, Ref } from "@vue/reactivity";
import { inject } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { Promocode } from "../../helpers";
import ButtonGreen from "@add-comps/ButtonGreen.vue";
import router from "../routes";

const store = <StoreGeneric>inject("Store");
const { loading } = storeToRefs(store);
const clearVariable: any = inject("clearVariable");

const newPromocode: Ref<Promocode> = ref({
	promocode: "",
	value: "",
	type: "",
});
let disabledForm: Ref<boolean> = ref(false);
let error: Ref<Array<string>> = ref([]);

function addPromocode() {
	disabledForm.value = true;

	for (let key in newPromocode.value) {
		if (newPromocode.value[key as keyof Promocode] === "")
			error.value.push(key);
	}

	if (error.value.length) {
		disabledForm.value = false;
		setTimeout(() => {
			error.value = clearVariable(error.value);
		}, 2000);
		return;
	}
	loading.value = true;

	store.addPromocode(newPromocode.value).then(() => {
		disabledForm.value = false;
		loading.value = false;

		newPromocode.value = clearVariable(newPromocode.value);
		router.push({ name: "Promocodes" });
	});
}
</script>

<style scoped lang="scss">
.promocodes-create {
	.form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		max-width: 450px;
		width: 100%;

		&__label,
		&__input {
			width: 100%;
		}

		&__label {
			margin-bottom: 0.5rem;
			font: {
				family: "Mazzard SemiBold";
				size: 1.6rem;
			}
		}

		&__input {
			margin-bottom: 1.2rem;
			border: 0.1rem solid var(--c__grey);
			border-radius: 0.6rem;
			font: {
				size: 1.25rem;
			}
			height: 2.5rem;
			padding: 0 1rem;

			&._error {
				border-color: red;
			}
		}
	}
}
</style>