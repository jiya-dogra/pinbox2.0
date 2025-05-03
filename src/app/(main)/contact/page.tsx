'use client';

import MainHeader from '@/src/components/mainheader';
import style from '@/src/styles/contact.module.css';
import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div>
            <MainHeader />
            <div className={style.wrapper}>
                <div className={style.content}>
                    <h1>Contact Us</h1>
                    <p className={style.subtitle}>
                        Have questions or feedback? We'd love to hear from you!
                    </p>

                    <div className={style.contactGrid}>
                        <div className={style.contactInfo}>
                            <h2>Get in Touch</h2>
                            <p>
                                <strong>Email:</strong>teddyonbed01@gmail.com<br />
                                <strong>Phone:</strong>+91 98182 83182<br />
                                <strong>Office Hours:</strong>Mon-Fri, 9AM-5PM
                            </p>

                            <h3>Follow Us</h3>
                            <div className={style.socialLinks}>
                                <a href="#" className={style.socialLink}>Twitter</a>
                                <a href="#" className={style.socialLink}>LinkedIn</a>
                                <a href="#" className={style.socialLink}>GitHub</a>
                            </div>
                        </div>

                        <div className={style.contactForm}>
                            {submitted ? (
                                <div className={style.successMessage}>
                                    <h3>Thank you for your message!</h3>
                                    <p>We'll get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className={style.formGroup}>
                                        <label htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className={style.formGroup}>
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className={style.formGroup}>
                                        <label htmlFor="message">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className={style.submitButton}>
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}