let project_folder = 'dist',
	source_folder = 'src',
	font_names = '{icons,Roboto,SF-Pro-Display}';
fs = require('fs');

let path = {
	build: {
		html: project_folder + '/',
		css: project_folder + '/css/',
		js: project_folder + '/js/',
		img: project_folder + '/img/',
		fonts: project_folder + '/fonts/',
	},
	src: {
		html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
		css: [source_folder + '/scss/style.scss', source_folder + '/scss/css-sections/*.scss'],
		js: source_folder + '/js/script.js',
		img: source_folder + '/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}',
		ttf: source_folder + '/fonts/' + font_names + '/*.ttf',
		woff: source_folder + '/fonts/' + font_names + '/*.{woff,woff2}',
	},
	watch: {
		html: source_folder + '/**/*.html',
		css: source_folder + '/scss/**/*.scss',
		js: source_folder + '/js/**/*.js',
		img: source_folder + '/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}',
	},
	clean: './' + project_folder + '/',
};

let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	scss = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	groupmedia = require('gulp-group-css-media-queries'),
	cleancss = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify-es').default,
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	webphtml = require('gulp-webp-html'),
	webpcss = require('gulp-webpcss'),
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter'),
	version = require('gulp-version-number');

function browserSync() {
	browsersync.init({
		server: {
			baseDir: './' + project_folder + '/',
		},
		port: 1709,
		notify: false,
	});
}

function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(
			version({
				value: '%DT%',
				append: {
					key: '_v',
					cover: 0,
					to: ['css', 'js'],
				},
				output: {
					file: 'version.json',
				},
			})
		)
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}

function css() {
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: 'expanded',
			})
		)
		.pipe(groupmedia())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 5 versions'],
				cascade: true,
			})
		)
		.pipe(webpcss())
		.pipe(dest(path.build.css))
		.pipe(cleancss())
		.pipe(
			rename({
				extname: '.min.css',
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				extname: '.min.js',
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}
function images() {
	return src(path.src.img)
		.pipe(webp({ quality: 95 }))
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 1,
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream());
}

function fonts() {
	src(path.src.woff).pipe(dest(path.build.fonts));
	src(path.src.ttf).pipe(ttf2woff()).pipe(dest(path.build.fonts));
	return src(path.src.ttf).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
}

gulp.task('otf2ttf', function () {
	return src([source_folder + '/fonts/*.otf'])
		.pipe(
			fonter({
				formats: ['ttf'],
			})
		)
		.pipe(dest(source_folder + '/fonts/'));
});

gulp.task('fontsStyle', function () {
	let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		});
	}
});

function cb() {}

function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

function clean() {
	return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(watchFiles, browserSync);
let complete = gulp.parallel(build, watch);

exports.clean = clean;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.complete = complete;
exports.default = watch;
