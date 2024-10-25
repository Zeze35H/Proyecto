<script setup>
import { computed, watchEffect } from 'vue';

const props = defineProps(['current_page', 'items_list', 'items_per_page']);
const emit = defineEmits(['selectPage', 'updateList']);

const totalPages = computed(() => Math.ceil(props.items_list.length / props.items_per_page));

// Function to calculate the paginated list based on current page
const paginatedList = computed(() => {
    const start = (props.current_page - 1) * props.items_per_page;
    const end = start + props.items_per_page;
    return props.items_list.slice(start, end);
});

// Watch for changes to current_page and emit the updated paginated list
watchEffect(() => {
    emit('updateList', paginatedList.value);
});

function nextPage() {
    if (props.current_page < totalPages.value) {
        emit('selectPage', props.current_page + 1);
    }
}

function prevPage() {
    if (props.current_page > 1) {
        emit('selectPage', props.current_page - 1);
    }
}

function selectPage(pageNum) {
    emit('selectPage', pageNum);
}
</script>

<template>
    <div class="d-flex justify-content-center align-items-center pt-4">
        <ul class="pagination">
            <!-- PREVIOUS PAGE -->
            <li @click="prevPage" :class="{ 'disabled': current_page === 1 }" class="page-item">
                <a class="page-link px-3" href="#">«</a>
            </li>

            <!-- PAGE NUMBER -->
            <li v-for="pageNum in totalPages" :key="pageNum" @click="selectPage(pageNum)"
                :class="{ 'active': pageNum == current_page }" class="page-item">
                <a class="page-link" href="#">{{ pageNum }}</a>
            </li>

            <!-- NEXT PAGE -->
            <li @click="nextPage" :class="{ 'disabled': current_page === totalPages }" class="page-item">
                <a class="page-link px-3" href="#">»</a>
            </li>
        </ul>
    </div>
</template>
