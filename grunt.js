module.exports = function(grunt) {

	var ROOT = 'www';
	var CSS = ROOT + '/stylesheets';
	var JS = ROOT + '/javascripts';
	var JSBIN = JS + '/generated';
	var CSSBIN = CSS + '/generated';

	// Project configuration.
	grunt.initConfig({

		// JS linting
		lint: {
			src: [
				JS + '/app/**/*.js'
			]
		},

		// JS beautifier options
		beautifier: {
			options: {
				indentSize: 1,
				indentChar: '\t',
				spaceAfterAnonFunction: false
			}
		},

		// JS beautifier
		beautify: {
			files: '<config:lint.src>'
		},

		// CSS minconcat
		cssmin: {
			app: {
				src: [
					CSS + '/reset.css',
					CSS + '/app/app.css',
					CSS + '/app/print.css'
				],
				dest: CSSBIN + '/app.min.css'
			}
		},

		// Copy files for QUnit testing
		copy: {
			qunit: {
				options: {
					basePath: JS
				},
				files: {
					'test/app': [
						JS + '/generated/app.min.js',
						JS + '/lib/jquery-1.7.2.min.js',
						JS + '/lib/backbone.min.js',
						JS + '/lib/underscore.min.js'
					]
				}
			}
		},

		// Run QUnit test via PhantomJS
		qunit: {
			all: ['test/**/*.html']
		},

		// Generate YUIDocs
		yuidoc: {
			compile: {
				options: {
					paths: JS + '/app/',
					outdir: 'docs',
					project: {
						logo: '../templates/logo.png'
					}
				}
			}
		},

		requirejs: {

			global: {
				options: {
					name: 'app/global/config',
					baseUrl: JS,
					mainConfigFile: JS + '/app/global/config.js',
					// Exclusions from minconcat use empty:
					paths: {
						'jquery': 'empty:',
						'underscore': 'empty:',
						'backbone': 'empty:'
					},
					has: {
						'useMinAssets': true
					},
					out: JSBIN + '/app.global.min.js'
				}
			},

			home: {
				options: {
					name: 'app/sections/home/config',
					baseUrl: JS,
					mainConfigFile: JS + '/app/sections/home/config.js',
					// Exclusions from minconcat use empty:
					paths: {
						'jquery': 'empty:',
						'underscore': 'empty:',
						'backbone': 'empty:',
						'global': 'empty:'
					},
					has: {
						'useMinAssets': true
					},
					out: JSBIN + '/app.home.min.js'
				}
			}

		},

		jslint: {
			files: ['source/javascripts/**'],
			exclude: ['**/ignore-*.js'],
			directives: { // example directives
				browser: true,
				unparam: true,
				todo: true,
				predef: [ // array of pre-defined globals
				'jQuery']
			},
			options: {
				junit: 'docs/jslint/junit.xml',
				// write the output to a JUnit XML
				log: 'docs/jslint/lint.log',
				jslintXml: 'docs/jslint/jslint_xml.xml',
				errorsOnly: true // only display errors
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'cssmin requirejs');
	grunt.registerTask('docs', 'yuidoc');

	// load grunt plugins
	grunt.loadNpmTasks('grunt-beautify');
	grunt.loadNpmTasks('grunt-crusher');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-css');
	grunt.loadNpmTasks('grunt-jslint');

};
