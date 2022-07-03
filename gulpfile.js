"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var compressor = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");
var server = require("browser-sync").create();
var sass = require('gulp-sass')(require('sass'));

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on('error', function (error) {
      console.log(error);
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("docs/css"));
});

gulp.task("js", function () {
  return gulp.src("source/js/*.js")
    .pipe(compressor())
    .pipe(rename(function (path) {
      path.basename += ".min";
    }))
    .pipe(gulp.dest("docs/js"));
});


gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([include()]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("docs"));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/*.svg")
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("docs/img"));
});

// gulp.task("webp", function () {
//   return gulp.src("source/img/**/*.{png,jpg}")
//     .pipe(webp({ quality: 90 }))
//     .pipe(gulp.dest("source/img"));
// });

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/css/normalize.css"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("docs"));
});

gulp.task("clean", function () {
  return del("docs");
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: "docs/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  gulp.watch("source/img/*.{png,jpg,jpeg,svg}", gulp.series("refresh"));
  gulp.watch("source/js/*.js", gulp.series("js", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("build", gulp.series("clean", "css", "copy", "html", "js"));
gulp.task("start", gulp.series("build", "server"));
