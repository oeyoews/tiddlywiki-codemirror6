// TODO: support chinese fullwidth characters ???
const triggerType = {
  link: '[[',
  embed: '{{',
  macro: '<<',
  img: '[img[',
  widget: '<$',
  emoji: ':',
  tag: '#',
  filetype: '//',
  command: '@#',
  md: ':::',
  mermaid: '``',
  codeblocks: '```'
} as const;

export default triggerType;

type ITriggerType = keyof typeof triggerType;

export type ITriggerTypeChar = (typeof triggerType)[ITriggerType];
