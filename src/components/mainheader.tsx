'use client'

import { useRouter } from "next/navigation";

export default function MainHeader() {
    const router = useRouter();

    return (
        <div className='nav-wrapper'>
            <p className='logo' onClick={() => router.push('/home')}>PINBOX</p>
            <nav className='nav'>
                <ul>
                    <li onClick={() => router.push('/home')}>Home</li>
                    <li onClick={() => router.push('/about')}>About</li>
                    <li onClick={() => router.push('/developers')}>Developers</li>
                    <li onClick={() => router.push('/contact')}>Contact</li>
                </ul>
            </nav>
            <p className='login' onClick={() => router.push('/login')}>Login</p>
        </div>
    );
}