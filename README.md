[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/ferlatte/omnifocus-plugins/main.svg)](https://results.pre-commit.ci/latest/github/ferlatte/omnifocus-plugins/main)

# omnifocus-plugins
Plugins for OmniFocus that I've written for my own use.

## FerlatteTools

A bundle that contains all of the following plugins.

### clear-defer-date-from-project-tasks

Clears out defer dates from all tasks within the selected projects.

### defer-task-to-tomorrow

Defers a task to tomorrow regardless of the current defer date.

### clear-flag-from-tasks

Clears the flag from all uncompleted tasks.

### set-estimated-duration-of-tasks-with-magic

Uses OpenAI to estimate the duration of all tasks that don't have an estimated duration already filled in. You will need to provide your own OpenAI API key.

## Releases

(This is all ripe for automating)

Tag main with the version in manifest.json: `git tag -a v0.0.1 -m "Version 0.0.1"`
Push tag: `git push origin --tags`
`make release`, which should give you FerlatteTools.omnifocusjs.zip
Go to Github, create a new release against the tag you just pushed, and upload the zip file.
Then, bump the version number in manifest.json and commit that as your first commit after the release.
