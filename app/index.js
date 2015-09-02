'use strict';

var generators = require('yeoman-generator'),
    _ = require('lodash'),
    exec = require('child_process').exec,
    path = require('path');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

    this.on('end', function () {
      this.installDependencies({
        bower: false,
        npm: true
      });
    });

  },
  prompting: function () {
    var done = this.async();

    var prompts = [
      {
        name: 'name',
        message: 'What is the name of this project?',
        default: (this.appname) ? this.appname : 'myStylize'
      },
      {
        name: 'description',
        message: 'What is the description of your project?',
      },
      {
        type: 'list',
        name: 'compiler',
        message: 'Choose a pattern compiler.',
        default: {
          name: 'Handlebars',
          value: 'stylize-handlebars',
        },
        choices: [
          {
            name: 'Handlebars',
            value: 'stylize-handlebars',
          },
          {
            name: 'Mustache',
            value: 'stylize-mustache',
          },
        ],
      },
      {
        type: 'confirm',
        name: 'defaultPatterns',
        message: 'Would you like to install the base patterns?',
        default: 1
      },
    ];

    this.prompt(prompts, function (answers) {

      // set prompts to this object
      var self = this;
      _.forIn(answers, function(value, key) {
        self[key] = value;
      });

      done();
    }.bind(this));
  },
  copyPatterns: function () {
    var done = this.async();

    if (!this.defaultPatterns) { return; }
    this.remote('Josh-Miller', 'stylize-data', 'master', function(err, remote) {
      remote.directory('.', '');
      done();
    });
  },
  createConfig: function() {
    if (!this.defaultPatterns) {
      this.template('_configPlain.yml', 'config.yml');
    } else {
      this.copy('config.yml');
    }
  },
  packagejson: function () {
    if (this.verbose) {
      this.log.info('Configuring package.json');
    }

    var filepath = path.join(this.destinationRoot(), 'package.json');

    var pkg = {};

    pkg.name = _.kebabCase(this.appname);
    pkg.version = '0.0.0';
    pkg.description = this.description;
    pkg.dependencies = {};
    pkg.dependencies[this.compiler] = "^0.0.0";

    this.writeFileFromString(JSON.stringify(pkg, null, 2), filepath);
  }
});
