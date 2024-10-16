// @ts-nocheck
import {
  Decoration,
  EditorView,
  MatchDecorator,
  WidgetType
} from '@codemirror/view';
import cm6 from '@/cm6/config';
import createViewPlugin from '@/cm6/utils/createViewPlugin';
import { useSound } from '@/cm6/utils/capitalize';

// add clickable icon
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
    wrapper.className = 'cm-tiddler-link';
    wrapper.title = title;
    wrapper.onclick = (e: MouseEvent) => {
      e.preventDefault();
      if (e.ctrlKey) {
        useSound();
        new $tw.Story().navigateTiddler(title);
      }
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

export const tidExt = [
  createViewPlugin(customLinkDecorator),

  EditorView.baseTheme({
    '.cm-tiddler-link': {
      cursor: 'pointer',
      'user-select': 'none',
      'text-decoration': 'none',
      transition: 'all 0.2s ease',
      scale: '0.8',
      display: 'line-block'
    },
    '.cm-tiddler-link:hover': {
      scale: '1'
    }
  })
];
