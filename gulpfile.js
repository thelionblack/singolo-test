const gulp = require('gulp');	
const autoprefixer = require('gulp-autoprefixer');	
const del = require('del');	
const browserSync = require('browser-sync').create();	
const concat = require('gulp-concat');	
const cleanCSS = require('gulp-clean-css');	
const sourcemaps = require('gulp-sourcemaps');	
const gulpif = require('gulp-if');	
const gcmq = require('gulp-group-css-media-queries');	
const sass = require('gulp-sass');	
const smartgrid = require('smart-grid');	

const isDev = (process.argv.indexOf('--dev') !== -1);	
const isProd = !isDev;	
const isSync = (process.argv.indexOf('--sync') !== -1);	

sass.compiler = require('node-sass');	


function clear(){	
	return del('build/*');	
}	

function styles(){	
	return gulp.src('./src/css/style.scss')	
			   .pipe(gulpif(isDev, sourcemaps.init()))	
			   .pipe(sass().on('error', sass.logError))	
			   //.pipe(concat('style.css'))	
			   .pipe(gcmq())	
			   .pipe(autoprefixer({	
		            cascade: false	
		        }))	
			   //.on('error', console.error.bind(console))	
			   .pipe(gulpif(isProd, cleanCSS({	
			   		level: 2	
			   })))	
			   .pipe(gulpif(isDev, sourcemaps.write()))	
			   .pipe(gulp.dest('./build/css'))	
			   .pipe(gulpif(isSync, browserSync.stream()));	
}	

function img(){	
	return gulp.src('./src/img/**/*')	
			   .pipe(gulp.dest('./build/img'))	
}	

function html(){	
	return gulp.src('./src/*.html')	
			   .pipe(gulp.dest('./build'))	
			   .pipe(gulpif(isSync, browserSync.stream()));	
}	

function watch(){	
	if(isSync){	
		browserSync.init({	
	        server: {	
	            baseDir: "./build/",	
	        }	
	    });	
	}	

	gulp.watch('./src/css/**/*.scss', styles);	
	gulp.watch('./src/**/*.html', html);	
}	


function grid(done){	
	let settings = {	
		outputStyle: 'scss', /* less || scss || sass || styl */	
		columns: 12, /* number of grid columns */	
		offset: '3rem', /* gutter width px || % || rem */	
		mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */	
		container: {	
			maxWidth: '94rem', /* max-width оn very large screen */	
			fields: '0' /* side fields */	
		},	
		breakPoints: {	
			lg: {	
				width: '1100px', /* -> @media (max-width: 1100px) */	
			},	
			md: {	
				width: '960px'	
			},	
			sm: {	
				width: '780px',	
				fields: '15px' /* set fields only if you want to change container.fields */	
			},	
			xs: {	
				width: '560px'	
			}	
			/* 	
			We can create any quantity of break points.	
	 	
			some_name: {	
				width: 'Npx',	
				fields: 'N(px|%|rem)',	
				offset: 'N(px|%|rem)'	
			}	
			*/	
		}	
	};	

	smartgrid('./src/css', settings);	
	done();	
}	

let build = gulp.series(clear, 	
	gulp.parallel(styles, img, html)	
);	

gulp.task('build', build);	
gulp.task('watch', gulp.series(build, watch));	
gulp.task('grid', grid); 