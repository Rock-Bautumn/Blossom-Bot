import mergeImages from 'merge-images';

mergeImages(['body.png', 'eyes.png', 'mouth.png'])
  .then(b64 => document.querySelector('img').src = b64);
