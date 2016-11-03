var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

function wrap(conf) {
  return conf.uses ? conf : { "uses": [conf] };
}

function group(results, plugin) {
  switch (toString.call(plugin)) {
    case "[object Function]":
    case "[object Array]":
      results.push(plugin);
      delete results.tail;
      break;

    case "[object Object]":
    case "[object String]":
      if (!results.tail) {
        results.push(results.tail = []);
      }

      results.tail.push(plugin);
      break;

    default:
      throw new Error("Unknown typeof plugin");
  }

  return results;
}

module.exports = function (express, plugins) {
  function getPlugin(plugin, config) {
    return (toString.call(plugin) === "[object Function]" ? plugin : plugins[plugin])[toString.call(config) === "[object Array]" ? "apply" : "call"](this, config);
  }

  function usePlugin(app, plugin) {
    return app.use(getPlugin.call(app, plugin.plugin || plugin, plugin.config));
  }

  function use(plugin) {
    var result;

    switch (toString.call(plugin)) {
      case "[object Array]":
        result = plugin.reduce(usePlugin, express());
        break;

      case "[object Function]":
        result = plugin;
        break;

      default:
        throw new Error("Unknown typeof plugin");
    }

    return result;
  }

  function useConfig(app, config) {
    function usePath(app, path) {
      function useService(app, service) {
        return app[service.method || "use"](path, (toString.call(service.uses) === "[object Array]" ? service.uses : [service.uses]).reduce(group, []).map(use));
      }

      var value = config[path];

      switch (toString.call(value)) {
        case "[object String]":
        case "[object Function]":
        case "[object Object]":
          value = [wrap(value)];
          break;

        case "[object Array]":
          value = value.map(wrap);
          break;

        default:
          throw new Error("Uknown typeof value");
      }

      return value.reduce(useService, app);
    }

    return Object.keys(config).reduce(usePath, app);
  }

  return function micromix() {
    return slice.call(arguments).reduce(useConfig, express());
  }
}