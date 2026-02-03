<script setup lang="ts">
import type { ButtonVariants } from '../../ui';
import type { KbpdButtonProps } from './button';

import { computed, useSlots } from 'vue';

import { cn } from '@kbpd-core/shared/utils';

import { KbpdTooltip } from '../tooltip';
import KbpdButton from './button.vue';

interface Props extends KbpdButtonProps {
  class?: any;
  disabled?: boolean;
  onClick?: () => void;
  tooltip?: string;
  tooltipDelayDuration?: number;
  tooltipSide?: 'bottom' | 'left' | 'right' | 'top';
  variant?: ButtonVariants;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  onClick: () => {},
  tooltipDelayDuration: 200,
  tooltipSide: 'bottom',
  variant: 'icon',
});

const slots = useSlots();

const showTooltip = computed(() => !!slots.tooltip || !!props.tooltip);
</script>

<template>
  <KbpdButton
    v-if="!showTooltip"
    :class="cn('rounded-full', props.class)"
    :disabled="disabled"
    :variant="variant"
    size="icon"
    @click="onClick"
  >
    <slot></slot>
  </KbpdButton>

  <KbpdTooltip
    v-else
    :delay-duration="tooltipDelayDuration"
    :side="tooltipSide"
  >
    <template #trigger>
      <KbpdButton
        :class="cn('rounded-full', props.class)"
        :disabled="disabled"
        :variant="variant"
        size="icon"
        @click="onClick"
      >
        <slot></slot>
      </KbpdButton>
    </template>
    <slot v-if="slots.tooltip" name="tooltip"> </slot>
    <template v-else>
      {{ tooltip }}
    </template>
  </KbpdTooltip>
</template>
