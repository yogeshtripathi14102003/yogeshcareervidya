// "use client";

// import React, { useState, useEffect } from 'react';
// import api from '@/utlis/api.js';

// const BASE_URL = process.env.INTERNAL_API_URL || "";

// const RecognitionSection = ({ slug }) => {
//     const [recognitionHeading, setRecognitionHeading] = useState("");
//     const [recognitionDescription, setRecognitionDescription] = useState("");
//     const [recognitionPoints, setRecognitionPoints] = useState([]);
//     const [certificateImage, setCertificateImage] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!slug) return;
//             setIsLoading(true);
//             setError(null);

//             try {
//                 const res = await api.get(`/api/v1/university/slug/${slug}`);
//                 const data = res.data.data;

//                 // Access the nested recognition object
//                 const recognition = data.recognition || {};

//                 setRecognitionHeading(recognition.recognitionHeading || "Recognition");
//                 setRecognitionDescription(
//                     recognition.recognitionDescription ||
//                     "Earn a degree that is widely recognized around the globe."
//                 );
//                 setRecognitionPoints(recognition.recognitionPoints || []);

//                 // Properly handle relative path or full URL
//                 const imageUrl = recognition.certificateImage
//                     ? recognition.certificateImage.startsWith('http')
//                         ? recognition.certificateImage
//                         : `${BASE_URL.replace(/\/$/, '')}/${recognition.certificateImage.replace(/^\/+/, '')}`
//                     : null;

//                 setCertificateImage(imageUrl);

//             } catch (err) {
//                 console.error("Error fetching recognition data:", err);
//                 setError("Failed to load recognition details.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchData();
//     }, [slug]);

//     if (isLoading) return <div style={styles.loading}>Loading recognition details...</div>;
//     if (error) return <div style={styles.error}>{error}</div>;

//     return (
//         <section style={styles.section}>
//             <div style={styles.contentContainer}>
//                 {/* Left Column: Text */}
//                 <div style={styles.textColumn}>
//                     <h2 style={styles.heading}>{recognitionHeading}</h2>
//                     <p style={styles.description}>{recognitionDescription}</p>
//                     <ul style={styles.pointsList}>
//                         {recognitionPoints.map((point, index) => (
//                             <li key={index} style={styles.pointItem}>
//                                 <span style={styles.checkmark}>✅</span> {point}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>

//                 {/* Right Column: Certificate Image */}
//                 <div style={styles.imageColumn}>
//                     {certificateImage ? (
//                         // Intentionally a plain <img>: this is an admin-uploaded
//                         // certificate scan with unknown/varying aspect ratio per
//                         // university, and no fixed-size container. next/image
//                         // needs either explicit dimensions or a fill parent —
//                         // neither is safe to assume here without visual QA.
//                         <img src={certificateImage} alt="Sample Certificate" style={styles.certificateImage} />
//                     ) : (
//                         <div style={styles.noImagePlaceholder}>
//                             Certificate Image Not Available
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </section>
//     );
// };

// const styles = {
//     section: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
//     contentContainer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px' },
//     textColumn: { flex: '1 1 55%', minWidth: '300px' },
//     imageColumn: { flex: '1 1 35%', textAlign: 'center', paddingTop: '20px' },
//     heading: { fontSize: '1.5rem', marginBottom: '10px', fontWeight: 'bold', color: '#000' },
//     description: { fontSize: '1.2rem', marginBottom: '20px', color: '#333' },
//     pointsList: { listStyle: 'none', padding: 0 },
//     pointItem: { display: 'flex', alignItems: 'flex-start', fontSize: '1.1rem', marginBottom: '10px', lineHeight: '1.5' },
//     checkmark: { marginRight: '10px', color: '#28a745' },
//     certificateImage: { maxWidth: '100%', height: 'auto', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
//     noImagePlaceholder: { padding: '50px', border: '1px dashed #ccc', color: '#999', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' },
//     loading: { textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#007bff' },
//     error: { textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#dc3545' },
// };

// export default RecognitionSection;


"use client";

import { cleanHtml } from "@/utlis/cleanHtml.js";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

export default function UniversityCertificate({ data }) {
    const recognition = data?.recognition || {};
    const universityName = data?.name || "This University";

    const recognitionHeading =
        recognition.recognitionHeading ||
        `${universityName} Recognition & Accreditation`;

    const recognitionDescription =
        recognition.recognitionDescription ||
        `Earn a degree from ${universityName} that is widely recognized around the globe.`;

    const recognitionPoints = recognition.recognitionPoints || [];

    const certificateImage = recognition.certificateImage
        ? recognition.certificateImage.startsWith("http")
            ? recognition.certificateImage
            : `${BASE_URL.replace(/\/$/, "")}/${recognition.certificateImage.replace(
                  /^\/+/,
                  ""
              )}`
        : null;

    if (
        !recognition.recognitionHeading &&
        !recognitionPoints.length &&
        !certificateImage
    )
        return null;

    return (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        {recognitionHeading}
                    </h2>
                    <div
                        className="prose prose-sm max-w-none text-gray-700 mb-5"
                        dangerouslySetInnerHTML={{
                            __html: cleanHtml(recognitionDescription),
                        }}
                    />
                    <ul className="space-y-3">
                        {recognitionPoints.map((point, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-3 text-gray-700"
                            >
                                <span className="text-green-600 mt-0.5 shrink-0">
                                    ✅
                                </span>
                                <span
                                    className="text-base leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: cleanHtml(point),
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="lg:col-span-1">
                    {certificateImage ? (
                        <img
                            src={certificateImage}
                            alt={`${universityName} Sample Certificate`}
                            className="w-full rounded-xl border border-gray-200 shadow-md"
                        />
                    ) : (
                        <div className="w-full min-h-[200px] rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm bg-gray-50">
                            Certificate Not Available
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}