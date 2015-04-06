#!/usr/bin/env node
var colors  = require('colors');
var program = require('commander');
var logger  = require('../lib/logger');
var version = require('../package.json').version;
var user    = require('../lib/user');

program.version(version);

// helper function to load a command
function loadCommand(cmd) {
  require('../commands/' + cmd).cli(program);
}

// load up the individual commands
loadCommand('init');
loadCommand('config');
loadCommand('config-set');
loadCommand('logins');
loadCommand('login');
loadCommand('logout');
// loadCommand('open');
loadCommand('identity');
// loadCommand('index');
// loadCommand('create');
// loadCommand('deploy');
// loadCommand('retrieve');
// loadCommand('anon');
// loadCommand('resources');
// loadCommand('get');

// bootstraps any necessary config items
user.bootstrap().then(function(){
  // starts the program
  program.parse(process.argv);

  if (process.argv.length < 3) {
    // show help by default
    program.parse([process.argv[0], process.argv[1], '-h']);
    logger.error('incorrect number of arguments');
    process.exit(0);
  } else {
    //warn aboud invalid commands
    var c = process.argv[2];

    var validCommands = program.commands.map(function(cmd){
      return cmd._name;
    });

    if(validCommands.indexOf(c) === -1) {
      logger.error('Invalid command: \'' + c + '\'');
      program.help();
      process.exit(1);
    }
  }
}).catch(function(err) {
  console.error(err.stack);
  logger.error('Unable to bootstrap necessary directories');
  logger.error(err.message);
  process.exit(1);
});
