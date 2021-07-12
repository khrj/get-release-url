<div align="center">
    <img src="assets/logo.svg" width="400" height="400" alt="cloud download to man holding cup illustration">
    <h1>Get Release URL</h1>
    <p>
        <b>Get the latest release URL from any hosting provider. Supports pattern matching</b>
    </p>
    <p>
        <img alt="build status" src="https://img.shields.io/github/workflow/status/khrj/get-release-url/Deno?label=checks" >
        <img alt="language" src="https://img.shields.io/github/languages/top/khrj/get-release-url" >
        <img alt="code size" src="https://img.shields.io/github/languages/code-size/khrj/get-release-url">
        <img alt="issues" src="https://img.shields.io/github/issues/khrj/get-release-url" >
        <img alt="license" src="https://img.shields.io/github/license/khrj/get-release-url">
        <img alt="version" src="https://img.shields.io/github/v/release/khrj/get-release-url">
    </p>
    <p>
        <b><a href="https://deno.land/x/get_release_url">View on deno.land</a></b>
    </p>
    <br>
    <br>
    <br>
</div>

## Table of Contents

- [Usage](#usage)
  - [Custom Provider Methods](#custom-provider-methods)
  - [API](#api)
- [CLI](#cli)
  - [Quickstart](#quickstart)
  - [Installation](#installation)
  - [Running](#running)

## Usage

```ts
import getReleaseURL from "https://deno.land/x/get_release_url@1.0.0/mod.ts"

const urls = await getReleaseURL({
    provider: "github",
    user: "phhusson",
    repo: "treble_experimentations",
    part: "arm64-ab-gapps",
})

for (const url of urls) {
    console.log(url)
}
```

### Custom provider methods

Default supported providers are [GitHub](https://github.com) and [BitBucket](https://bitbucket.org). You can add custom provider functions using `addProviderMethod` (PRs for more defaults are welcome!)

```ts
import getReleaseURL, {
    addProviderMethod,
} from "https://deno.land/x/get_release_url@1.0.0/mod.ts"

const customGithubProvider = async (
    { user, repo, part = "" }: { user: string; repo: string; part?: string },
) => {
    const response = await fetch(
        `https://api.github.com/repos/${user}/${repo}/releases/latest`,
    )
    const json = await response.json()

    if (json.message === "Not Found") throw new Error("Invalid repository")
    if (!("assets" in json)) throw new Error("Rate limit exceeded")

    let browser_download_urls: string[] = json.assets.map((
        asset: { browser_download_url: string },
    ) => asset.browser_download_url)
    return browser_download_urls.filter((url) => url.includes(part))
}

addProviderMethod("github", customGithubProvider)

await getReleaseURL({
    provider: "github",
    user: "phhusson",
    repo: "treble_experimentations",
    part: "arm64-ab-gapps",
}) // Uses custom method
```

### API

See [generated documentation](https://doc.deno.land/https/deno.land/x/get_release_url@1.0.0/mod.ts)

## CLI

### Quickstart

```bash
deno run --allow-net https://deno.land/x/get_release_url@1.0.0/get-release-url.ts github phhusson treble_experimentations arm64-aonly
```

### Installation

```bash
deno install --allow-net https://deno.land/x/get_release_url@1.0.0/get-release-url.ts
```

### Running

```bash
get-release github phhusson treble_experimentations arm64-aonly
```

### Usage

```
Usage: get-release (github|bitbucket) user repo [partofreleasefile]
   Ex: get-release github phhusson treble_experimentations
       get-release github phhusson treble_experimentations arm64-ab-gapps
       get-release bitbucket JesusFreke smali
       get-release bitbucket JesusFreke smali baksmali
```

## Supporters

[![Stargazers repo roster for @khrj/get-release-url](https://reporoster.com/stars/khrj/get-release-url)](https://github.com/khrj/get-release-url/stargazers)

[![Forkers repo roster for @khrj/get-release-url](https://reporoster.com/forks/khrj/get-release-url)](https://github.com/khrj/get-release-url/network/members)

## Related

- [Deno modules](https://github.com/khrj/deno-modules)
