import { ref } from 'vue'

const message = ref('')
const visible = ref(false)

export function useToast() {
  function show(msg, duration = 3000) {
    message.value = msg
    visible.value = true
    setTimeout(() => (visible.value = false), duration)
  }

  return { message, visible, show }
}
