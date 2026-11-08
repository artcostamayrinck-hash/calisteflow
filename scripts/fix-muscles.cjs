const fs = require('fs');
const path = require('path');

const files = [
  'src/data/exercises/pullHorizontal.ts',
  'src/data/exercises/pullVertical.ts',
  'src/data/exercises/pushHorizontal.ts',
  'src/data/exercises/pushVertical.ts'
];

for (const rel of files) {
  const full = path.join(__dirname, '..', rel);
  let c = fs.readFileSync(full, 'utf8');
  c = c.replace(/'core'/g, "'abdomen'");
  c = c.replace(/'trapezio'/g, "'costas'");
  fs.writeFileSync(full, c, 'utf8');
}
console.log('Fixed muscles in exercise datasets.');

