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
  parentNode: any;
  nextSibling: any;
}

export type ISource = {
  title: string;
  text: string;
  desc?: string;
  captions?: string;
};
