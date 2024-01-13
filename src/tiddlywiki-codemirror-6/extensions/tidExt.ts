// @ts-nocheck
import {
  Decoration,
  EditorView,
  MatchDecorator,
  WidgetType
} from '@codemirror/view';
import cm6 from '../cm6';
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
    wrapper.textContent = cm6['clickable-icon']() || ' 🔗';
    wrapper.className = 'cm-link';
    wrapper.style.cursor = 'pointer';
    wrapper.style.userSelect = 'none';
    wrapper.title = title;
    wrapper.onclick = (e) => {
      e.preventDefault();
      const goto = new $tw.Story();
      goto.navigateTiddler(title);
    };

    return wrapper;
  }
}

// [[xxx]] || {{xxx}}
const customLinkDecorator = new MatchDecorator({
  regexp: /(?:\[\[([\s\S]*?)\]\]|\{\{([\s\S]*?)\}\})/g,
  decorate: (add, from, to, match, view) => {
    const title = match[1] || match[2];
    // NOTE: 不会检查 system tiddler.
    // TODO: use gettiddlertext instead of tiddlerexist

    if (!$tw.wiki.tiddlerExists(title)) return;
    const start = to;
    const end = to;
    const customLink = new CustomLink({ at: start, title });
    add(start, end, Decoration.widget({ widget: customLink, side: 1 }));
    EditorView.atomicRanges.of((view) => ({
      from: start,
      end
    }));
  }
});

export const tidExt = createViewPlugin(customLinkDecorator);
