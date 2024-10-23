<script setup>
defineProps(['header_message', 'body_message'])
defineEmits(["closeModal"])
</script>

<template>
    <div class="modal fade" id="editAndDeleteStaticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"
        tabindex="-5" aria-labelledby="editAndDeleteStaticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                <!-- MODAL HEADER -->
                <div class="modal-header">
                    <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Danger:">
                        <use xlink:href="#exclamation-triangle-fill" />
                    </svg>

                    <!-- MODAL HEADER MESSAGE -->
                    <h5 class="modal-title" id="editAndDeleteStaticBackdropLabel">{{ header_message }}</h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="$emit('closeModal')"></button>
                </div>

                <!-- MODAL BODY -->
                <div class="modal-body">
                    <strong>{{ body_message }}</strong>

                    <!-- DELETE MODAL BODY -->
                    <SingleRowTable v-if="this.delete" :fields="['NAME', 'SURNAME', 'E-MAIL', 'SUBJECT']"
                        :contents="[row_delete.name, row_delete.surname, row_delete.email, row_delete.subject]" />

                    <!-- EDIT MODAL BODY -->
                    <BeforeAfterTable v-else-if="this.edit" :fields="['Name', 'Surname', 'Email']"
                        :before="[table_contents[row_index].name, table_contents[row_index].surname, table_contents[row_index].email]"
                        :after="[edit_row.name, edit_row.surname, edit_row.email]" />
                </div>

                <!-- MODAL FOOTER -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        @click="$emit('closeModal')">Cancel</button>

                    <!-- DELETE MODAL FOOTER -->
                    <button v-if="this.delete" @click="confirmDeleteRow()" type="button" class="btn btn-danger"
                        data-bs-dismiss="modal">Confirm Delete</button>
                    <!-- EDIT MODAL FOOTER -->
                    <button v-else-if="this.edit" @click="confirmEdit()" type="button" class="btn btn-success"
                        data-bs-dismiss="modal">Confirm Changes</button>
                </div>
            </div>
        </div>
    </div>
</template>