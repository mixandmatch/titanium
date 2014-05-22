//based on http://culttt.com/2013/11/18/setting-sass-grunt/

'use strict';

/**
 * Grunt Module
 */
module.exports = function (grunt) {
	grunt.initConfig({
		/**
		 * Get package meta data
		 */
		pkg: grunt.file.readJSON('package.json') ,
		/**
		 * Set project object
		 */
		project: {
			app: 'app' ,
			assets: '<%= project.app %>/assets' ,
			css: ['<%= project.assets %>/default.scss']
		} ,
		/**
		 * Project banner
		 */
		tag: {
			banner: '/*!\n' + ' * <%= pkg.name %>\n' + ' * <%= pkg.title %>\n' + ' * <%= pkg.url %>\n' + ' * @author <%= pkg.author %>\n' + ' * @version <%= pkg.version %>\n' + ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' + ' */\n'
		} ,
		/**
		 * Sass
		 */
		sass: {
			dev: {
				options: {
					style: 'expanded' ,
					banner: '<%= tag.banner %>' ,
					compass: true
				} ,
				files: {
					'<%= project.assets %>/default.css': '<%= project.css %>'
				}
			}
		} ,
		/**
		 * Watch
		 */
		watch: {
			sass: {
				files: '<%= project.assets %>{,*/}*.{scss,sass}' ,
				tasks: ['sass:dev']
			}
		}
	});

	/**
	 * Load Grunt plugins
	 */
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	/**
	 * Default task
	 * Run `grunt` on the command line
	 */
	grunt.registerTask('default' , ['sass:dev' , 'watch']);
};
