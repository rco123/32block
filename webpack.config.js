
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // webpack 모듈을 가져옵니다.


module.exports = {
  entry: './src/app.js',  // 진입점 파일
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    assetModuleFilename: 'images/[name][ext]',  // 이미지 파일 출력 경로 설정
    assetModuleFilename: 'media/[name][ext]',  // 미디어 파일 경로 설정
  },
  resolve: {
    fallback: {
        canvas: false,  // 'canvas' 모듈을 무시
    },
  },
  mode: 'development',  // 'development' 모드 설정
  module: {
    rules: [
      
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],  // CSS 로더
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Babel 로더
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/, // 이미지 파일 처리
        type: 'asset/resource',  // Webpack 5에서 이미지 번들링 처리
        generator: {
          filename: 'images/[name][ext]',  // 이미지를 dist/images 폴더로 출력
        },
      },
      {
        test: /\.html$/,  // HTML 파일 처리
        use: ['html-loader'],  // html-loader 추가
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',  // 기본 HTML 파일
     
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/images', to: 'images' },  // src/images 폴더의 모든 파일을 dist/images로 복사
      ],
    }),
    new webpack.DefinePlugin({
        global: 'window',  // global을 window로 설정하여 사용
      }),
   

  ],
  target: 'electron-renderer',  // Electron 환경에서 렌더링

  

};
