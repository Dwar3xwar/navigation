﻿var browserify = require('browserify');
var shim = require('browserify-shim');
var gulp = require('gulp');
var concat = require('gulp-concat');
var derequire = require('gulp-derequire');
var header = require('gulp-header');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var typescript = require('gulp-tsc');
var uglify = require('gulp-uglify');

var tests = [
	{ name: 'NavigationRouting', to: 'navigationRouting.test.js' },
	{ name: 'StateInfo', to: 'stateInfo.test.js' },
	{ name: 'Navigation', to: 'navigation.test.js' },
	{ name: 'NavigationData', to: 'navigationData.test.js' }
];
var testTasks = [];
function testTask(file, to) {
	return browserify(file)
		.plugin('tsify')
		.bundle()
		.pipe(source(to))
		.pipe(rename(to))
		.pipe(gulp.dest('./build/dist'))
        .pipe(mocha());
}
for (var i = 0; i < tests.length; i++) {
	(function (test) {
		gulp.task('Test' + test.name, function () {
			return testTask('./NavigationJS/test/' + test.name + 'Test.ts', test.to)
		});
	})(tests[i]);
	testTasks.push('Test' + tests[i].name);
}
gulp.task('test', testTasks);

var items = [
	require('./build/npm/navigation/package.json'),
	require('./build/npm/navigation-react/package.json'),
	require('./build/npm/navigation-knockout/package.json'),
	require('./build/npm/navigation-angular/package.json')
];
var buildTasks = [];
var packageTasks = [];
var info = ['/**',
  ' * Navigation v<%= details.version %>',
  ' * (c) Graham Mendick - <%= details.homepage %>',
  ' * License: <%= details.license %>',
  ' */',
  ''].join('\r\n');
function buildTask(name, file, to, details) {
	return browserify(file, { standalone: name })
		.plugin('tsify')
		.transform(shim)
		.bundle()
		.pipe(source(to))
		.pipe(rename(to))
		.pipe(derequire())
		.pipe(header(info, { details : details } ))
		.pipe(gulp.dest('./build/dist'))
		.pipe(rename(to.replace(/js$/, 'min.js')))
		.pipe(streamify(uglify()))
		.pipe(header(info, { details : details } ))
		.pipe(gulp.dest('./build/dist'));
}
function packageTask(name, file) {
	return gulp.src(file)
		.pipe(typescript())
		.pipe(gulp.dest('./build/lib/' + name));
}
for (var i = 0; i < items.length; i++) {
	var name = items[i].name
				.replace(/\b./g, function(val){ return val.toUpperCase(); })
				.replace('-', '');
	var tsFrom = './' + name + (name.length == 10 ? 'JS' : '') + '/src/' + name + '.ts';
	var jsTo = items[i].name.replace('-', '.') + '.js';
	(function (name, tsFrom, jsTo, item) {
		gulp.task('Build' + name, function () {
			return buildTask(name, tsFrom, jsTo, item);
		});
		gulp.task('Package' + name, function () {
			return packageTask(name, tsFrom);
		});
	})(name, tsFrom, jsTo, items[i]);
	buildTasks.push('Build' + name);
	packageTasks.push('Package' + name);
}
gulp.task('build', buildTasks);
gulp.task('package', packageTasks);
