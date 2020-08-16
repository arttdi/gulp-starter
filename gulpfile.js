const { src, dest, parallel, series, watch } = require('gulp')
const concat = require('gulp-concat')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify-es').default
const newer = require('gulp-newer')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const svgstore = require('gulp-svgstore')
const browserSync = require('browser-sync').create()
const del = require('del')

function html() {
  return src('source/**/*.html')
  .pipe(dest('build'))
}

function styles() {
  return src('source/sass/style.scss')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(concat('style.min.css'))
  .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
  .pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
  .pipe(sourcemaps.write('.'))
  .pipe(dest('build/css'))
  .pipe(browserSync.stream())
}

function scripts() {
  return src('source/js/**/*.js')
  .pipe(plumber())
  .pipe(concat('script.min.js'))
  .pipe(uglify())
  .pipe(dest('build/js'))
  .pipe(browserSync.stream())
}

function fonts() {
  return src('source/fonts/**/*')
  .pipe(dest('build/fonts'))
}

function images() {
  return src(['source/img/src/**/*.{gif,png,jpg,svg,webp}', '!source/img/src/sprite/*'])
  .pipe(newer('source/img/dest'))
  .pipe(imagemin([
    imagemin.gifsicle({ interlaced: true }),
    imagemin.mozjpeg({ progressive: true }),
    imagemin.optipng({ optimizationLevel: 3 }),
    imagemin.svgo()
  ]))
  .pipe(dest('source/img/dest'))
}

function copyimages() {
  return src('source/img/dest/**/*')
  .pipe(dest('build/img'))
}

function formatwebp() {
  return src('source/img/src/**/*.{gif,png,jpg}')
  .pipe(newer('source/img/dest'))
  .pipe(webp({ quality: 50 }))
  .pipe(dest('source/img/dest'))
}

function svgSprite() {
  return src('source/img/src/sprite/**/*.svg')
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(concat('sprite.svg'))
  .pipe(dest('source/img/dest'))
}

function cleanbuild() {
  return del('build/**/*')
}

function serve() {
  browserSync.init({
    server: { baseDir: 'build' },
    notify: false,
    online: true,
  })

  watch('source/sass/**/*.scss', styles)
  watch('source/js/**/*.js', scripts)
  watch('source/**/*.html', html).on('change', browserSync.reload)
  watch('source/img/src/**/*', series(parallel(images, formatwebp, svgSprite), copyimages))
}

const dev = parallel(html, styles, scripts, fonts, images, formatwebp, svgSprite)
const build = series(cleanbuild, dev, copyimages)

exports.build = build
exports.start = series(build, serve)
