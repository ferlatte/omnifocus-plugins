/* global PlugIn */
(() => {
  var action = new PlugIn.Action(function() {
    const FerlatteLib = this.FerlatteLib;
    FerlatteLib.checkForUpdate(this.plugIn.version);
  });

  return action;
})();
