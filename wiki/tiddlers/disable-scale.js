/*\
title:disable scale
type: application/javascript
module-type: startup

\*/
exports.name = 'scale';
exports.platforms = ['browser'];
exports.after = ['startup'];
exports.synchronous = true;
exports.startup = () => {
 


console.log('startup disable scale')
 // require('touch-emulator.js')()
		// console.log(emu, 'touchemulator')
window.onload = () => {
		console.log('onload')
  document.addEventListener('touchstart', (event) => {
		console.log('touchstart')
    if (event.touches.length > 1) {
       event.preventDefault();
    }
  });
  
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
}
	};