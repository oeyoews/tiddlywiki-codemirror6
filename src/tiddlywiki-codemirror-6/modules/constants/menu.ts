import { capitalize } from '@/cm6/utils/capitalize';

const menuItems = [
  'snippets',
  'images',
  'emojis',
  'widgets',
  'tiddlers',
  'macros',
  'tags',
  'filetypes',
  'commands',
  'md',
  'mermaid',
  'codeblocks'
] as const;

type MenuType = (typeof menuItems)[number];

export const menu = {} as Record<MenuType, string>;

menuItems.forEach((item) => {
  menu[item] = `(${capitalize(item)})`;
});
