import { capitalize } from 'src/tiddlywiki-codemirror-6/utils/capitalize';

const menuItems = [
  'snippets',
  'images',
  'emojis',
  'widgets',
  'tiddlers',
  'macros',
  'tags',
  'filetypes'
] as const;

type MenuType = (typeof menuItems)[number];

export const menu = {} as Record<MenuType, string>;

menuItems.forEach((item: MenuType) => {
  menu[item] = `(${capitalize(item)})`;
});
