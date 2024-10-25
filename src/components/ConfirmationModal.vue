<script setup>
defineProps(['header_message', 'body_message'])
defineEmits(["closeModal"])
</script>

<template>
    <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-5"
        aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <!-- MODAL HEADER -->
                <div class="modal-header">
                    <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Danger:">
                        <use xlink:href="#exclamation-triangle-fill" />
                    </svg>

                    <!-- MODAL HEADER MESSAGE -->
                    <h5 class="modal-title" id="confirmationModalLabel">{{ header_message }}</h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="$emit('closeModal')"></button>
                </div>

                <!-- MODAL BODY -->
                <div class="modal-body">
                    <strong>{{ body_message }}</strong>

                    <slot name="body_content"></slot>
                </div>

                <!-- MODAL FOOTER -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        @click="$emit('closeModal')">Cancel</button>

                    <slot name="footer_button"></slot>
                </div>
            </div>
        </div>
    </div>

</template>