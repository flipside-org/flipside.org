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
          raw : 'add_import_path "src/vendor/foundation/scss"'
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
          'scripts/modernizr.min.js': ['src/vendor/modernizr/modernizr.js'],
          
          'scripts/foundation.min.js': [
            'src/vendor/jquery/jquery.js',
            
            //'src/vendor/foundation/js/foundation/foundation.abide.js',
            //'src/vendor/foundation/js/foundation/foundation.accordion.js',
            'src/vendor/foundation/js/foundation/foundation.clearing.js',
            'src/vendor/foundation/js/foundation/foundation.dropdown.js',
            'src/vendor/foundation/js/foundation/foundation.interchange.js',
            //'src/vendor/foundation/js/foundation/foundation.joyride.js',
            'src/vendor/foundation/js/foundation/foundation.js',
            //'src/vendor/foundation/js/foundation/foundation.magellan.js',
            //'src/vendor/foundation/js/foundation/foundation.offcanvas.js',
            //'src/vendor/foundation/js/foundation/foundation.orbit.js',
            //'src/vendor/foundation/js/foundation/foundation.reveal.js',
            //'src/vendor/foundation/js/foundation/foundation.tab.js',
            //'src/vendor/foundation/js/foundation/foundation.tooltips.js',
            //'src/vendor/foundation/js/foundation/foundation.topbar.js'
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
        files: ['**/*.html', '**/*.json', '!_site/**/*', '**/**/*.md'],
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
