const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    proxy:{
      '/record':{
        target:'http://192.168.21.99:9000',
        // ws:true,
        changeOrigin:true
      }
    }
  }
})
