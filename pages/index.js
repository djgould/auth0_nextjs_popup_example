import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { WebAuth, Auth0Result } from 'auth0-js'
import { useEffect, useState } from 'react'

const auth0 = new WebAuth({
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
  scope: 'openid profile',
  overrides: {
    __tenant: process.env.NEXT_PUBLIC_TENANT,
    __token_issuer: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/`, 
  }
})

export default function Home() {
  const [err, setError] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    auth0.checkSession({
      responseType: 'token id_token',
      redirectUri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI,
      audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    }, (err, authResult) => {
      if (err) return setError(err);
      auth0.client.userInfo(authResult.accessToken, (err, user) => {
        if (err) {
          setError()
          return console.log(err)
        }
        setUser(authResult.idTokenPayload.given_name)
        setError()
      })
    })
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome <a href="https://nextjs.org">{user ? user : 'Guest'}</a>
        </h1>

        <p className={styles.description}>
          {err ? err.error_description : ''}
        </p>

        <div className={styles.grid}>
          {!user && 
            <a onClick={() => auth0.popup.authorize({
              redirectUri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI,
              audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
              responseType: 'token id_token',
              connection: 'Username-Password-Authentication',
              sso: false,
            },
              (err, authResult) => {
                if (err) return console.log(err);
                setUser(authResult.idTokenPayload.given_name)
                setError()
              })} className={styles.card}>
              <h3>Login w/ Email&rarr;</h3>
              <p>Login with auth0.</p>
            </a>
          }

          <a onClick={() => auth0.logout({ returnTo: process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URI })}className={styles.card}>
            <h3>Logout &rarr;</h3>
            <p>Logout with auth0.</p>
          </a>

          {!user &&
            <a onClick={() => auth0.popup.authorize({
              redirectUri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI,
              audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
              responseType: 'token id_token',
              connection: 'google-oauth2',
            }, (err, authResult) => {
                if (err) console.log(err);
                console.log(authResult)
                setUser(authResult.idTokenPayload.given_name)
              })} className={styles.card}>
              <h3>Login w/ Google&rarr;</h3>
              <p>Login with auth0.</p>
            </a>
          }
          
          {!user &&
            <a onClick={() => auth0.popup.authorize({
              redirectUri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI,
              audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
              responseType: 'token id_token', connection: 'facebook'
            }, (err, authResult) => {
              if (err) console.log(err);
              setUser(authResult.idTokenPayload.given_name)
            })} className={styles.card}>
              <h3>Login w/ Facebook&rarr;</h3>
              <p>Login with auth0.</p>
            </a>
          }
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
