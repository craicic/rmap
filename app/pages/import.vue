<script setup>
definePageMeta({
	middleware: ['authenticated'],
});
</script>

<template>
	<logoutHeader />
	<importForm />
</template>

<style scoped>
div {
	margin: 0.5rem;
}
</style>
