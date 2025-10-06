<script setup>
definePageMeta({
	middleware: ['authenticated'],
});
</script>
<template>
	<div>
		<logoutHeader />
		<mapViewer />
	</div>
</template>
