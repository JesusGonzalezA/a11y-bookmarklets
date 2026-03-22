export const ROUTES = {
  HOME: "/",
  BUILDER: "/builder",
  BOOKMARKLET_DETAIL: (id: string) => `/${id}`,
  TEST_PAGE: (id: string) => `/${id}/test`,
} as const;
