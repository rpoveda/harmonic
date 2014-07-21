var localconfig = require('../config'),
    program = require('commander'),
    logo = require('../cli/logo');

program
    .version(localconfig.version)
    .option('-w, --watch', 'Watch files and rerun your website');

program
    .command('init')
    .description('Init your static website')
    .action(function(path) {
        var util = require('../cli/util');
        console.log(logo);
        util.init(typeof path === 'string' ? path : './');
    });

program
    .command('config')
    .description('Config your static website')
    .action(function() {
        var util = require('../cli/util');
        console.log(logo);
        util.config();
    });

program
    .command('build')
    .description('Build your static website')
    .action(function() {
        var core = require('../core');
        core.init();
    });

program
    .command('new_post ["title"]')
    .description('Create a new post')
    .action(function(title) {
        var util = require('../cli/util');
        util.new_post(title).then(function(data) {
            console.log(data);
        });
    });

program
    .command('run [port]')
    .description('Run you static site locally. Port is optional')
    .action(function(_port, options) {
        var watch = program.watch || false;
        var util = require('../cli/util');
        var port = _port ? _port : '9356';
        var core = require('../core');

        if (watch) {
            util.watch();
        }
        core.init().then(function() {
            util.run(port);
        });
    });

program.parse(process.argv);

// Not enough arguments
if (!program.args.length) {
    console.log(logo);
    program.help();
}
