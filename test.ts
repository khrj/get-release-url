// See https://deno.land/manual/testing
import { assertEquals } from "./deps.ts"
import getRelease, { addProviderMethod } from "./mod.ts"

Deno.test("Fetch all assets", async () => {
    const correct = [
        "https://github.com/KhushrajRathod/KhushrajRathod/releases/download/1.0.0/3.txt",
        "https://github.com/KhushrajRathod/KhushrajRathod/releases/download/1.0.0/hi-1.txt",
        "https://github.com/KhushrajRathod/KhushrajRathod/releases/download/1.0.0/hi-2.txt",
    ].sort()

    const urls = await getRelease({
        provider: "github",
        user: "KhushrajRathod",
        repo: "KhushrajRathod",
    })

    assertEquals(correct, urls.sort())
})

Deno.test("Fetch matched assets", async () => {
    const correct = [
        "https://github.com/KhushrajRathod/KhushrajRathod/releases/download/1.0.0/hi-1.txt",
        "https://github.com/KhushrajRathod/KhushrajRathod/releases/download/1.0.0/hi-2.txt",
    ].sort()

    const urls = await getRelease({
        provider: "github",
        user: "KhushrajRathod",
        repo: "KhushrajRathod",
        part: "hi",
    })

    assertEquals(correct, urls.sort())
})

Deno.test("Custom fetch", async () => {
    addProviderMethod("myProvider", ({ user, repo, part }) => {
        assertEquals(user, "user")
        assertEquals(repo, "repo")
        assertEquals(part, "part")

        return Promise.resolve(["hi"])
    })

    const correct = ["hi"]

    const urls = await getRelease({
        provider: "myProvider",
        user: "user",
        repo: "repo",
        part: "part",
    })

    assertEquals(urls, correct)
})
