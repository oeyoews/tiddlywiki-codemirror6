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
    wrapper.href = this.state.url;
    wrapper.title = String(this.state.url).replace(/^https?:\/\//, '');
    wrapper.target = '_blank';
    // wrapper.innerHTML = `<i class="fas fa-link mx-1"></i>`;
    wrapper.innerHTML = ' 🔗';
    wrapper.className = 'cm-link';
    wrapper.rel = 'nofollow';
    return wrapper;
  }
}

// https://xxxk
const linkDecorator = new MatchDecorator({
  regexp: /https?:\/\/[a-z0-9\._/~%\-\+&\#\?!=\(\)@]*/gi,
  decorate: (add, from, to, match, view) => {
    const url = match[0];
    const start = to,
      end = to;
    const linkIcon = new HyperLink({ at: start, url });
    add(start, end, Decoration.widget({ widget: linkIcon, side: 1 }));
  }
});

export const linkExt = createViewPlugin(linkDecorator);
