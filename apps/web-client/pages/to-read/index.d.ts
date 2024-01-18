type ToReadDto = {
  id: number;
  discord_id: string;
  url: string;
  name: string;
  readed: boolean;
  tags?: string[];
  created_at: number;
  updated_at: number;
};

type CreateToReadDto = {
  discord_id: string | null;
  url: string;
  tags: number[];
  name: string;
};

type UpdateToReadDto = {
  discord_id?: string | null;
  url?: string;
  readed: boolean;
  tags?: number[];
  name?: string;
};

type ToReadKeywordDto = {
  id: number;
  tag: string;
  created_at: number;
  updated_at: number;
};

type CreateToReadKeywordDto = {
  tag: string;
};

type UpdateToReadKeywordDto = {
  tag: string;
};
