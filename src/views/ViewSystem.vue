<template>
	<section class="system">
		<div class="system__container">
			<div class="system__info info" v-for="(info, j) in logsInfo" :key="j">
				<div class="info__preview">
					<p class="info__title">{{ titles[j] }}</p>
					<p class="info__logs" :class="{ clear: info?.is_clear_needed }">Логи <span>{{ info?.logs_size.format_value
					}}</span></p>
					<p class="info__all">Всего <span>{{ info?.total_size.format_value }}/{{ totalSize }}</span></p>
				</div>
				<p class="info__hint clear" v-if="info?.is_clear_needed">Пора очистить логи. Логи очищаются все старше 3х
					месяцев</p>
				<ButtonColored :color="'#6890F9'" class="info__button" :class="{ clear: info?.is_clear_needed }">Очистить логи
				</ButtonColored>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import ButtonColored from "@add-comps/ButtonColored.vue";

import { useRoute } from "vue-router";
import { StoreGeneric, storeToRefs } from "pinia";
import { inject, ref, Ref, watch } from "vue";
import {
	Logs,
	LogsInfo,
	LogsInfoItem
} from "../../helpers";

const route = useRoute();
const store = <StoreGeneric>inject("Store");
const { loading } = storeToRefs(store);
const titles: { [key: string]: string } = {
	psy_avocado: "Psy&Avocado",
	admin: "Админка",
}

const totalSize: Ref<string> = ref('')
const logsInfo: Ref<LogsInfo> = ref({})

loadData();

async function loadData(): Promise<void> {
	loading.value = true;
	await store.getLogsInfo().then((r: Logs) => {
		totalSize.value = <string>r.total_size
		logsInfo.value = <LogsInfo>r.logs
	})
	loading.value = false;
}
</script>

<style lang="scss" scoped>
@import "@/style.scss";


.system {

	&__container {}

	.info {

		&__preview {
			display: flex;
			justify-content: space-between;
			background-color: $--c__light-green;
			padding: 2rem 3rem;
			border: 0.1rem solid $--c__light-violet;
			border-radius: 1.6rem;

			font: {
				size: 1.5rem;
			}
		}

		&__preview,
		&__hint {
			margin-bottom: 1.5rem;
		}

		&__hint {
			font-size: 1.2rem;
		}

		&+.info {
			margin-top: 3rem;
		}

		&__title {}


		&__logs {}

		&__all {}

		&__title,
		&__logs span,
		&__all span {
			font: {
				weight: bold;
			}
		}

		&__button {
			&.clear {
				background-color: $--c__red !important;
				color: $--c__white !important;
			}
		}

		.clear {
			color: $--c__red;
		}
	}
}
</style>