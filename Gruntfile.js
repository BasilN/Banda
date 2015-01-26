//Gruntfile.js

module.exports = function(grunt){
  //Configure Grunt
  grunt.initConfig({
    //Getting config info from package file
    pkg: grunt.file.readJSON('package.json'),

    //Configure jshint to validate js files ------------------------------------
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },

      // when this task is run, lint the Gruntfile and all js files in src
      build: ['Gruntfile.js', 'app/**/*.js', 'config/**/*.js' ]
    }


  });
  grunt.registerTask('default', ['jshint']);
  //Load Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
