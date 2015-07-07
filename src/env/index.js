let env_config = require(`./${process.env.NODE_ENV}.js`);

export { env_config as default };