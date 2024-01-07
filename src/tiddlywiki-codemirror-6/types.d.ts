interface IWidget {
  editClass: string;
  editType: string;
}

interface IOptions {
  widget: IWidget;
  value: any;
  parentNode: any;
  nextSibling: any;
}
