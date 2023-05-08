/* global PlugIn */

(() => {
  var action = new PlugIn.Action(function(selection) {
    const FerlatteLib = this.FerlatteLib;
    selection.tasks.forEach(function(task) {
      task.deferDate = FerlatteLib.dateForTomorrow();
    });
  });

  action.validate = function(selection){
    return (selection.tasks.length > 0);
  };

  return action;
})();
