/* global PlugIn, Credentials, Alert, app, console */
(() => {
  // Credentials can only be created at plugin load.
  let credentials = new Credentials();

  let FerlatteLib = undefined;

  function alertError(e) {
    return new Alert("Error", e.message);
  }

  async function setEstimatedDuration(apiKey, task) {
    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": "You are a project estimator who is good at estimating how long a given task will take. Be as concise as possible."
        },
        {
          "role": "user",
          "content": "I want you to act as a project estimator. I will provide you with a task and you will reply with an estimate, in minutes, of how long the task will take. Do not write explanations. I want you to only reply with the number of minutes in integer form. If the estimate is a range, reply with only the higher number."
        },
        {
          "role": "user",
          "content": `Estimate this task: ${task.name}`
        }
      ],
      temperature: 0.7,
      stop: "\n"
    };
    try {
      let r = await FerlatteLib.openAIChatCompletion(apiKey, requestBody);
      let retval = r?.choices[0]?.message?.content;
      if (retval) {
        let minutes = Number(retval);
        if (Number.isInteger(minutes)) {
          task.estimatedMinutes = Number(retval);
        } else {
          throw new Error("Invalid number of minutes returned: ", retval);
        }
      } else {
        throw new Error(r);
      }
    } catch (e) {
      console.log(e);
      alertError(e).show();
    }
  }

  var action = new PlugIn.Action(async function(selection) {
    FerlatteLib = this.FerlatteLib;
    // To remove credentials, hold down control when selecting plug-in.
    if (app.controlKeyDown) {
      FerlatteLib.requestOpenAIApiKeyRemoval(credentials);
    } else {
      let apiKey = FerlatteLib.openAIAPIKey(credentials);
      if (! apiKey) {
        FerlatteLib.requestOpenAIApiKey(credentials);
      } else {
        selection.tasks.forEach(task => {
          setEstimatedDuration(apiKey, task);
        });
      }
    }
  });

  action.validate = selection => {
    return (selection.tasks.length > 0);
  };

  return action;
})();
