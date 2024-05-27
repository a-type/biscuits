import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: 'YOUR-TOKEN',
});

export async function addRepositoryVariable(key: string, value: string) {
  await octokit.request('POST /repos/a-type/biscuits/actions/variables', {
    owner: 'a-type',
    repo: 'biscuits',
    name: key,
    value,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}
