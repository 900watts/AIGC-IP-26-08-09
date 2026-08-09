const fs = require('fs');
const path = require('path');
function check(name) {
  const src = fs.readFileSync(name, 'utf8');
  if (name.endsWith('.js')) {
    try { new Function(src); console.log(name + ' OK (' + src.length + ' bytes)'); }
    catch (e) { console.error(name + ' SYNTAX: ' + e.message); process.exit(1); }
  } else {
    console.log(name + ' OK (' + src.length + ' bytes)');
  }
}
['index.html', 'styles.css', 'app.js'].forEach(check);

const html = fs.readFileSync('index.html', 'utf8');
function count(re) { return (html.match(re) || []).length; }
console.log('section  open=' + count(/<section\b/g) + ' close=' + count(/<\/section>/g));
console.log('button   open=' + count(/<button\b/g) + ' close=' + count(/<\/button>/g));
console.log('img tags=' + count(/<img\b/g));

// Asset refs
const js = fs.readFileSync('app.js', 'utf8');
const refs = ['scene-1.png','scene-2.png','scene-3.png','scene-4.png','scene-5.png','mascot-wave.png','mascot-idle.png','mascot-blink.png','og-card-bg.png'];
refs.forEach(r => {
  console.log(r + '  js:' + (js.includes(r)?1:0) + ' html:' + (html.includes(r)?1:0));
});