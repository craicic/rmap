<script setup lang="ts">
definePageMeta({
	middleware: ['authenticated'],
});
</script>

<template>
	<slot />
</template>
