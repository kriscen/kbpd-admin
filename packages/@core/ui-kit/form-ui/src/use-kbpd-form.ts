import type {
  BaseFormComponentType,
  ExtendedFormApi,
  KbpdFormProps,
} from './types';

import { defineComponent, h, isReactive, onBeforeUnmount, watch } from 'vue';

import { useStore } from '@kbpd-core/shared/store';

import { FormApi } from './form-api';
import KbpdUseForm from './kbpd-use-form.vue';

export function useKbpdForm<
  T extends BaseFormComponentType = BaseFormComponentType,
>(options: KbpdFormProps<T>) {
  const IS_REACTIVE = isReactive(options);
  const api = new FormApi(options);
  const extendedApi: ExtendedFormApi = api as never;
  extendedApi.useStore = (selector) => {
    return useStore(api.store, selector);
  };

  const Form = defineComponent(
    (props: KbpdFormProps, { attrs, slots }) => {
      onBeforeUnmount(() => {
        api.unmount();
      });
      api.setState({ ...props, ...attrs });
      return () =>
        h(KbpdUseForm, { ...props, ...attrs, formApi: extendedApi }, slots);
    },
    {
      name: 'KbpdUseForm',
      inheritAttrs: false,
    },
  );
  // Add reactivity support
  if (IS_REACTIVE) {
    watch(
      () => options.schema,
      () => {
        api.setState({ schema: options.schema });
      },
      { immediate: true },
    );
  }

  return [Form, extendedApi] as const;
}
