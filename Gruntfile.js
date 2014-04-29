module.exports = function(grunt) {

  require('load-grunt-config')(grunt, {
    config: {
      info: grunt.file.readJSON('package.json'),
      name: 'node-rdio'
    }
  });

};
