<script setup lang="ts">
const { clear: clearSession } = useUserSession();

async function logout() {
	await clearSession();
	await navigateTo('/login');
}
</script>

<template>
	<div>
		<div class="link">
			<UButton to="/">Retourner à l'index</UButton>
		</div>
		<button id="logout" @click="logout">Se déconnecter</button>
	</div>
	<hr />
</template>

<style scoped>
div {
	display: flex;
	align-items: center;
}

.link {
	flex: 20;
}

#logout {
	flex: 1;
}
</style>
