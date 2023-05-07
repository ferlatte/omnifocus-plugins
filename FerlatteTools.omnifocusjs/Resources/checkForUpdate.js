/* global PlugIn */
(() => {
  var action = new PlugIn.Action(function() {
    let FerlatteLib = this.FerlatteLib;
    FerlatteLib.checkForUpdate(this.plugIn.version);
  });

  return action;
})();
