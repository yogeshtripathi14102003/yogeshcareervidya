"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utlis/api.js';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const RecognitionSection = ({ slug }) => {
    const [recognitionHeading, setRecognitionHeading] = useState("");
    const [recognitionDescription, setRecognitionDescription] = useState("");
    const [recognitionPoints, setRecognitionPoints] = useState([]);
    const [certificateImage, setCertificateImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            setIsLoading(true);
            setError(null);

            try {
                const res = await api.get(`/api/v1/university/slug/${slug}`);
                const data = res.data.data;

                // Access the nested recognition object
                const recognition = data.recognition || {};

                setRecognitionHeading(recognition.recognitionHeading || "Recognition");
                setRecognitionDescription(
                    recognition.recognitionDescription ||
                    "Earn a degree that is widely recognized around the globe."
                );
                setRecognitionPoints(recognition.recognitionPoints || []);

                // Properly handle relative path or full URL
                const imageUrl = recognition.certificateImage
                    ? recognition.certificateImage.startsWith('http')
                        ? recognition.certificateImage
                        : `${BASE_URL.replace(/\/$/, '')}/${recognition.certificateImage.replace(/^\/+/, '')}`
                    : null;

                setCertificateImage(imageUrl);

            } catch (err) {
                console.error("Error fetching recognition data:", err);
                setError("Failed to load recognition details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (isLoading) return <div style={styles.loading}>Loading recognition details...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    return (
        <section style={styles.section}>
            <div style={styles.contentContainer}>
                {/* Left Column: Text */}
                <div style={styles.textColumn}>
                    <h2 style={styles.heading}>{recognitionHeading}</h2>
                    <p style={styles.description}>{recognitionDescription}</p>
                    <ul style={styles.pointsList}>
                        {recognitionPoints.map((point, index) => (
                            <li key={index} style={styles.pointItem}>
                                <span style={styles.checkmark}>✅</span> {point}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Column: Certificate Image */}
                <div style={styles.imageColumn}>
                    {certificateImage ? (
                        <img src={certificateImage} alt="Sample Certificate" style={styles.certificateImage} />
                    ) : (
                        <div style={styles.noImagePlaceholder}>
                            Certificate Image Not Available
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
    contentContainer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px' },
    textColumn: { flex: '1 1 55%', minWidth: '300px' },
    imageColumn: { flex: '1 1 35%', textAlign: 'center', paddingTop: '20px' },
    heading: { fontSize: '1.5rem', marginBottom: '10px', fontWeight: 'bold', color: '#000' },
    description: { fontSize: '1.2rem', marginBottom: '20px', color: '#333' },
    pointsList: { listStyle: 'none', padding: 0 },
    pointItem: { display: 'flex', alignItems: 'flex-start', fontSize: '1.1rem', marginBottom: '10px', lineHeight: '1.5' },
    checkmark: { marginRight: '10px', color: '#28a745' },
    certificateImage: { maxWidth: '100%', height: 'auto', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
    noImagePlaceholder: { padding: '50px', border: '1px dashed #ccc', color: '#999', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' },
    loading: { textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#007bff' },
    error: { textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#dc3545' },
};

export default RecognitionSection;
