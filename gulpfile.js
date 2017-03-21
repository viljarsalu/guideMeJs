var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var concat      = require('gulp-concat');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');

var reload      = browserSync.reload;

// Watch scss AND html files, doing different things with each.
gulp.task('serve',['js','sass','html', 'copyfonts'], function () {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch("app/**/*.js", ['js']);
    gulp.watch("app/sass/**/*.scss", ['sass']);
    gulp.watch("app/*.html",['html']);
    //gulp.watch("app/*.html").on('change', browserSync.reload);
});

gulp.task('js', function(){
    gulp.src([
        //'bower_components/jquery/dist/jquery.min.js',
        'app/js/guideMeJs.js',
        'app/js/app.js'
      ])
    //gulp.src(['app/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    //.pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function() {
    return gulp.src("app/sass/app.scss")
        .pipe(sass())
        .pipe(concat('app.css'))
        .pipe(gulp.dest("dist/css/"))
        .pipe(browserSync.stream());
});

gulp.task('html', function(){
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream());
});

/*gulp.task('fonts', function(){
    return gulp.src('app/weather-icons/fonts/*')
        .pipe(gulp.dest('dist/fonts'));
});*/

gulp.task('copyfonts', function() {
   gulp.src('./app/assets/fonts/**/*.{eot,svg,ttf,woff,eof}')
   .pipe(gulp.dest('./dist/assets/fonts'));
});
