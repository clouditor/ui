import { client, setToken } from "$lib/oauth";
import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load = (async ({ url }) => {
    let res;
    try {
        res = await client.processSigninResponse(url.toString())
    } catch (err) {
        console.error(err)
        return {
            error: err
        }
    }

    console.log("Successfully signed in")
    setToken(res.access_token)
    throw redirect(301, res.userState as string ?? "/");
}) satisfies PageLoad