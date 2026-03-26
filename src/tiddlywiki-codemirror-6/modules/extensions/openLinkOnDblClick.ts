import { EditorView } from '@codemirror/view';
import { type Extension } from '@codemirror/state';

// Match plain URLs and stop before common TiddlyWiki wikitext delimiters:
// - `]]` for `[[https://...]]`
// - `|`  for `[[https://...|label]]`
// - whitespace/end for plain text
//
// Also allows single `]` inside URL (e.g. IPv6 literals), but stops before `]]`.
const urlRegexp =
  /((?:https?|ftp):\/\/(?:[^\s\[\]|]+|](?!]))+)(?=\s|$|\]\]|\|)/gi;

function getUrlAtLinePos(lineText: string, linePos: number) {
  for (const match of lineText.matchAll(urlRegexp)) {
    const url = match[1];
    const start = match.index ?? -1;
    const end = start + url.length;
    if (start <= linePos && linePos <= end) return url;
  }
  return null;
}

function getTiddlerLinkAtLinePos(lineText: string, linePos: number) {
  // Find nearest [[ ... ]] pair containing linePos.
  const left = lineText.lastIndexOf('[[', linePos);
  if (left < 0) return null;
  const right = lineText.indexOf(']]', left + 2);
  if (right < 0) return null;
  if (linePos < left || linePos > right + 1) return null;

  const inner = lineText.slice(left + 2, right);
  if (!inner) return null;

  // `[[caption|title]]` → title
  const parts = inner.split('|');
  const title = (parts.length > 1 ? parts[parts.length - 1] : inner).trim();
  if (!title) return null;

  // Avoid treating external links as tiddlers when written as `[[https://...]]`
  if (/^(?:https?|ftp):\/\//i.test(title)) return null;

  // Must exist in wiki, otherwise keep default selection behavior.
  try {
    if (!$tw?.wiki?.tiddlerExists?.(title) && !$tw?.wiki?.getTiddlerText?.(title))
      return null;
  } catch {
    return null;
  }

  return title;
}

export const openLinkOnDblClick: Extension = EditorView.domEventHandlers({
  dblclick(event, view) {
    const e = event as MouseEvent;
    const pos = view.posAtCoords({ x: e.clientX, y: e.clientY });
    if (pos == null) return false;

    const line = view.state.doc.lineAt(pos);
    const linePos = pos - line.from;

    const url = getUrlAtLinePos(line.text, linePos);
    if (url) {
      // Only intercept when it's a URL (keep normal double-click selection otherwise).
      e.preventDefault();
      e.stopPropagation();
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    }

    const title = getTiddlerLinkAtLinePos(line.text, linePos);
    if (!title) return false;

    e.preventDefault();
    e.stopPropagation();

    new $tw.Story().navigateTiddler(title);
    return true;
  }
});

