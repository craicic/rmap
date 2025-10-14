<script setup lang="ts">
const { clear: clearSession } = useUserSession();

async function logout() {
	await clearSession();
	await navigateTo('/login');
}
const { user } = useUserSession();
</script>

<template>
	<nav class="flex items-center justify-between p-4">
		<div class="flex items-left gap-2 flex-col">
			<ULink to="/" class="font-bold p-2 rounded-xl outline outline-primary">RMAP</ULink>
			<p v-if="user">Bienvenue {{ user.name }}</p>
		</div>
		<ul class="inline-flex gap-4 list-none p-0 m-0">
			<li>
				<UButton to="/import">Importer une carte</UButton>
			</li>
			<li>
				<UButton to="/maps/list">Liste des cartes</UButton>
			</li>
			<li>
				<UButton id="logout" @click="logout">Se déconnecter</UButton>
			</li>
		</ul>
	</nav>
	<hr />
	<slot />
</template>
