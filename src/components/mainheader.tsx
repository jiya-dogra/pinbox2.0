'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MainHeader() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`nav-wrapper ${scrolled ? 'scrolled' : ''}`}>
            <p className='logo'>PINBOX</p>
            <nav className='nav'>
                <ul>
                    <li onClick={() => router.push('/')}>Home</li>
                    <li onClick={() => router.push('/about')}>About</li>
                    <li onClick={() => router.push('/developers')}>Developers</li>
                    <li onClick={() => router.push('/contact')}>Contact</li>
                </ul>
            </nav>
            <p className='login' onClick={() => router.push('/login')}>Login</p>
        </div>
    );
}