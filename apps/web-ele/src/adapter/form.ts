import type {
  KbpdFormSchema as FormSchema,
  KbpdFormProps,
} from '@kbpd/common-ui';

import type { ComponentType } from './component';

import { setupKbpdForm, useKbpdForm as useForm, z } from '@kbpd/common-ui';
import { $t } from '@kbpd/locales';

async function initSetupKbpdForm() {
  setupKbpdForm<ComponentType>({
    config: {
      modelPropNameMap: {
        Upload: 'fileList',
        CheckboxGroup: 'model-value',
      },
    },
    defineRules: {
      required: (value, _params, ctx) => {
        if (value === undefined || value === null || value.length === 0) {
          return $t('ui.formRules.required', [ctx.label]);
        }
        return true;
      },
      selectRequired: (value, _params, ctx) => {
        if (value === undefined || value === null) {
          return $t('ui.formRules.selectRequired', [ctx.label]);
        }
        return true;
      },
    },
  });
}

const useKbpdForm = useForm<ComponentType>;

export { initSetupKbpdForm, useKbpdForm, z };

export type KbpdFormSchema = FormSchema<ComponentType>;
export type { KbpdFormProps };
