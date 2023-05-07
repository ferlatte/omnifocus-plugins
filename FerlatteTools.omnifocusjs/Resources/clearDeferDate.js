/* global PlugIn, console */
(() => {
    var action = new PlugIn.Action(function(selection) {
        // Add code to run when the action is invoked
        console.log("Invoked with selection", selection);
        selection.projects.forEach(function(project) {
            project.tasks.forEach(function(task) {
                task.deferDate = null;
            });
        });
    });


    action.validate = function(selection){
        return (selection.projects.length > 0);
    };

    return action;
})();
