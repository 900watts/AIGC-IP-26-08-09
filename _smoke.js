const fs = require('fs');
const path = require('path');
const dir = '.';
function check(name) {
  const src = fs.readFileSync(path.join(dir, name), 'utf8');
  if (name.endsWith('.js')) {
    try { new Function(src); console.log(name + ' OK (' + src.length + ' bytes)'); }
    catch (e) { console.error(name + ' SYNTAX: ' + e.message); process.exit(1); }
  } else {
    console.log(name + ' OK (' + src.length + ' bytes)');
  }
}
['index.html', 'styles.css', 'app.js', 'PROMPTS.md', 'DESIGN.md', 'README.md', 'PLAN.md'].forEach(check);

// Tag balance for HTML
const html = fs.readFileSync('index.html', 'utf8');
function count(re) { return (html.match(re) || []).length; }
console.log('section  open=' + count(/<section\b/g) + ' close=' + count(/<\/section>/g));
console.log('div      open=' + count(/<div\b/g) + ' close=' + count(/<\/div>/g));
console.log('button   open=' + count(/<button\b/g) + ' close=' + count(/<\/button>/g));
console.log('img tags=' + count(/<img\b/g));

// Reference balance in app.js
const js = fs.readFileSync('app.js', 'utf8');
const refs = ['scene-1.png','scene-2.png','scene-3.png','scene-4.png','scene-5.png','guanzai-sprite.png','og-card-bg.png'];
refs.forEach(r => {
  const inJs = js.includes(r) ? 1 : 0;
  const inHtml = html.includes(r) ? 1 : 0;
  console.log(r + '  js:' + inJs + ' html:' + inHtml);
});
