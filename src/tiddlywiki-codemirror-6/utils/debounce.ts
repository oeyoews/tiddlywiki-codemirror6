export const debounce = (
  fn: Function,
  delay = Number($tw.wiki.getTiddlerText('$:/config/Drafts/TypingTimeout'))
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
