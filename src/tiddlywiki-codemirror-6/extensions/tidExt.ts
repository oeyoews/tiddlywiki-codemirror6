// @ts-nocheck
import { Decoration, MatchDecorator, WidgetType } from '@codemirror/view';
import cmeConfig from '../cmeConfig';
import createViewPlugin from '../utils/createViewPlugin';

class CustomLink extends WidgetType {
  constructor(state) {
    super();
    this.state = state;
  }

  eq(other) {
    return (
      this.state.content === other.state.content &&
      this.state.at === other.state.at
    );
  }

  toDOM() {
    const wrapper = document.createElement('a');
    const title = this.state.title;
    wrapper.innerHTML = cmeConfig['clickable-icon']() || ' 🔗';
    wrapper.className = 'cm-link';
    wrapper.style.cursor = 'pointer';
    wrapper.title = title;
    wrapper.onclick = (e) => {
      e.preventDefault();
      const goto = new $tw.Story();
      goto.navigateTiddler(title);
    };
    return wrapper;
  }
}

const customLinkDecorator = new MatchDecorator({
  regexp: /\[\[([\s\S]*?)\]\]|\{\{([\s\S]*?)\}\}/g, // 匹配 [[xxx]] 或 {{xxx}}
  decorate: (add, from, to, match, view) => {
    const title = match[1];
    console.log(title);
    // if (!title.length) return;
    // NOTE: 不会检查 system tiddler.
    if (!$tw.wiki.tiddlerExists(title)) return;
    const start = to,
      end = to;
    const customLink = new CustomLink({ at: start, title });
    add(start, end, Decoration.widget({ widget: customLink, side: 1 }));
  }
});

export const tidExt = createViewPlugin(customLinkDecorator);
