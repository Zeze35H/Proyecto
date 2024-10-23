<script setup>
defineProps(["fields", "contents"])
</script>

<template>
    <div class="table-responsive bg-white my-3">
        <table class="table mb-0">
            <thead>
                <tr>
                    <th v-for="field in fields" scope="col">{{ field }}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td v-for="content in contents">{{ content }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>