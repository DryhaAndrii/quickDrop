export const SMALL_API_URL = process.env.NEXT_PUBLIC_SMALL_API_URL;
export const BIG_API_URL = process.env.NEXT_PUBLIC_BIG_API_URL;

export const BIG_API_FILE_MAX_SIZE = parseInt(process.env.NEXT_PUBLIC_BIG_API_MAX_FILE_SIZE!) * 1024 * 1024;
export const SMALL_API_FILE_MAX_SIZE = parseInt(process.env.NEXT_PUBLIC_SMALL_API_MAX_FILE_SIZE!) * 1024 * 1024;
