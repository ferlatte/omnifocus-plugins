/* global PlugIn, Alert */
(() => {
  let action = new PlugIn.Action(function() {
    let alertTitle = `${this.plugIn.displayName} v${this.plugIn.version.versionString}`;
    let alertMessage = `${this.plugIn.author}
${this.plugIn.identifier}

https://github.com/ferlatte/omnifocus-plugins

${this.plugIn.description}
`;
    let alert = new Alert(alertTitle, alertMessage);
    alert.addOption("OK");
    return alert.show();
  });

  return action;
})();
