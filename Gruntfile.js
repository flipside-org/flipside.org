module.exports = function(grunt) {
  grunt.initConfig({
    // https://github.com/gruntjs/grunt-contrib-clean
    clean : ['css/*', 'scripts/*', '_site/*'],
    
    // https://github.com/gruntjs/grunt-contrib-compass
    compass : {
      // Default options.
      options : {
          sassDir : 'src/sass',
          cssDir : 'css',
          require : ['zurb-foundation']
      },
      
      dev : {
        options : {
          environment: 'development',
          outputStyle: 'expanded',
          debugInfo : true
        }
      },
      prod : {
        options : {
          environment: 'production',
          outputStyle: 'compressed',
        }
      }
    },
        
    // https://github.com/gruntjs/grunt-contrib-jshint
    jshint: {
      // Default options.
      options : {
        unused : true
      },
      
      dev : {
        options : {
          force : true
        },
        src : ['src/js/*.js']
      },
      
      prod: ['src/js/*.js']
    },
    
    // https://github.com/gruntjs/grunt-contrib-uglify
    uglify: {
      prod: {
        files: {
          'scripts/flipside.min.js': ['src/js/*.js'],
          'scripts/modernizr.min.js': ['src/js/vendor/custom.modernizr.js'],
          
          'scripts/foundation.min.js': [
            'src/js/vendor/jquery.js',
            
            //'src/js/foundation/foundation.abide.js',
            'src/js/foundation/foundation.js',
            'src/js/foundation/foundation.clearing.js',
            'src/js/foundation/foundation.dropdown.js',
            'src/js/foundation/foundation.interchange.js',
            //'src/js/foundation/foundation.orbit.js',
            'src/js/foundation/foundation.reveal.js',
            'src/js/foundation/foundation.tooltips.js',
            //'src/js/foundation/foundation.alerts.js',
            'src/js/foundation/foundation.cookie.js',
            //'src/js/foundation/foundation.forms.js',
            //'src/js/foundation/foundation.joyride.js',
            //'src/js/foundation/foundation.magellan.js',
            //'src/js/foundation/foundation.placeholder.js',
            //'src/js/foundation/foundation.section.js',
            'src/js/foundation/foundation.topbar.js'
          ]
        }
      }
    },
    
    // https://npmjs.org/package/grunt-contrib-watch
    watch : {
      src: {
        files: ['src/js/*.js', 'src/sass/*.scss'],
        tasks: ['default']
      },
      jekyll : {
        files: ['**/*.html', '!_site/**/*'],
        tasks: ['jekyll:generate']
      }
    },
    
    // https://github.com/dannygarcia/grunt-jekyll
    jekyll : {
      generate : {
        options : {
          config: '_config.yml',
          src: '.',
          dest: './_site',
        }
      },
      server : {
        options : {
          config: '_config.yml',
          src: '.',
          dest: './_site',
          serve: true
        }
      }
    }
    
  });

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jekyll');
  
  // Register tasks.
  grunt.registerTask('default', ['compass:dev', 'jshint:dev', 'uglify', 'jekyll:generate']);
  
  grunt.registerTask('prod', ['clean', 'compass:prod', 'jshint:prod', 'uglify']);

};
