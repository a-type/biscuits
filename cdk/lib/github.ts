import { Octokit } from '@octokit/rest';

if (!process.env.GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN is required');
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function addRepositoryVariable(key: string, value: string) {
  const res = await octokit.request(
    'POST /repos/a-type/biscuits/actions/variables',
    {
      owner: 'a-type',
      repo: 'biscuits',
      name: key,
      value,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );

  if (res.status < 400) {
    console.log(`✅ Added Github variable ${key}`);
  }
}
