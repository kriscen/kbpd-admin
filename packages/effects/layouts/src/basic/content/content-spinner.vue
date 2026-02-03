<script lang="ts" setup>
import { KbpdSpinner } from '@kbpd-core/shadcn-ui';

import { useContentSpinner } from './use-content-spinner';

defineOptions({ name: 'LayoutContentSpinner' });

const { spinning } = useContentSpinner();
</script>
<template>
  <KbpdSpinner :spinning="spinning" />
</template>
