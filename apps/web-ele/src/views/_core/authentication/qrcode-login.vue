<script lang="ts" setup>
import { AuthenticationQrCodeLogin } from '@kbpd/common-ui';
import { LOGIN_PATH } from '@kbpd/constants';

defineOptions({ name: 'QrCodeLogin' });
</script>

<template>
  <AuthenticationQrCodeLogin :login-path="LOGIN_PATH" />
</template>
