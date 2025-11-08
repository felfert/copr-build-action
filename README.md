# COPR build action

Fedora's [COPR](https://copr.fedorainfracloud.org/coprs/) supports github webhooks, but filters them and only permits push and create tag events for triggering builds. This works for simple integration, but since github webhooks are triggered independently of github workflows, they can lead to unwanted behavior, if for example, a github workflow is established for performing checks that must be passed befor a build is to be triggered.

This is, where the `copr-build-action` comes in. It can be integrated into your workflow and sends requests to COPR programmatically.
If the original trigger event is a `push` or `create`, it normally sends the event's original payload in the POST request. For other events, it creates an artificial payload that resembles a `create` event with a `tag` as `ref_type`. As default `ref` it uses `HEAD` which results in a build of the default branch head.

## Inputs

### `url`

**Required** The URL of your COPR project as shown in the `Integrations` settings of your project.
**IMPORTANT** This contains authentication tokens, so you want to put this into a github secret.

### `ref`

**Optional** Default: `HEAD` The ref to send, if an artificial payload is used. **Not** used, if `force` is false and event is `push` or `create`.

### `force`

**Optional** Boolean, default: false. If true, then the artificial payload is always generated, even for `push` or `crate` events.

## Example usage

```yaml
uses: felfert/copr-build-action@v1
with:
  url: ${{ secrets.COPR_WEBHOOK }}

```
