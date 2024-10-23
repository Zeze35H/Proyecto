<script setup>
defineProps(['header_message', 'body_message'])
defineEmits(["closeModal"])
</script>

<template>
    <div class="modal fade show d-block" tabindex="-1"
        aria-labelledby="loginModalLabel" aria-hidden="true" style="background: rgba(0, 0, 0, 0.5);"
        @click.self="$emit('closeModal')">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:">
                        <use xlink:href="#info-fill" />
                    </svg>

                    <!-- HEADER MESSAGE -->
                    <h5 class="modal-title" id="loginModalLabel">{{header_message}}</h5>

                    <button type="button" class="btn-close" aria-label="Close" @click="$emit('closeModal')"></button>
                </div>

                <!-- BODY MESSAGE -->
                <div class="modal-body">
                    {{body_message}}
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="$emit('closeModal')">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>