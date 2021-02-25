const normalize = (string: string) => {
    try {
        return string.toUpperCase().trim()
    } catch (e) {
        return string
    }
}

const providerMethods: Record<
    string,
    (
        { user, repo }: { user: string; repo: string; part?: string },
    ) => Promise<string[]>
> = {
    GITHUB: async ({ user, repo, part = "" }: { user: string; repo: string; part?: string }) => {
        const response = await fetch(`https://api.github.com/repos/${user}/${repo}/releases/latest`)
        const json = await response.json()

        if (json.message === "Not Found") throw new Error("Invalid repository")
        if (!("assets" in json)) throw new Error("Rate limit exceeded")

        const browserDownloadUrls: string[] = json.assets.map((asset: { browser_download_url: string }) =>
            asset.browser_download_url
        )
        return browserDownloadUrls.filter((url) => url.includes(part))
    },
    BITBUCKET: async ({ user, repo, part = "" }: { user: string; repo: string; part?: string }) => {
        const response = await fetch(`https://api.bitbucket.org/2.0/repositories/${user}/${repo}/downloads/`)
        const json = await response.json()

        if (json.type === "error") throw "Invalid repository"
        const links: string[] = json.values.map((value: { links: { self: { href: string } } }) => value.links.self.href)
        return links.filter(url => url.includes(part))
    },
}

/**
 * Fetches one or many matching release URLs from the selected provider
 * @param options.provider The provider to fetch from. Available options are
 * 'github', 'bitbucket' and any others added via `addProviderMethod`
 * @param options.user Username to fetch from. This is the user name / org name
 * of the repository owner
 * @param options.repo Repository to fetch releases from
 * @param options.part Part of the name of release assets to filter. Eg. if a
 * release contains 3 assets, 'hi-1', 'hi-2', and '3', passing 'hi' as the part
 * will only return 'hi-1' and 'hi-2'
 */
export default async function getReleaseURL(options: { provider: string; user: string; repo: string; part?: string }) {
    const providerNormalized = normalize(options.provider)
    if (!(providerNormalized in providerMethods)) {
        throw new Error("Invalid provider")
    }

    return await providerMethods[providerNormalized]({ user: options.user, repo: options.repo, part: options.part || "" })
}

/**
 * @param provider Provider for the method. You can override existing providers
 * if needed
 * @param method Custom method 
 */
export function addProviderMethod(
    provider: string,
    method: (
        { user, repo, part }: { user: string; repo: string; part?: string },
    ) => Promise<string[]>,
) {
    providerMethods[normalize(provider)] = method
}
