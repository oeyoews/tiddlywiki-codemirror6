export type IOperation = {
  length: number;
  type: IOperationType;
  cutStart: number;
  cutEnd: number;
  newSelStart: number;
  newSelEnd: number;
  replacement: string;
  [key: string]: any | undefined;
};

export const operationTypes = [
  'excise',
  'focus-editor',
  'insert-text',
  'make-link',
  'prefix-lines',
  'redo',
  'replace-all',
  'replace-selection',
  'save-selection',
  'search',
  'undo',
  'wrap-lines',
  'wrap-selection'
] as const;

export type IOperationType = (typeof operationTypes)[number];
