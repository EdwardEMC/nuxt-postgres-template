<script setup lang="ts">
defineProps({
  label: String,
  design: {
    type: String as PropType<"primary" | "danger" | "outline">,
    default: "primary"
  },
  type: {
    type: String as PropType<"button" | "submit" | "reset" | undefined>,
    default: "button"
  }
});
</script>

<template>
  <button 
    :type="type" 
    class="w-full py-2 rounded transition duration-200"
    :class="{
      'bg-button-primary text-content-menu hover:bg-button-secondary': design === 'primary',
      'bg-danger-primary text-content-danger hover:bg-danger-secondary': design === 'danger',
      'border border-button-outline text-content-primary hover:bg-background-secondary': design === 'outline',
    }"
  >
    {{ label }}
  </button>
</template>
