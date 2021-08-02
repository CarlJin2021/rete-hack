const { exec, spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function log(msg) {
  console.log(`deploy: ${msg}`);
}

log('update node_modules');
let installCMD = exec(`npm install`, { cwd: path.resolve(__dirname, '../') });
installCMD.stdout.pipe(process.stdout);
installCMD.stderr.pipe(process.stderr);
installCMD.on('exit', function () {
  //  replace rete.esm.js
  log('replace ete.esm.js');
  let targetFile = path.resolve(__dirname, '../', 'node_modules/rete/build/rete.esm.js');
  let sourceFile = path.resolve(__dirname, './rete.esm.js');
  fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));

  log('npm run build');
  let buildCMD = exec(`npm run build:no-cache`, { cwd: path.resolve(__dirname, '../') });
  buildCMD.stdout.pipe(process.stdout);
  buildCMD.stderr.pipe(process.stderr);
  buildCMD.on('exit', function () {
    log('start deploy');
    process.exit();
  });
});
