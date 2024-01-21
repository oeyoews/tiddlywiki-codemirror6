interface IOptions {
  widget: IWidget;
  value: any;
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
