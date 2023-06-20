import { error } from "@sveltejs/kit";
import { redirectLogin } from "$lib/oauth";

interface ErrorData {
    error: {
        message: string
    }
}

/**
 * Throws an {@link error} if an HTTP status other than OK is contained in
 * {@link response}. This can then later be caught by the individual load
 * functions (ideally using {@link catchError}).
 *
 * @param response the original HTTP response
 * 
 * @returns the response or an error
 */
export function throwError(response: Response) {
    if (!response.ok) {
        throw error(response.status, response.statusText)
    }

    return response;
}

/**
 * This function acts as a counter-part to {@link throwError} and can be used in
 * load functions to convert a {@link error} into a human-friendly error message
 * that is display in the layout.
 *
 * If the error is a permission-denied error, it will automatically redirect the
 * user to the login page.
 *
 * @param err the caught error
 * @param url the URL in which this error was caught.
 *
 * @returns a human-friendly error message data object or a redirect to the
 * login page
 */
export function catchError(err: any, url: URL): ErrorData | Promise<void> {
    if ('status' in err && 'body' in err) {
        if (err.status == 401) {
            return redirectLogin(url.href)
        } else {
            return {
                error: { message: `Some HTTP error occurred: ${err.body}` }
            }
        }
    } else {
        return {
            error: { message: "Some unknown error occurred" }
        }
    }
}