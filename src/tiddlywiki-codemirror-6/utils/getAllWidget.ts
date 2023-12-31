const modules = $tw.modules.titles;

const allwidgets = Object.entries(modules)
  .filter(([_, { moduleType }]) => moduleType === 'widget')
  // @ts-ignore
  .map(([_, { exports }]) => Object.keys(exports)[0]);

export default allwidgets;
