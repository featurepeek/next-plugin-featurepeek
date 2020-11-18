import React from 'react'

export default async function headTags() {
  const { env } = process

  // short-circuit if not opted-in via env var
  if (!env.FEATUREPEEK_ENABLE) {
    return null
  }

  // detect version control. atm only github is supported
  let vcs = 'other'
  if (env.VERCEL_GITHUB_ORG && env.VERCEL_GITHUB_REPO) {
    vcs = 'github'
  } else if (env.VERCEL_GITLAB_PROJECT_NAMESPACE && env.VERCEL_GITLAB_PROJECT_NAME) {
    vcs = 'gitlab'
  } else if (env.VERCEL_BITBUCKET_REPO_OWNER && env.VERCEL_BITBUCKET_REPO_NAME) {
    vcs = 'bitbucket'
  }

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.__FEATUREPEEK__ = {
              branch: '${env.VERCEL_GITHUB_COMMIT_REF || env.VERCEL_GITLAB_COMMIT_REF || env.VERCEL_BITBUCKET_COMMIT_REF}',
              env: '${env.FEATUREPEEK_DASHBOARD_ENV || ''}',
              org: '${env.VERCEL_GITHUB_ORG || env.VERCEL_GITLAB_PROJECT_NAMESPACE || env.VERCEL_BITBUCKET_REPO_OWNER}',
              repo: '${env.VERCEL_GITHUB_REPO || env.VERCEL_GITLAB_PROJECT_NAME || env.VERCEL_BITBUCKET_REPO_NAME}',
              sha: '${env.VERCEL_GITHUB_COMMIT_SHA || env.VERCEL_GITLAB_COMMIT_SHA || env.VERCEL_BITBUCKET_COMMIT_SHA}',
              paas: 'vercel',
              vcs: '${vcs}',
            }
          `,
        }}
      />
      <script async defer src="https://unpkg.com/@featurepeek/snippet.js/dist/vercel.js" />
    </>
  )
}
