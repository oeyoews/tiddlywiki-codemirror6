import { initCursor } from 'ipad-cursor';

exports.name = 'type-startup-hook';
exports.platforms = ['browser'];
exports.after = ['startup'];
exports.synchronous = true;
exports.startup = () => {
  initCursor();
};
