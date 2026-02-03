<script setup lang="ts">
import { useAppConfig } from '@kbpd/hooks';
import { MdiGithub, MdiGoogle, MdiQqchat, MdiWechat } from '@kbpd/icons';
import { $t } from '@kbpd/locales';

import { KbpdIconButton } from '@kbpd-core/shadcn-ui';

import DingdingLogin from './dingding-login.vue';

defineOptions({
  name: 'ThirdPartyLogin',
});

const {
  auth: { dingding: dingdingAuthConfig },
} = useAppConfig(import.meta.env, import.meta.env.PROD);
</script>

<template>
  <div class="w-full sm:mx-auto md:max-w-md">
    <div class="mt-4 flex items-center justify-between">
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
      <span class="text-muted-foreground text-center text-xs uppercase">
        {{ $t('authentication.thirdPartyLogin') }}
      </span>
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
    </div>

    <div class="mt-4 flex flex-wrap justify-center">
      <KbpdIconButton
        :tooltip="$t('authentication.wechatLogin')"
        tooltip-side="top"
        class="mb-3"
      >
        <MdiWechat />
      </KbpdIconButton>
      <KbpdIconButton
        :tooltip="$t('authentication.qqLogin')"
        tooltip-side="top"
        class="mb-3"
      >
        <MdiQqchat />
      </KbpdIconButton>
      <KbpdIconButton
        :tooltip="$t('authentication.githubLogin')"
        tooltip-side="top"
        class="mb-3"
      >
        <MdiGithub />
      </KbpdIconButton>
      <KbpdIconButton
        :tooltip="$t('authentication.googleLogin')"
        tooltip-side="top"
        class="mb-3"
      >
        <MdiGoogle />
      </KbpdIconButton>
      <DingdingLogin
        v-if="dingdingAuthConfig"
        :corp-id="dingdingAuthConfig.corpId"
        :client-id="dingdingAuthConfig.clientId"
        class="mb-3"
      />
    </div>
  </div>
</template>
