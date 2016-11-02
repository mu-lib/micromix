
var slice = Array.prototype.slice;
var reduce = Array.prototype.reduce;
var toString = Object.prototype.toString;

module.exports = function (express, plugins) {
  function usePlugin(app, plugin) {
    return toString.call(plugin) === "[object Function]"
      ? plugin.call(plugin, app, express, plugins)
      : app.use(plugins[plugin.plugin](plugin.config));
  }

  function useConfig(app, config) {
    function usePath(app, path) {
      return app.use(path, reduce.call(config[path], usePlugin, express()));
    }

    return toString.call(config) === "[object Function]"
      ? config.call(config, app, express, plugins)
      : Object.keys(config).reduce(usePath, app);
  }

  return function micromix() {
    return slice.call(arguments).reduce(useConfig, express());
  }
}