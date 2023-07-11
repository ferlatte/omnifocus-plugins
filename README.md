[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/ferlatte/omnifocus-plugins/main.svg)](https://results.pre-commit.ci/latest/github/ferlatte/omnifocus-plugins/main)

# omnifocus-plugins
Plugins for OmniFocus that I've written for my own use.

## FerlatteTools

A bundle that contains all of the following plugins.

### Defer tasks until tomorrow

Defers the selected tasks until tomorrow regardless of the current defer date.

### Clear flag and forecast tag from blocked tasks

I mostly use this for repeating tasks. If you flag a task and then complete it (or put it in the Forecast view) the next iteration of the task will also be flagged or tagged for Forecast. I use this to "clear out" those future tasks.

### set-estimated-duration-of-tasks-with-magic

Uses OpenAI to estimate the duration of all tasks that don't have an estimated duration already filled in. You will need to provide your own OpenAI API key.

## Releases

(This is all ripe for automating)

Tag main with the version in manifest.json: `make releasetag`
Push tag: `git push origin --tags`
`make release`, which should give you FerlatteTools.omnifocusjs.zip
Go to Github, create a new release against the tag you just pushed named like `0.0.1`, and upload the zip file.
Then, bump the version number in manifest.json and commit that as your first commit after the release.
