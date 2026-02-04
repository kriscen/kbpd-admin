import { icons as carbonIcons } from '@iconify-json/carbon';
import { icons as lucideIcons } from '@iconify-json/lucide';
import { addCollection } from '@iconify/vue';

addCollection(carbonIcons);
addCollection(lucideIcons);

export * from './create-icon';

export * from './lucide';

export type { IconifyIcon as IconifyIconStructure } from '@iconify/vue';
export {
  addCollection,
  addIcon,
  Icon as IconifyIcon,
  listIcons,
} from '@iconify/vue';
