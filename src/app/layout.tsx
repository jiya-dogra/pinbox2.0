'use client'

import { useRouter } from "next/navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();

  return (
    <html lang="en">
      <body>
        <div className='nav-wrapper'>
          <nav className='nav'>
            <ul>
              <li onClick={() => router.push('/')}>Home</li>
              <li onClick={() => router.push('/about')}>About</li>
              <li onClick={() => router.push('/developers')}>Developers</li>
              <li onClick={() => router.push('/contact')}>Contact</li>
            </ul>
          </nav>
        </div>
        {children}
      </body>
    </html>
  );
}
