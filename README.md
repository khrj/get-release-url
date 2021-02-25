<div align="center">
    <img src="assets/logo.svg" width="400" height="400" alt="get_release illustration">
    <h1>Get Release</h1>
    <p>
        <b>Get the latest release URL from any hosting provider. Supports pattern matching</b>
    </p>
    <p>
        <img alt="build status" src="https://img.shields.io/github/workflow/status/KhushrajRathod/getRelease/Deno?label=checks" >
        <img alt="language" src="https://img.shields.io/github/languages/top/KhushrajRathod/getRelease" >
        <img alt="code size" src="https://img.shields.io/github/languages/code-size/KhushrajRathod/getRelease">
        <img alt="issues" src="https://img.shields.io/github/issues/KhushrajRathod/getRelease" >
        <img alt="license" src="https://img.shields.io/github/license/KhushrajRathod/getRelease">
        <img alt="version" src="https://img.shields.io/github/v/release/KhushrajRathod/getRelease">
    </p>
    <p>
        <b><a href="https://deno.land/x/get_release">View on deno.land</a></b>
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
import getRelease from "https://deno.land/x/get_release@1.0.0/mod.ts"

const urls = await getRelease({
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
import getRelease, {
    addProviderMethod,
} from "https://deno.land/x/get_release@1.0.0/mod.ts"

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

await getRelease({
    provider: "github",
    user: "phhusson",
    repo: "treble_experimentations",
    part: "arm64-ab-gapps",
}) // Uses custom method
```

### API

See [generated documentation](https://doc.deno.land/https/deno.land/x/get_release@1.0.0/mod.ts)

## CLI

### Quickstart

```bash
deno run --allow-net https://deno.land/x/get_release@1.0.0/get-release.ts github phhusson treble_experimentations arm64-aonly
```

### Installation

```bash
deno install --allow-net https://deno.land/x/get_release@1.0.0/get-release.ts
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

[![Stargazers repo roster for @KhushrajRathod/getRelease](https://reporoster.com/stars/KhushrajRathod/getRelease)](https://github.com/KhushrajRathod/getRelease/stargazers)

[![Forkers repo roster for @KhushrajRathod/getRelease](https://reporoster.com/forks/KhushrajRathod/getRelease)](https://github.com/KhushrajRathod/getRelease/network/members)

## Related

- [Deno modules](https://github.com/KhushrajRathod/DenoModules)
