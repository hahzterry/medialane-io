export const connectHref = (pathname: string): string => `/connect?redirect_url=${encodeURIComponent(pathname)}`;
