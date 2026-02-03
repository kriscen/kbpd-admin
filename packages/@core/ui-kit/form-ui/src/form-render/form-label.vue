<script setup lang="ts">
import type { CustomRenderType } from '../types';

import {
  FormLabel,
  KbpdHelpTooltip,
  KbpdRenderContent,
} from '@kbpd-core/shadcn-ui';
import { cn } from '@kbpd-core/shared/utils';

interface Props {
  class?: string;
  colon?: boolean;
  help?: CustomRenderType;
  label?: CustomRenderType;
  required?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <FormLabel :class="cn('flex items-center', props.class)">
    <span v-if="required" class="text-destructive mr-[2px]">*</span>
    <slot></slot>
    <KbpdHelpTooltip v-if="help" trigger-class="size-3.5 ml-1">
      <KbpdRenderContent :content="help" />
    </KbpdHelpTooltip>
    <span v-if="colon && label" class="ml-[2px]">:</span>
  </FormLabel>
</template>
