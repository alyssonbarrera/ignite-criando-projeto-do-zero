import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import Header from '../components/Header';
import styles from './home.module.scss';
import { useState } from 'react';
import Link from 'next/link';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

import * as Prismic from '@prismicio/client';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination } : HomeProps ) {

  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleNextPage() {
    const postsNextPage = await fetch(nextPage)
    .then(res => res.json());
    setNextPage(postsNextPage.next_page);
    setPosts([...posts, ...postsNextPage.results]);
  }

  return (
    <>
      <main className={styles.container}>
      <header className={styles.header}>
        <Header />
      </header>
          {posts.map(post => (
            <div key={post.uid} className={styles.post}>
              <Link href={`/post/${post.uid}`}>
                <a>
                  <h2>{post.data.title}</h2>
                  <h3>{post.data.subtitle}</h3>
                  <div className={styles.info}>
                    <div> <img src="/calendar.png" alt="calendar" /> <time>{format(new Date(post.first_publication_date), 'dd MMM yyyy', { locale: ptBR })}</time></div> <div> <img src="/user.png" alt="user" /> <p>{post.data.author}</p></div> 
                  </div>
                </a>
              </Link>
            </div>
          ))}
          {
            postsPagination.next_page !== null &&
            <div className={styles.divButton}>
              <button type='button' onClick={handleNextPage}>
                Carregar mais posts
              </button>
            </div>
          }
      </main>
    </>
  )
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.getByType('posts',
    {
      pageSize: 1,
    }
  );

  const post = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    }
  })

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: post
      }
    }
  }
};
