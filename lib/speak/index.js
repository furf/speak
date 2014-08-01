#!/usr/bin/env node

var pkginfo = require('pkginfo')(module);
var spawn = require('child_process').spawn;
var path = require('path');
var colors = require('colors');
var cwd = process.cwd();
var commander = require('commander')
  .version(exports.version)
  .option('-v, --voice [name]', 'Use the specified voice [Alex]', 'Alex')
  .option('-p, --path [path]', 'Path to output file [' + cwd + ']', cwd)
  .option('-f, --filename [file]', 'Name of file (without extension)')
  .parse(process.argv);
var text = commander.args[0];

if (text) {
  speak(text, commander);
}

/**
 * Use OS X's native `say` application to output audio files of spoken text.
 * @param {!String} text Text to be spoken.
 * @param {Object=} options Configuration options to be passed to `say`
 *    - {String=} voice Name of OS X text-to-speech voice
 *    - {String=} path Path to outfile
 */
function speak(text, options) {

  var voice = options.voice;
  var filename = options.filename || normalize(text);
  var outfile = path.join(options.path, filename + '.aiff');
  var cmd = spawn('say', ['-v', voice, '-o', outfile, text]);

  cmd.stderr.on('data', function (data) {
    console.log('Error: %s'.red, data);
  });

  cmd.on('close', function (code) {
    if (!code) {
      console.log('Successfully created %s'.green, outfile);
    }
    process.exit(code);
  });
}

/**
 * Normalize text for use as a filename. Remove all non-word characters and
 * replace contiguous whitespace with a single underscore.
 * @param {!String} text Text to normalize.
 * @returns {String} Normalized text.
 */
function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '_').replace(/\W/g, '');
}
