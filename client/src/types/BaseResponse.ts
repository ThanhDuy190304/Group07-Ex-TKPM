export type GetAllBaseResponse<T, K extends string> = {
    [key in K]: T[];
} & { total?: number };
