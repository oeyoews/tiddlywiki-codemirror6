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

interface I18n {
  zh: string;
  en: string;
}
interface IConfigFields {
  icon: string;
  caption: I18n;
  description: I18n;
  template: 'input-switch' | 'input';
  text: string;
}
