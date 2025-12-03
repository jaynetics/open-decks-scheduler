const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

// Custom plugin to clean up files after inlining
class CleanupPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('CleanupPlugin', (compilation, callback) => {
      const fs = require('fs');
      const outputPath = compilation.outputOptions.path;

      // Get all files in the output directory
      fs.readdir(outputPath, (err, files) => {
        if (err) {
          callback();
          return;
        }

        // Keep only the main HTML file in production
        files.forEach(file => {
          if (file !== 'open-decks-scheduler.html' && !file.includes('.html')) {
            // Remove TypeScript declarations, source maps, and JS files
            if (file.endsWith('.d.ts') ||
                file.endsWith('.d.ts.map') ||
                file.endsWith('.js') ||
                file.endsWith('.js.map') ||
                file.endsWith('.LICENSE.txt') ||
                file.endsWith('.ts') ||
                file.endsWith('.map')) {
              fs.unlink(path.join(outputPath, file), () => {});
            }
            // Remove directories like components, types, utils, constants
            const filePath = path.join(outputPath, file);
            fs.stat(filePath, (err, stats) => {
              if (!err && stats.isDirectory()) {
                fs.rmSync(filePath, { recursive: true, force: true });
              }
            });
          }
        });

        callback();
      });
    });
  }
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : 'bundle.js',
      clean: true,
    },
    externals: isProduction ? {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'fflate': 'fflate'
    } : {},
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@types': path.resolve(__dirname, 'src/types'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.build.json',
              transpileOnly: isProduction,
            }
          },
          exclude: [/node_modules/, /\.test\.tsx?$/],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: isProduction ? './public/index.production.html' : './public/index.html',
        title: 'Open Decks Scheduler',
        filename: isProduction ? 'open-decks-scheduler.html' : 'index.html',
        inject: 'body',
        minify: isProduction ? {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: false, // Keep script type for CDN scripts
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true
        } : false,
        inlineSource: isProduction ? '.(js|css)$' : false,
      }),
      ...(isProduction ? [
        new HtmlInlineScriptPlugin(),
        new CleanupPlugin()
      ] : []),
    ],
    devServer: {
      static: './dist',
      port: 3000,
      hot: true,
    },
    optimization: {
      minimize: isProduction,
    },
    devtool: isProduction ? false : 'source-map',
  };
};