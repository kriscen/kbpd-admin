import { ref } from "vue";

export function useBoolean(initialValue = false) {
  const state = ref(initialValue);

  const setTrue = () => {
    state.value = true;
  };

  const setFalse = () => {
    state.value = false;
  };

  const toggle = () => {
    state.value = !state.value;
  };

  const setValue = (value: boolean) => {
    state.value = value;
  };

  return {
    state,
    setTrue,
    setFalse,
    toggle,
    setValue
  };
}
