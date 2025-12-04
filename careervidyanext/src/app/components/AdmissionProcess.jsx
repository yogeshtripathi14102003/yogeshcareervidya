"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utlis/api.js';

const AdmissionProcess = ({ slug }) => {
    const [admissionHeading, setAdmissionHeading] = useState("Admission Process");
    const [admissionSubHeading, setAdmissionSubHeading] = useState("");
    const [admissionDescription, setAdmissionDescription] = useState("");
    const [admissionPoints, setAdmissionPoints] = useState([]);
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

                const admission = data.admission || {};

                setAdmissionHeading(admission.admissionHeading || "Admission Process");
                setAdmissionSubHeading(admission.admissionSubHeading || "");
                setAdmissionDescription(admission.admissionDescription || "");
                setAdmissionPoints(admission.admissionPoints || []);

            } catch (err) {
                console.error("Error fetching admission data:", err);
                setError("Failed to load admission details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (isLoading) return <div style={styles.loading}>Loading admission process...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    return (
        <section style={styles.section}>
            <h2 style={styles.heading}>{admissionHeading}</h2>
            {admissionSubHeading && <h3 style={styles.subHeading}>{admissionSubHeading}</h3>}
            {admissionDescription && <p style={styles.description}>{admissionDescription}</p>}

            <div style={styles.stepsContainer}>
                {admissionPoints.map((point, index) => (
                    <div key={index} style={styles.stepItem}>
                        <div style={styles.stepNumber}>Step {index + 1}-</div>
                        <div style={styles.stepText}>{point}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const styles = {
    section: { padding: '40px 20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
    heading: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px', color: '#000' },
    subHeading: { fontSize: '1.5rem', fontWeight: '500', marginBottom: '15px', color: '#333' },
    description: { fontSize: '1.1rem', marginBottom: '30px', color: '#555', lineHeight: '1.6' },
    stepsContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
    stepItem: { display: 'flex', alignItems: 'flex-start', gap: '15px' },
    stepNumber: { backgroundColor: '#e7f1ff', color: '#007bff', fontWeight: '600', padding: '5px 10px', borderRadius: '5px', minWidth: '80px', textAlign: 'center' },
    stepText: { fontSize: '1.1rem', color: '#333', lineHeight: '1.5' },
    loading: { textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#007bff' },
    error: { textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#dc3545' },
};

export default AdmissionProcess;
