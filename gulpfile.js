var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync').create();

gulp.task('browserify', function(){
	browserify('src/main.js')
    .bundle()
    .pipe(source('main.js'))
  	.pipe(gulp.dest('./dest'))
})
gulp.task('copy', function(){
	gulp.src('src/index.html')
		.pipe(gulp.dest('./dest'))
})
gulp.task('makeLib', function(){
	browserify('src/objects/ball.js')
    .bundle()
    .pipe(source('ball.js'))
  	.pipe(gulp.dest('./lib'))
})
// gulp.task('serve', ['browserify', 'copy'], function() {
//
//     browserSync.init({
//         server: "./dest"
//     });
//
//     gulp.watch('*', ['browserify', 'copy']).on('change', browserSync.reload);
// });
//
// gulp.task('default', ['serve']);
gulp.task('default', ['browserify', 'copy'], function(){
	gulp.watch('src/**/*', ['browserify', 'copy']);
	gulp.watch('src/objects/**/*', ['browserify', 'copy']);
	gulp.watch('src/utils/**/*', ['browserify', 'copy']);
})
