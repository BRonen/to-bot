const fetchToReadKeywordsQuery = () => {
  type Response = {
    results: ToReadKeywordDto[];
    total: number;
  };
  return $fetch<Response>("http://0.0.0.0:4000/api/to-read/keywords");
};

export const useToReadKeywordsPaginatedQuery = () =>
  useQuery({
    queryKey: ["to-reads-keywords"],
    queryFn: fetchToReadKeywordsQuery,
  });

export const useNewToReadKeywordsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newToReadKeyword: CreateToReadKeywordDto) => {
      const response = await $fetch<ToReadKeywordDto>(
        "http://0.0.0.0:4000/api/to-read/keywords",
        { method: "POST", body: JSON.stringify(newToReadKeyword) }
      );

      queryClient.invalidateQueries({ queryKey: ["to-reads-keywords"] });

      return response;
    },
  });
};

export const useDeleteToReadKeywordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await $fetch<ToReadDto>(
        `http://0.0.0.0:4000/api/to-read/keywords/${id}`,
        { method: "delete" }
      );

      queryClient.invalidateQueries({ queryKey: ["to-reads"] });
      queryClient.invalidateQueries({ queryKey: ["to-reads-keywords"] });

      return response;
    },
  });
};
