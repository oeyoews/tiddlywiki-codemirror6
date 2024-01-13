import { Widget } from 'tiddlywiki';

export interface IWidget extends Widget {
  handleKeydownEvent: (e: KeyboardEvent) => boolean;
  handlePasteEvent: (event: Event) => boolean;
  editPlaceholder: string;
  editCancelPopups: boolean;
  editTabIndex: string;
  editTitle: string;
  editClass: string;
  editType: string;
  isFileDropEnabled: boolean;
  saveChanges: (text: string) => void;
  keyInfoArray: any[];
}

export interface IOptions {
  widget: IWidget;
  value: any;
  /** tiddler type */
  type: string;
  parentNode: any;
  nextSibling: any;
}

export type ISource = {
  vanillaTitle?: string;
  title: string;
  text: string;
  desc?: string;
  caption?: string;
};

// 假设你正在使用 window 对象的某个属性，比如 document
export declare global {
  interface Window {
    document: Document;
    // 在这里添加你需要使用的其他属性
  }
}
