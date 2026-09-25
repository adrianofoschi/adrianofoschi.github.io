# nulltype

Personal site and blog, built with [Astro](https://astro.build).

Software architecture, design patterns and AI-assisted coding — field notes from a developer with 15+ years of experience.

## Development

```sh
npm install
npm run dev
```

## Deployment

Every push to `main` builds the site and publishes it to [Bunny](https://bunny.net) via the
workflow in `.forgejo/workflows/deploy.yml`: the build output is uploaded to a Storage Zone
and the Pull Zone serving `nulltype.org` is purged. CI runs on the self-hosted Forgejo
runner, so the build machine only ever makes outbound connections.
