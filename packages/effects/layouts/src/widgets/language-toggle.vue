<script setup lang="ts">
import type { SupportedLanguagesType } from '@kbpd/locales';

import { SUPPORT_LANGUAGES } from '@kbpd/constants';
import { Languages } from '@kbpd/icons';
import { loadLocaleMessages } from '@kbpd/locales';
import { preferences, updatePreferences } from '@kbpd/preferences';

import { KbpdDropdownRadioMenu, KbpdIconButton } from '@kbpd-core/shadcn-ui';

defineOptions({
  name: 'LanguageToggle',
});

async function handleUpdate(value: string | undefined) {
  if (!value) return;
  const locale = value as SupportedLanguagesType;
  updatePreferences({
    app: {
      locale,
    },
  });
  await loadLocaleMessages(locale);
}
</script>

<template>
  <div>
    <KbpdDropdownRadioMenu
      :menus="SUPPORT_LANGUAGES"
      :model-value="preferences.app.locale"
      @update:model-value="handleUpdate"
    >
      <KbpdIconButton>
        <Languages class="text-foreground size-4" />
      </KbpdIconButton>
    </KbpdDropdownRadioMenu>
  </div>
</template>
