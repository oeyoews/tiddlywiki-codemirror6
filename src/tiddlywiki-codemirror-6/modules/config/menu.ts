const menuItems = [
  'snippets',
  'images',
  'emojis',
  'widgets',
  'tiddlers',
  'macros'
] as const;

type MenuType = (typeof menuItems)[number];

export const menu = {} as Record<MenuType, string>;

menuItems.forEach((item: MenuType) => {
  menu[item] = `(${item})` as const;
});
