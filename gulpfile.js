const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const cssnano = require('cssnano');
const del = require('del');
const gulp = require('gulp');
const changed = require('gulp-changed');
const gulpIf = require('gulp-if');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const svgSprite = require('gulp-svg-sprite');
const uglify = require('gulp-uglify');

const production = process.env.NODE_ENV === 'production';

function clean() {
  return del('dist');
}

function views() {
  return gulp.src('src/pages/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest('dist'));
}

function styles() {
  return gulp.src('src/styles/*.scss')
    .pipe(plumber())
    .pipe(gulpIf(!production, sourcemaps.init()))
    .pipe(sass())
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(gulpIf(!production, sourcemaps.write()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/assets/css/'));
}

function scripts() {
  return gulp.src('src/scripts/*.js')
    .pipe(plumber())
    .pipe(gulpIf(!production, sourcemaps.init()))
    .pipe(uglify())
    .pipe(gulpIf(!production, sourcemaps.write()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/assets/js/'));
}

function images() {
  return gulp.src('src/images/**/*')
    .pipe(plumber())
    .pipe(changed('dist/assets/img'))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/img'));
}

function icons() {
  return gulp.src('src/icons/*.svg')
    .pipe(plumber())  
    .pipe(svgSprite({
      mode: {
        symbol: {
          dest: '',
          sprite: 'sprite.svg'
        }
      }
    }))
    .pipe(gulp.dest('dist/assets/img/'));
}

function static() {
  return gulp.src('src/static/**/*')
    .pipe(gulp.dest('dist/assets'));
}

function serve() {
  browserSync({server: './dist'});
  gulp.watch('src/**/*.pug', gulp.series(views, reload));
  gulp.watch('src/**/*.scss', gulp.series(styles, reload));
  gulp.watch('src/**/*.js', gulp.series(scripts, reload));
  gulp.watch('src/images/**/*', gulp.series(images, reload));
  gulp.watch('src/icons/*.svg', gulp.series(icons, reload));
  gulp.watch('src/static/**/*', gulp.series(static, reload));
}

function reload(done) {
  browserSync.reload();
  done();
}

const build = gulp.series(clean, gulp.parallel(views, styles, scripts, images, icons, static));

exports.build = build;
exports.default = gulp.series(build, serve);
