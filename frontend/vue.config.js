const { defineConfig } = require('@vue/cli-service');
const { version } = require('./package.json');

module.exports = defineConfig({
	transpileDependencies: true,
	publicPath: '/'  // Always use root path for Docker deployment
});

process.env.VUE_APP_VERSION = version;
process.env.VUE_APP_BUILD_TIME = new Date().toLocaleString('en-GB', {
	day: '2-digit', month: '2-digit', year: '2-digit',
	hour: '2-digit', minute: '2-digit', second: '2-digit',
	hour12: false
}).replace(',', ' -');