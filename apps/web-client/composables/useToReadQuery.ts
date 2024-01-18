const fetchToReadQuery = (page: number, pageSize: number) => {
  type Response = {
    results: ToReadDto[];
    total: number;
  };
  return $fetch<Response>(
    `http://0.0.0.0:4000/api/to-read?page=${page}&per_page=${pageSize}`
  );
};

export const useToReadPaginatedQuery = (page: number, pageSize: number) =>
  useQuery({
    queryKey: ["to-reads", page, pageSize],
    queryFn: () => fetchToReadQuery(page, pageSize),
  });

export const useNewToReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newToRead: CreateToReadDto) => {
      const response = await $fetch<ToReadDto>(
        "http://0.0.0.0:4000/api/to-read",
        { method: "POST", body: JSON.stringify(newToRead) }
      );

      queryClient.invalidateQueries({ queryKey: ["to-reads"] });

      return response;
    },
  });
};

export const useUpdateToReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateToRead: UpdateToReadDto & { id: number }) => {
      const response = await $fetch<ToReadDto>(
        `http://0.0.0.0:4000/api/to-read/${updateToRead.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            discord_id: updateToRead.discord_id,
            url: updateToRead.url,
            readed: updateToRead.readed,
            tags: updateToRead.tags,
            name: updateToRead.name,
          } satisfies UpdateToReadDto),
        }
      );

      queryClient.invalidateQueries({ queryKey: ["to-reads"] });

      return response;
    },
  });
};

export const useDeleteToReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await $fetch<ToReadDto>(
        `http://0.0.0.0:4000/api/to-read/${id}`,
        { method: "delete" }
      );

      queryClient.invalidateQueries({ queryKey: ["to-reads"] });

      return response;
    },
  });
};
