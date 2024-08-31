const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: './',
    devServer: {
        port: 8889,
        proxy: {
            "/linker-server": {
                // "http://localhost:8888"、"http://192.168.0.10"
                target: "http://localhost:8888",
                changeOrigin: true,
            }
        }
    }
})