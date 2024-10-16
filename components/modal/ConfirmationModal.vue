<script setup lang="ts">
import { ref } from "vue";
import ModalTemplate from "./ModalTemplate.vue";

const { t } = useI18n();

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  buttonTitle: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    required: true
  },
  callback: {
    type: Function,
    required: true
  }
});

/**
 * Trigger the callback and close the modal.
 */
const confirm = () => {
  props.callback();
  closeModal();
}

//region ModalControl
const isModalOpen = ref(false);

const openModal = (): void => {
  isModalOpen.value = true;
};

const closeModal = (): void => {
  isModalOpen.value = false;
};
//endregion
</script>

<template>
  <div class="flex justify-center text-content-50 items-center w-full h-full rounded-xl"
       :disabled="disabled"
       @click="openModal">
    <slot></slot>
</div>

  <Teleport to="body">
    <ModalTemplate :show="isModalOpen" @close="closeModal">
      <template v-slot:header>
        <header class="h-12 px-8 flex justify-between items-center rounded-t-lg">
          <div class="flex flex-col text-content-50">
            <span class="text-lg font-bold text-content-primary">{{title}}</span>
          </div>
        </header>
      </template>

      <template v-slot:content>
        <div class="flex flex-col grow overflow-auto items-center px-8 py-8 text-content-primary">
          <div class="flex flex-col">
            <p class="pb-3">
              {{message}}
            </p>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <footer class="mb-4 mx-6 space-x-4 text-right flex flex-row justify-between">
          <ButtonBasic
            @click="closeModal"
            class="w-1/3 rounded-lg"
            design="outline"
            type="button"
            :label="t('back')"
          />

          <ButtonBasic
            @click="confirm"
            class="w-1/3 rounded-lg"
            design="danger"
            type="button"
            :label="buttonTitle"
          />
        </footer>
      </template>
    </ModalTemplate>
  </Teleport>
</template>

<style scoped lang="css">
</style>
