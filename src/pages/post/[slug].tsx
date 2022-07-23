import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import * as Prismic from '@prismicio/client'

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {

  const router = useRouter();

  if(router.isFallback) {
    return <h1>Carregando...</h1>
  }

  return (
    <>
      <header className={styles.header}>
        <Header />
      </header>
      <main className={styles.container}>

        <figure>
          <img src={post.data.banner.url} alt="banner" />
        </figure>

        <article>

          <header>
            <h1>{post.data.title}</h1>

            <div>
              <div><img src="/calendar.png" alt="calendar" /> <time>{format(new Date(post.first_publication_date), 'dd MMM yyyy', { locale: ptBR })}</time></div>
              <div><img src="/user.png" alt="user" /> <p> {post.data.author}</p></div>
              <div><img src="/clock.png" alt="clock" /><time>4 min</time></div>
            </div>
            
            </header>

            <section>

              {post.data.content.map(item => (
                <div key={item.heading}>
                  <h2>{item.heading}</h2>
                  <div 
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(item.body)
                    }}
                  />
                </div>
              ))}
              
            </section>

        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {

  const prismic = getPrismicClient();
  const posts = await prismic.getByType('posts')

  return {
    paths: posts.results.map(post => ({
      params: {
        slug: post.uid
      }
    })),
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  console.log(response)

  const post = {
    uid: response.uid,
    first_publication_date: "2021-03-25T19:25:28+0000",
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      subtitle: response.data.subtitle,
      author: response.data.author,
      content: response.data.content,
    },
  }


  return {
    props: {
      post
    },
    revalidate: 60 * 30 // 30 minutes
  }
};