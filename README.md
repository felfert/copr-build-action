# COPR build action

Fedora's [COPR](https://copr.fedorainfracloud.org/coprs/) supports github webhooks, but filters them and only permits push and create tag events for triggering builds. This works for simple integration, but since github webhooks are triggered independently of github workflows, they can lead to unwanted behavior. If for example, a github workflow is established for performing checks that must be passed before a build is to be triggered.

This is, where the `copr-build-action` comes in. It can be integrated into your workflow and sends requests to COPR programmatically.

If the original trigger event is a `push` or `create`, it normally sends the event's original payload in the POST request. For all other events, it creates an artificial payload that resembles a `create` event with a `tag` as `ref_type`. As default `ref` it uses `HEAD` which results in a build of the default branch head. This is usefule also for reusable workflows, which - when called - show a `workflow_call` event.

## Usage

```yaml

- uses: felfert/copr-build-action@v1
  with:
    # The URL of your COPR project as shown in the Integrations settings of your project.
    # Required, Default: none
    # IMPORTANT: This contains authentication tokens, so you want to put this into a github secret.
    url: ${{ secrets.COPR_WEBHOOK }}

    # The ref to send, if an artificial payload is used. (Either force is true or the current event is push or create)
    # Default: 'HEAD'
    ref: 'HEAD'

    # Whether an artificial payload is used, regardless of the event type.
    # Default: false
    force: false

```
