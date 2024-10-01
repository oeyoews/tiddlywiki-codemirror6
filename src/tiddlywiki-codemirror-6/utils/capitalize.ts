import cm6 from '../config';

// equal to $tw.utils.toTitleCase
export function capitalize(str: string) {
  return str.replace(/^\w/, (match) => match.toUpperCase());
}

export function useSound() {
  if (!cm6.useSound()) return;
  $tw.rootWidget.dispatchEvent({
    type: 'neotw-play-sound',
    paramObject: {
      audioTiddler: '$:/plugins/oeyoews/neotw-play-sound/sounds/bite.mp3'
    }
  });
}
