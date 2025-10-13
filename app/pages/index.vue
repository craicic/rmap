<script setup lang="ts">
definePageMeta({
	middleware: ['authenticated'],
});
const { user } = useUserSession();
</script>

<template>
	<div>
		<logoutHeader />
		<h1 v-if="user">Bienvenue {{ user.name }}</h1>
		<div>
			<NuxtLink to="/import">Importer une carte</NuxtLink>
		</div>
		<div>
			<NuxtLink to="/maps/list">Voir la liste des cartes</NuxtLink>
		</div>
		<hr />
	</div>
</template>
