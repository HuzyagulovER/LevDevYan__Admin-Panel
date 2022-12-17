<template>
	<div class="bubbles">
		<img src="@images/bubble.png" alt="" class="bubbles__image" />
		<img src="@images/bubble.png" alt="" class="bubbles__image" />
		<img src="@images/bubble.png" alt="" class="bubbles__image" />
		<img src="@images/bubble.png" alt="" class="bubbles__image" />
	</div>
</template>

<style lang="scss" scoped>
.bubbles {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-end;
	width: auto;
	height: 100%;

	&__image {
		&:nth-child(1) {
			width: 100%;
		}
		&:nth-child(2) {
			width: 60%;
		}
		&:nth-child(3) {
			width: 42%;
		}
		&:nth-child(4) {
			width: 31%;
		}
	}
}
</style>