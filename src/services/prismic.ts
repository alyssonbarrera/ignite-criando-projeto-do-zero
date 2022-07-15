import * as prismic from '@prismicio/client';
import { HttpRequestLike } from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';

export interface PrismicConfig {
  req?: HttpRequestLike;
}

export function getPrismicClient() {
  const client = prismic.createClient(process.env.PRISMIC_API_ENDPOINT);

  enableAutoPreviews({
    client
  })

  return client;
}
