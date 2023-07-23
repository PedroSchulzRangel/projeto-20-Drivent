import { ApplicationError } from '@/protocols';

export function forbiddenError(): ApplicationError {
    return {
        name: "forbiddenError",
        message: "this request is forbidden!"
    };
}