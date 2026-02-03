export type {
  AlertProps,
  BeforeCloseScope,
  IconType,
  PromptProps,
} from './alert';
export { useAlertContext } from './alert';
export { default as Alert } from './alert.vue';
export {
  kbpdAlert as alert,
  clearAllAlerts,
  kbpdConfirm as confirm,
  kbpdPrompt as prompt,
} from './AlertBuilder';
