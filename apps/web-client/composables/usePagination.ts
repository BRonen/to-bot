// TODO: add pagination data on the endpoints result

export const usePagination = () =>
  reactive({
    page: 1,
    pageSize: 10,
    orderBy: "id",
    query: "",
  });
