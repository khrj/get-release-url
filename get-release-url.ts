import getReleaseURL from "./mod.ts"
const usage = () => {
    console.log(
        `Usage: get-release-url (github|bitbucket) user repo [partofreleasefile]
   Ex: get-release-url github phhusson treble_experimentations
       get-release-url github phhusson treble_experimentations arm64-ab-gapps
       get-release-url bitbucket JesusFreke smali
       get-release-url bitbucket JesusFreke smali baksmali`,
    )
    Deno.exit(1)
}

if (Deno.args.length !== 3 && Deno.args.length !== 4) {
    usage()
}

try {
    const urls = await getReleaseURL({
        provider: Deno.args[0],
        user: Deno.args[1],
        repo: Deno.args[2],
        part: Deno.args[3],
    })

    for (const url of urls) {
        console.log(url)
    }
} catch (e) {
    console.log(e.message)
    usage()
}
