const gulp = require('gulp');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const pump = require('pump');

gulp.task('compile:js', () => {
    return gulp.src(['./scripts/*.js', '!./scripts/bootstrap.min.js'])
        .pipe(babel({presets: ['env']}))
        .pipe(gulp.dest('./tmp/scripts'));
});

gulp.task('minify:css', () => {
    return gulp.src(['./styles/*.css', '!./styles/bootstrap.min.css'])
        .pipe(cleanCSS(cleanCSS({compatibility: 'ie8'})))
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('minify:js', ['compile:js'] ,() => {
    return pump([
        gulp.src('./tmp/scripts/*.js'),
        uglify(),
        gulp.dest('./dist/scripts')
    ]);
});


gulp.task('build:js', ['minify:js'], () => {
    return gulp.src(['./dist/scripts/neshto.js', './dist/scripts/neshto2.js'])
        .pipe(cleanCSS(cleanCSS({compatibility: 'ie8'})))
        .pipe(gulp.dest('./dist/styles'));
});