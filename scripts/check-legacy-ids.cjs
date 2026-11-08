const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (item !== 'node_modules' && item !== 'dist') files = files.concat(walk(full));
    } else if (full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.json')) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walk(path.join(__dirname, '../src'));
const ids = [
  'pushup', 'diamond_pushup', 'diamondpushup',
  'dips', 'dip', 'pullup', 'chinup',
  'australian_pullup', 'australianpullup',
  'pike_pushup', 'pikepushup',
  'handstand_hold', 'handstand',
  'squat', 'lunges', 'plank', 'lsit',
  'hollow_body', 'hollowbody',
  'muscleup', 'front_lever', 'frontlever',
  'planche_lean', 'planche',
  'pistol_squat', 'pistolsquat'
];

const found = {};
for (const f of allFiles) {
  const content = fs.readFileSync(f, 'utf8');
  for (const id of ids) {
    if (content.includes(`'${id}'`) || content.includes(`"${id}"`)) {
      if (!found[id]) found[id] = [];
      found[id].push(path.basename(f));
    }
  }
}
console.log(JSON.stringify(found, null, 2));

