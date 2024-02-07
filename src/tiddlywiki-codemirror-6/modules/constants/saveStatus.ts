export const statusTiddler = '$:/config/oeyoews/codemirror6/status/save';

export function updateSaveStatus(status: boolean) {
  $tw.wiki.setText(statusTiddler, 'text', '', status ? 'yes' : 'no');
}
