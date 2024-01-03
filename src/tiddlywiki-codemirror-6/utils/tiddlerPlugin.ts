// @ts-nocheck
import {
  Decoration,
  MatchDecorator,
  ViewPlugin,
  WidgetType
} from '@codemirror/view';

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
    const contentWithoutBrackets = this.state.content.replace(
      /\[\[|\]\]|\{\{|\}\}/g,
      ''
    ); // 去除双方括号或双花括号

    const wrapper = document.createElement('a');
    wrapper.innerHTML = ' 🔗';
    wrapper.className = 'cm-link';
    wrapper.title = contentWithoutBrackets;
    wrapper.href = `/#${encodeURIComponent(contentWithoutBrackets)}`;
    wrapper.onclick = (e) => {
      e.preventDefault();
      const goto = new $tw.Story();
      goto.navigateTiddler(contentWithoutBrackets);
    };
    return wrapper;
  }
}

const customLinkDecorator = new MatchDecorator({
  regexp: /\[\[([\s\S]*?)\]\]|\{\{([\s\S]*?)\}\}/g, // 匹配 [[xxx]] 或 {{xxx}}
  decorate: (add, from, to, match, view) => {
    const content = match[0]; // 提取括号内的内容
    if (content.length <= 4) return;
    const start = to,
      end = to;
    const customLink = new CustomLink({ at: start, content });
    add(start, end, Decoration.widget({ widget: customLink, side: 1 }));
  }
});

export const customLinkPlugin = ViewPlugin.fromClass(
  class CustomLinkView {
    constructor(view) {
      this.decorator = customLinkDecorator;
      this.decorations = this.decorator.createDeco(view);
    }

    update(update) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.decorator.updateDeco(update, this.decorations);
      }
    }
  },
  { decorations: (v) => v.decorations }
);
