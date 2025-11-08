import * as core from "@actions/core";
import * as github from "@actions/github";
import * as hcl from "@actions/http-client";
import { v4 as uuidv4 } from 'uuid';

try {
  const url = core.getInput("url", { required: true });
  core.setSecret(url);

  const ref = core.getInput("ref") || 'HEAD';

  const force = core.getBooleanInput('force', { required: false });

  // Get the JSON webhook payload for the event that triggered the workflow
  const pl = github.context.payload;
  const eventName = github.context.eventName;

  const userAgent = 'copr-build-action';
  let headers = {
      'Content-Type': 'application/json',
      'X-Github-Hook-Installation-Target-Type': 'repository',
      'X-Github-Hook-Installation-Target-Id': pl.repository.id.toString(),
      'X-Github-Hook-Id': '12345678',
      'X-Github-Delivery': uuidv4(),
      'X-GitHub-Event': eventName
  };
  let payload = JSON.stringify(pl, undefined, 2);
 
  if ((eventName != 'create' && eventName != 'push') || force) {
      headers['X-GitHub-Event'] = 'create';
      const pobj = {
          description: pl.repository.description,
          master_branch: pl.repository.default_branch,
          pusher_type: 'user',
          ref: ref,
          ref_type: 'tag',
          repository:  pl.repository,
          sender: pl.sender
      };
      payload = JSON.stringify(pobj, undefined, 2);
  }
  const client = new hcl.HttpClient(userAgent);
  client.post(url, payload, headers).then((res) => {
      if (res.message.statusCode >= 400) {
          core.setFailed(`request failed: ${res.message.statusCode} ${res.message.body}`);
      }
  });
} catch (error) {
  core.setFailed(error.message);
}
