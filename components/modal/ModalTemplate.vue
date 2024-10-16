<script setup lang="ts">
defineProps({
  show: Boolean,
  rounded: {
    type: Boolean,
    default: true
  }
});

defineEmits([
  'close'
])
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-from-class="opacity-0 scale-110"
      enter-to-class="opacity-100 scale-100"
      enter-active-class="transition duration-300"
      leave-active-class="transition duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-110"
    >
      <div v-if="show" @mousedown="$emit('close')" class="fixed inset-0 bg-modal-site-background grid place-items-center z-[100]">
        <dialog @mousedown.stop class="bg-background-tertiary flex flex-col relative text-primary" :class="rounded ? 'rounded-lg' : ''">
          <slot name="header"></slot>
          <slot name="content"></slot>
          <slot name="footer"></slot>
        </dialog>
      </div>
    </Transition>
  </Teleport>
</template>
