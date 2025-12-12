export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: () => Promise.resolve(),
});

export const useSearchParams = () => new URLSearchParams();
export const usePathname = () => "/";
export const useParams = () => ({});
export const redirect = () => {};
