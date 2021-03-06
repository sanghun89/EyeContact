import path from 'path';
import cp from 'child_process';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import mkdirp from 'mkdirp';
import minimist from 'minimist';
import webpack from 'webpack';
import runSequence from 'run-sequence';

const plugin = gulpLoadPlugins();
const argv = minimist(process.argv.slice(2));
const src = Object.create(null);

let watch = false;

// Clean output directory
gulp.task('clean', cb => {
    del(['.tmp', 'build/*', '!build/.git'], {dot: true}, () => {
        mkdirp('build/public', cb);
    });
});

// Static files
gulp.task('assets', () => {
    src.assets = 'src/public/**';
    return gulp.src(src.assets)
        .pipe(plugin.changed('build/public'))
        .pipe(gulp.dest('build/public'))
        .pipe(plugin.size({title: 'assets'}));
});

// Resource files
gulp.task('resources', () => {
    src.resources = [
        'package.json',
        'src/template*/**'
    ];
    return gulp.src(src.resources)
        .pipe(plugin.changed('build'))
        .pipe(gulp.dest('build'))
        .pipe(plugin.size({title: 'resources'}));
});

// Bundle
gulp.task('bundle', cb => {
    const config = require('./webpack.config.js');
    const bundler = webpack(config);
    const verbose = !!argv.verbose;
    let bundlerRunCount = 0;

    function bundle(err, stats) {
        if (err) {
            throw new plugin.util.PluginError('webpack', err);
        }

        console.log(stats.toString({
            colors: plugin.util.colors.supportsColor,
            hash: verbose,
            version: verbose,
            timings: verbose,
            chunks: verbose,
            chunkModules: verbose,
            cached: verbose,
            cachedAssets: verbose
        }));

        if (++bundlerRunCount === (watch ? config.length : 1)) {
            return cb();
        }
    }

    if (watch) {
        bundler.watch(200, bundle);
    } else {
        bundler.run(bundle);
    }
});

// Build the app from source code
gulp.task('build', ['clean'], cb => {
    runSequence(['assets', 'resources'], ['bundle'], cb);
});

// Build and start watching for modifications
gulp.task('build:watch', cb => {
    watch = true;
    runSequence('build', () => {
        gulp.watch(src.assets, ['assets']);
        gulp.watch(src.resources, ['resources']);
        cb();
    });
});

// Launch a Node.js/Express server
gulp.task('serve', ['clean', 'build:watch'], cb => {
    src.server = [
        'build/server.js',
        'build/template/**/*'
    ];
    let started = false;
    let server = (function startup() {
        const child = cp.fork('build/server.js', {
            env: Object.assign({NODE_ENV: 'development'}, process.env)
        });
        child.once('message', message => {
            if (message.match(/^online$/)) {
                if (!started) {
                    started = true;
                    gulp.watch(src.server, function() {
                        plugin.util.log('Restarting development server.');
                        server.kill('SIGTERM');
                        server = startup();
                    });
                    cb();
                }
            }
        });
        return child;
    })();

    process.on('exit', () => server.kill('SIGTERM'));
});

// The default task
gulp.task('default', ['serve']);