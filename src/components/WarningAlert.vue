<script setup>
defineProps(['message'])
</script>

<template>
    <div class="alert alert-danger d-flex align-items-center c m-3" role="alert">
        <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Danger:">
            <use xlink:href="#exclamation-triangle-fill" />
        </svg>
        <div>
            {{ message }}
        </div>
    </div>
</template>