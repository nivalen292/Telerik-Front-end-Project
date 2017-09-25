const gulp = require('gulp');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const pump = require('pump');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const browserify = require('gulp-browserify');

gulp.task('compile:js', () => {
    return gulp.src(['./scripts/*.js',
         '!./scripts/bootstrap.min.js',
        '!./scripts/jquery-3.2.1.min.js',
        '!./scripts/sammy-latest.min.js',
        '!./scripts/handlebars-v4.0.10.js'])
        .pipe(babel({presets: ['env']}))
        .pipe(gulp.dest('./tmp/scripts'));
});

gulp.task('minify:css', () => {
    return gulp.src(['./styles/*.css', '!./styles/bootstrap.min.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('minify:js', ['compile:js'], () => {
    return pump([
        gulp.src('./tmp/scripts/*.js'),
        uglify(),
        gulp.dest('./dist/scripts')
    ]);
});

gulp.task('browserify:js', ['minify:js'], () => {
    return gulp.src('./dist/scripts/main.js')
        .pipe(browserify())
        .pipe(gulp.dest('./dist/scripts'));
});


gulp.task('build', ['minify:css', 'browserify:js'], () => {
});
