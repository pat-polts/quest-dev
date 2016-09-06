// =================================================================================
// LOAD AND RUN GRUNT TASKS (it'll be better with grunt load tasks and grunt config)
// =================================================================================

module.exports = function(grunt) {
 
  grunt.initConfig({
 
    pkg: grunt.file.readJSON('package.json'),

//---> Uglify: genarate javascript minified
    uglify: {
      options: { 
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'dist/js/global.min.js': 'dist/js/global.js'
        }
      },
    },

//---> Less: compiles less file to css
    less: {
      build: {
        files: {
          'src/styles/stylesheet.css': 'src/styles/stylesheet.less'
        }
      }
    },

//---> Cssmin: genarate css minified
    cssmin: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'dist/css/stylesheet.min.css': 'src/styles/stylesheet.css'
        }
      }
    },
    
//---> Wiredep: inject bower dependencies into index.html
    wiredep: {
      task: {
        src: ['views/index.html'],
        cwd: '.',
        options: {
          dependencies: true,
          devDependencies: true ,
          overrides: {  }
        }
      }
    },

//---> Concat: concatanate javascript files into global.js
    concat: { 
      dist: {
        src: ['src/js/main.js', 'src/js/services.js', 'src/js/directives.js', 'src/js/controllers.js'],
        dest: 'dist/js/global.js',
      }
    },

//---> Watch: watch for any changes in grunt tasks
    watch: {       
      files: ['src/styles/**/*.less','src/styles/stylesheet.less', 'src/styles/stylesheet.css'], 
      tasks: ['less','cssmin'],
      scripts: { 
        files: ['src/**/*.js', 'dist/js/global.js'], tasks: ['concat'] 
      } 
    }

  });

//---> Load grunt dependencies set at package.json
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

//---> register changes taskl: grunt changes to see what's have changed
  // grunt.registerTask('watch', ['watch']);

//---> Set wich tasks grunt should load when grunt is called  
  grunt.registerTask('default', ['cssmin', 'less','concat']);

};