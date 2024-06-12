import { toast } from "react-toastify";
import { ErrorResponse } from "../models/response";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";

const baseURL = "http://localhost:5000/" + "api/";

// add a fake delay to our app
const sleep = () => new Promise(resolve => setTimeout(resolve, 250));

// add authorization token (if exists)
const includeTokenIfExists = () => {
    const token = store.getState().account.user?.token;
    if (token) return `Bearer ${token}`;
    return "";
}

// handle API response
const getResponseJson = async (response: Response) => {
    const contentType = response.headers.get('content-type');
    if (!contentType || contentType.indexOf('application/json') === -1) {
        return null;
    } else {

        // handle a special case to handle pagination passed via the header
        const pagination = response.headers.get("pagination");
        if (pagination) {
            const responseJson = await response.json();
            return new PaginatedResponse(responseJson, JSON.parse(pagination));
        }

        return response.json();
    }
}

// boilerplate requests
async function getData(url: string) {
    try {
        // fetch URL
        let res = await fetch(url, {
            credentials: "include",
            headers: { "Authorization": includeTokenIfExists() },
        });

        // have to manually throw error if response if not OK...
        // that's just how fetch API works
        if (!res.ok) throw res;

        await sleep();
        return getResponseJson(res);
    } catch (error) {
        await handleError(error);
    }
}

async function postData(url: string, data: object) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": includeTokenIfExists() },
            body: JSON.stringify(data),
            credentials: "include"  // for cookies
        });
        if (!res.ok) throw res;

        await sleep();
        return getResponseJson(res);
    } catch (error) {
        await handleError(error);
    }
}

async function putData(url: string, data: object) {
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": includeTokenIfExists() },
            body: JSON.stringify(data),
            credentials: "include"
        });
        if (!res.ok) throw res;

        await sleep();
        return getResponseJson(res);
    } catch (error) {
        await handleError(error);
    }
}

async function deleteData(url: string) {
    try {
        const res = await fetch(url, {
            method: "DELETE",
            credentials: "include",
            headers: { "Authorization": includeTokenIfExists() },
        });
        if (!res.ok) throw res;

        await sleep();
        return getResponseJson(res);
    } catch (error) {
        await handleError(error);
    }
}

const handleError = async (error: any) => {
    const statusCode: number = error.status;
    const response: ErrorResponse = await error.json();

    switch (statusCode) {
        case 400:
            if (response.errors) {
                const validationErrors = response.errors;
                const modelStateErrors: string[] = [];
                for (let key in validationErrors) {
                    if (validationErrors[key]) {
                        modelStateErrors.push(validationErrors[key]);
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(response.title);
            throw error;
        case 401:
            toast.error(response.title);
            throw error;
        case 404:
            router.navigate("/not-found");
            break;
        case 500:
            router.navigate("/server-error", { state: { error: response } });
            break;
        default:
            break;
    }
}

// centralisation of all API requests
const requests = {
    get: async (url: string, params?: URLSearchParams) => {
        try {
            return await getData(baseURL + url + (params == null ? "" : `?${params}`))
        } catch (error) {
            throw error;
        }
    },
    post: async (url: string, data: {}) => {
        try {
            return await postData(baseURL + url, data)
        } catch (error) {
            throw error;
        }
    },
    put: async (url: string, data: {}) => {
        try {
            return await putData(baseURL + url, data)
        } catch (error) {
            throw error;
        }
    },
    delete: async (url: string) => {
        try {
            return await deleteData(baseURL + url)
        } catch (error) {
            throw error;
        }
    }
}

// specific requests
const Catalogue = {
    getAll: (params: URLSearchParams) => requests.get("products", params),
    getById: (id: number) => requests.get("products/" + id),
    getFilters: () => requests.get("products/filters")
}

const TestErrors = {
    get400: () => {
        try {
            return requests.get("buggy/bad-request")
        } catch (error) {
            throw error;
        }
    },
    get401: () => requests.get("buggy/unauthorized"),
    get404: () => requests.get("buggy/not-found"),
    get500: () => requests.get("buggy/server-error"),
    getValidationError: () => {
        try {
            return requests.get("buggy/validation-error")
        } catch (error) {
            throw error;
        }
    },
}

const Cart = {
    get: () => requests.get('cart'),
    addItem: (productId: number, qty = 1) => requests.post(`cart?productId=${productId}&qty=${qty}`, {}),
    removeItem: (productId: number, qty = 1) => {
        try {
            return requests.delete(`cart?productId=${productId}&qty=${qty}`)
        } catch (error) {
            throw error;
        }
    },
}

const Account = {
    login: (reqBody: any) => requests.post('account/login', reqBody),
    register: (reqBody: any) => requests.post('account/register', reqBody),
    currUser: () => requests.get('account/currentUser'),
}

// export
const agent = {
    Catalogue,
    TestErrors,
    Cart,
    Account
}

export default agent;