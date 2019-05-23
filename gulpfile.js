var gulp = require('gulp'),
  notifier = require('node-notifier'),
  gutil = require('gulp-util'),
  plugins = require('gulp-load-plugins')({
    rename: {
      'gulp-plumber': 'plumber',
      'gulp-sass': 'sass',
      'gulp-strip-json-comments': 'strip_comments',
      'gulp-rename': 'rename',
      'gulp-concat': 'concat',
      'gulp-uglify': 'uglify',
      'gulp-nunjucks-render': 'nunjucksRender',
      'gulp-live-server': 'serve'
    }
  });


//style paths

const src = {
  nunjucks: './src/pages/*.+(html|nunjucks)',
  sass: './src/styles/sass/**/*.scss',
  assets: './src/images/**/*',
  js: './src/scripts/**/*.js'
};

const dest = './build/';

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['pack-js', 'pack-styles', 'copy', 'nunjucks']);
gulp.task('server', ['build', 'serve', 'watch']);


gulp.task('nunjucks', function() {
  return gulp.src(src.nunjucks)
  .pipe(plugins.plumber())
  .pipe(plugins.nunjucksRender({path: ['./src/templates']}))
  .on('error', function(err) {
    notifier.notify({title: 'Nunjucks Compiling Error!', message: err.message, sound: true});

    gutil.log(err);
    this.emit('end');
   })

  .pipe(gulp.dest(dest)).on('error', function(err) {
    notifier.notify({title: 'Styles Packing Error!', message:  err.message, sound: true});
    gutil.log(error);
  })
});

gulp.task('pack-styles', function() {
  gulp.src(src.sass)
    .pipe(plugins.plumber())
    .pipe(plugins.sass({outputStyle: 'compressed'}))
    .on('error', function(err) {
      notifier.notify({title: 'SASS Compiling Error!', message: err.message, sound: true});

      gutil.log(err);
      this.emit('end');
    })
    .pipe(plugins.rename('bundle.all.css'))
    .pipe(plugins.strip_comments())
    .pipe(gulp.dest(dest)).on('error', function(err) {
      notifier.notify({title: 'Styles Packing Error!', message:  err.message, sound: true});
      gutil.log(error);
    })
    .pipe(plugins.livereload());
});

gulp.task('pack-js', function() {
  gulp.src(src.js)
    .pipe(plugins.plumber())
    .pipe(plugins.concat('bundle.all.js'))
    .pipe(plugins.uglify())
    .on('error', function(err) {
      notifier.notify({title: 'JS Compression Error!', message: err.message, sound: true});

      gutil.log(err);
      this.emit('end');
    })
    .pipe(gulp.dest(dest));
});

gulp.task('copy', function() {
  gulp.src([src.assets], { base: './src/' })
    .pipe(gulp.dest(dest));
});

gulp.task('watch', function() {
  plugins.livereload.listen();
  gulp.watch(src.sass, ['pack-styles']);
  gulp.watch(src.js, ['pack-js']);
  gulp.watch(src.assets, ['copy']);
  gulp.watch(['./src/templates/**/*.+(html|nunjucks)', src.nunjucks], ['nunjucks']);
});


// Folder "./build/" serving at http://localhost:8888
gulp.task('serve', function () {
    var server = plugins.serve.static(dest, 8888);
    server.start();
    gulp.watch([dest + '/*'], function (file) {
        server.notify.apply(server, [file]);
    });
});
