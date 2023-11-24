const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: './',
    devServer: {
        port: 8889,
        proxy: {
            "/linker-server": {
                target: "http://localhost:8888",
                changeOrigin: true,
            }
        }
    }
})