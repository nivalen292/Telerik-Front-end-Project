const gulp = require('gulp');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const pump = require('pump');
const concat = require('gulp-concat');
const clean = require('gulp-clean');

gulp.task('compile:js', () => {
    return gulp.src(['./scripts/*.js', '!./scripts/bootstrap.min.js', '!./scripts/jquery.min.js'])
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
        concat('all.js'), // trial
        gulp.dest('./dist/scripts')
    ]);
});
