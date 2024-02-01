interface IOptions {
  widget: IWidget;
  value: string;

  /** tiddler type */
  type: string;
  parentNode: any;
  nextSibling: any;
}

type ISource = {
  vanillaTitle?: string;
  title: string;
  text: string;
  desc?: string;
  caption?: string;
};

type Icon<T extends string> = `cm-${T}`;

type ICompletionIcons =
  | Icon<'css'>
  | Icon<'markdown'>
  | Icon<'tiddlywiki'>
  | Icon<'js'>
  | Icon<'command'>
  | Icon<'image'>
  | Icon<'tag'>
  | Icon<'mermaid'>
  | Icon<'html'>
  | Icon<'tiddler'>
  | Icon<'image'>
  | Icon<'word'>
  | Icon<'snippet'>
  | Icon<'json'>
  | Icon<'plain'>
  | Icon<'svg'>
  | Icon<'gif'>
  | 'keyword';
