const debugLogger = (event) => {
  const d = new Date();
  const {type, name, message} = event;
  return {
    type,
    name,
    message,
    time: d.toLocaleTimeString(),
    date: d.toLocaleDateString(),
  };
}

//module.exports.logger = logger;
