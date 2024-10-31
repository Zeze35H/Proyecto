<script setup>
defineProps(["fields", "before", "after"])
</script>

<template>
    <div class="table-responsive bg-white my-3">
        <table class="table mb-0">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">BEFORE</th>
                    <th scope="col">AFTER</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="({ field }, index) in fields" :key="index">
                    <td><strong>{{field}}</strong></td>
                    <td>{{ before[index] }}</td>
                    <td>{{ after[index] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>