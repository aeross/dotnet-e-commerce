import { toast } from "react-toastify";
import { ErrorResponse } from "../models/response";
import { router } from "../router/Routes";

const baseURL = "http://localhost:5000/" + "api/";

// add a fake delay to our app
const sleep = () => new Promise(resolve => setTimeout(resolve, 250));

const checkIfResponseIsJson = (response: Response) => {
    const contentType = response.headers.get('content-type');
    if (!contentType || contentType.indexOf('application/json') === -1) {
        return null;
    } else {
        return response.json();
    }
}

// boilerplate requests
async function getData(url: string) {
    try {
        // fetch URL
        const res = await fetch(url, { credentials: "include" });

        // have to manually throw error if response if not OK...
        // that's just how fetch API works
        if (!res.ok) throw res;

        await sleep();
        return checkIfResponseIsJson(res);
    } catch (error) {
        await handleError(error);
    }
}

async function postData(url: string, data: object) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include"  // for cookies
        });
        if (!res.ok) throw res;

        await sleep();
        return checkIfResponseIsJson(res);
    } catch (error) {
        handleError(error);
    }
}

async function putData(url: string, data: object) {
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include"
        });
        if (!res.ok) throw res;

        await sleep();
        return checkIfResponseIsJson(res);
    } catch (error) {
        handleError(error);
    }
}

async function deleteData(url: string) {
    try {
        const res = await fetch(url, {
            method: "DELETE",
            credentials: "include"
        });
        if (!res.ok) throw res;

        await sleep();
        return checkIfResponseIsJson(res);
    } catch (error) {
        handleError(error);
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
            break;
        case 401:
            toast.error(response.title);
            break;
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
    get: async (url: string) => {
        try {
            return await getData(baseURL + url)
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
    getAll: () => requests.get("products"),
    getById: (id: number) => requests.get("products/" + id),
}

const TestErrors = {
    get400: () => requests.get("buggy/bad-request"),
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
    removeItem: (productId: number, qty = 1) => requests.delete(`cart?productId=${productId}&qty=${qty}`),
}

// export
const agent = {
    Catalogue,
    TestErrors,
    Cart
}

export default agent;