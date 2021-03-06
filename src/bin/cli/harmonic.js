// Polyfills required by 6to5 -- https://github.com/es6rocks/harmonic/pull/104#issuecomment-70750159
require('core-js/shim');
require('regenerator/runtime');

var program = require('commander');

import { version } from '../config';
import { cliColor } from '../helpers';
import logo from './logo';
import { init, config, newFile, run } from './util';

program
    .version(version);

program
    .command('init [path]')
    .description('Init your static website')
     // [BUG] https://github.com/jshint/jshint/issues/1849 - can't use arrow function
    .action(function(path = '.') {
        console.log(logo);
        init(path);
    });

program
    .command('config [path]')
    .description('Config your static website')
     // [BUG] https://github.com/jshint/jshint/issues/1849 - can't use arrow function
    .action(function(path = '.') {
        console.log(logo);
        config(path);
    });

program
    .command('build [path]')
    .description('Build your static website')
    // [BUG] https://github.com/jshint/jshint/issues/1849 - can't use arrow function
    .action(function(path = '.') {
        let core = require('../core');
        core.init(path);
    });

program
    .command('new_post <title> [path]')
    .option('--no-open', 'Don\'t open the markdown file(s) in editor')
    .description('Create a new post')
    // [BUG] https://github.com/jshint/jshint/issues/1849 - can't use arrow function
    // [BUG] https://github.com/jshint/jshint/issues/1779#issuecomment-68985429
    .action(function(title, path = '.', { open: autoOpen }) { // jshint ignore:line
        newFile(path, 'post', title, autoOpen);
    });

program
    .command('new_page <title> [path]')
    .option('--no-open', 'Don\'t open the markdown file(s) in editor')
    .description('Create a new page')
    // [BUG] https://github.com/jshint/jshint/issues/1849 - can't use arrow function
    // [BUG] https://github.com/jshint/jshint/issues/1779#issuecomment-68985429
    .action(function(title, path = '.', { open: autoOpen }) { // jshint ignore:line
        newFile(path, 'page', title, autoOpen);
    });

program
    .command('run [port] [path]')
    .option('--no-open', 'Don\'t open a new browser window')
    .description('Run you static site locally. Port is optional')
     // [BUG] https://github.com/jshint/jshint/issues/1849 - can't use arrow function
     // [BUG] https://github.com/jshint/jshint/issues/1779#issuecomment-68985429
    .action(function(port = 9356, path = '.', { open: autoOpen }) { // jshint ignore:line
        let core = require('../core'),
            build = core.init(path);
        if (build) {
            build.then(function() {
                run(path, port, autoOpen);
            });
        }
    });

program.on('*', (args) => {
    let clc = cliColor();
    console.error('Unknown command: ' + clc.error(args[0]));
    process.exit(1);
});

program.parse(process.argv);

// Not enough arguments
if (!program.args.length) {
    console.log(logo);
    program.help();
}
