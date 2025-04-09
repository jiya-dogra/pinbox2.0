'use client'

import { useRouter } from 'next/navigation';
import style from '../styles/landingpage.module.css';

export default function LandingPage() {

  const router = useRouter();

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <p
          style={{
            fontSize: '4em',
            marginTop: '1em'
          }}>Welcome to Pinbox</p>
        <p
          style={{
            fontSize: '2em',
            marginTop: '2em'
          }}>A smart team collaboration and management platform built for</p>
        <p
          style={{
            fontSize: '2em'
          }}>you and your company</p>
        <p
          style={{
            paddingBlock: '1em',
            fontSize: '2em'
          }}>Start by registering your company</p>
        <button
          className={style.button}
          onClick={() => router.push('/register')}
        >Register Your Company → </button>
      </div>
    </div>
  );
}
