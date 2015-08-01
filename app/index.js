'use strict';

var generators = require('yeoman-generator'),
    _ = require('lodash');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

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
  // packagejson: function () {
  //   if (this.verbose) {
  //     this.log.info('Configuring package.json');
  //   }

  //   var filepath = path.join(this.destinationRoot(), 'package.json');
  //   var pkg = JSON.parse(this.readFileAsString(filepath));

  //   pkg.name = (this.prompts.siteName || 'replace me')
  //     .replace(/[^0-9a-z_\-]/ig, '-')
  //     .replace(/-+/g, '-');
  //   pkg.version = '0.0.0';
  //   pkg.description = this.prompts.siteDescription;
  //   pkg.homepage = this.prompts.siteUrl;
  //   pkg.main = 'app/index.html';

  //   delete pkg.devDependencies['apache-server-configs'];
  //   this.writeFileFromString(JSON.stringify(pkg, null, 2), filepath);
  // },
});
