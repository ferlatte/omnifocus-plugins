/*{
    "author": "Mark Ferlatte",
    "targets": ["omnifocus"],
    "type": "action",
    "identifier": "net.cryptio.set-estimated-duration-of-tasks-with-magic",
    "version": "0.1",
    "description": "Use OpenAI to estimate the duration of the selected tasks",
    "label": "Estimate the duration of selected tasks",
    "mediumLabel": "Estimate the duration of selected tasks",
    "paletteLabel": "Estimate the duration of selected tasks",
    }*/

/* global PlugIn, Credentials, URL, Form, Alert, app, console */

(() => {
  // Credentials can only be created at plugin load.
  let credentials = new Credentials();
  const serviceIdentifier = "OpenAI";

  function alertError(e) {
    return new Alert("Error", e.message);
  }

  function setEstimatedDuration(apiKey, task) {
    const openaiCompletionURL = "https://api.openai.com/v1/chat/completions";
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
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };
    let request = URL.FetchRequest.fromString(openaiCompletionURL);
    request.method = "POST";
    request.headers = headers;
    try {
      request.bodyString = JSON.stringify(requestBody);
    } catch(e) {
      console.log("error: ", e);
      alertError(e).show();
    }
    request.fetch().then(
      response => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          let r = JSON.parse(response.bodyString);
          let retval = r?.choices[0]?.message?.content;
          if (retval) {
            let minutes = Number(retval);
            if (Number.isInteger(minutes)) {
              task.estimatedMinutes = Number(retval);
            } else {
              throw new Error("Invalid number of minutes returned: ", retval);
            }
          } else {
            throw new Error(response.bodyString);
          }
        } else {
          if (response.mimeType === "application/json") {
            let errorMessage = JSON.parse(response.bodyString).message;
            throw new Error(errorMessage);
          }
        }
      }
    ).catch((e) => {
      console.log("error: ", e);
      alertError(e).show();
    });
  }

  function getAPIKey(creds) {
    let credentialsObj = creds.read(serviceIdentifier);
    if (credentialsObj) {
      return credentialsObj.password;
    }
    return undefined;
  }

  function requestAPIKey() {
    let inputForm = new Form();
    let apiKeyField = new Form.Field.String(
      "apiKey",
      "OpenAI API Key",
      null
    );
    inputForm.addField(apiKeyField);

    inputForm.validate = formObject => {
      let apiKey = formObject.values["apiKey"];
      let apiKeyStatus = (apiKey && apiKey.length > 0);
      return !! apiKeyStatus;
    };
    let formPrompt = `API Key for ${serviceIdentifier}:`;
    inputForm.show(formPrompt, "Continue").then(formObject => {
      let apiKey = formObject.values["apiKey"];
      // NB: The Credentials API requires a username; it will let you
      // write just a password, but reads will then fail.
      let c = credentials.write(serviceIdentifier, "BearerToken", apiKey);
      if (! c) {
        throw new Error("Credentials.write() failed");
      }
    }).catch((e) => {
      console.log("error: ", e);
      alertError(e).show();
    });
  }

  var action = new PlugIn.Action(selection => {
    // To remove credentials, hold down control when selecting plug-in.
    if (app.controlKeyDown) {
      let alert = new Alert("Confirmation Required",
                            "Remove stored OpenAI API Key?");
      alert.addOption("Remove");
      alert.addOption("Cancel");
      alert.show(buttonIndex => {
        if (buttonIndex === 0) {
          credentials.remove(serviceIdentifier);
        }
      });
    } else {
      let apiKey = getAPIKey(credentials);
      if (! apiKey) {
        requestAPIKey();
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
