/*\
title: $:/plugins/oeyoews/tiddlywiki-table/widget.js
type: application/javascript
module-type: widget

book-status widget

\*/

const { widget: Widget } = require('$:/core/modules/widgets/widget.js');
class SpreadsheetWidget extends Widget {
  constructor(parseTreeNode, options) {
    super(parseTreeNode, options);
  }

  render(parent, nextSibling) {
    if (!$tw.browser) return;
    require('./xspreadsheet.js');
    this.execute();

    super.render(parent, nextSibling);

    const table = this.document.createElement('div');

    const s = x_spreadsheet(table)
      .loadData({}) // load data
      .change((data) => {
        // save data to db
      });

    // data validation
    s.validate();

    this.parentDomNode.insertBefore(table, nextSibling);
    this.domNodes.push(table, nextSibling);
  }
}

exports.sp = SpreadsheetWidget;
