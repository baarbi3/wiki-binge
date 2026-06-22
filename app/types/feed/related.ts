
export type pageType = {
  ns: number,
  title: string,
  snippet: string,
  pageid: number,
  size: number,
  timestamp: string,
  wordcount: number,
}

export type ArticleEmbedding = {
  title: string;
  embedding: number[];
};

export type RelatedResponse = {
  pages: pageType[];
  embeddings: ArticleEmbedding[];
};