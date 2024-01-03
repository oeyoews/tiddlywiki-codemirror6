// @ts-nocheck
import { Decoration, MatchDecorator, WidgetType } from '@codemirror/view';
import createViewPlugin from '../utils/createViewPlugin';

// https://discuss.codemirror.net/t/avoid-replacing-match-in-matchdecorator-decorator-to-add-link-icon-after-urls/4719/3
class HyperLink extends WidgetType {
  constructor(state) {
    super();
    this.state = state;
  }
  eq(other) {
    return (
      this.state.url === other.state.url && this.state.at === other.state.at
    );
  }
  toDOM() {
    const wrapper = document.createElement('a');
    const goto = new $tw.Story();
    const title = this.state.title;
    wrapper.href = title;
    wrapper.title = title;
    wrapper.innerHTML = ' 🖼️';
    wrapper.className = 'cm-link';
    wrapper.onclick = (e) => {
      e.preventDefault();
      goto.navigateTiddler(title);
    };
    return wrapper;
  }
}

const linkDecorator = new MatchDecorator({
  regexp: /\[img\[([a-z0-9\._/~%\-\+&\#\?!=\(\)@]*)\]\]/gi,
  decorate: (add, from, to, match, view) => {
    const title = match[1]; // 使用捕获组 [img[xxx]] 中的 xxx 部分
    const start = to;
    const end = to;
    const linkIcon = new HyperLink({ at: start, title });
    add(start, end, Decoration.widget({ widget: linkIcon, side: 0 }));
  }
});

export const imgExt = createViewPlugin(linkDecorator);
