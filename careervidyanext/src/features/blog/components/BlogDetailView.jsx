// "use client";

// import Image from "next/image";
// import BlogHeader from "@/app/layout/BlogHeader.jsx";
// import Footer from "@/app/layout/Footer.jsx";
// import Blogget from "@/app/components/Blogget.jsx";
// import { useBlogDetail } from "../hooks/useBlogDetail.js";
// import { estimateReadingTime } from "../services/blogService.js";

// const safeImage = (url) => (url ? url : "/placeholder.jpg");

// /** @param {{ slug: string, initialBlog: object }} props */
// export default function BlogDetailView({ slug, initialBlog }) {
//   const { data } = useBlogDetail(slug, { success: true, data: initialBlog });
//   const blog = data?.data || initialBlog;

//   if (!blog) return null; // page.jsx already handles the not-found case server-side

//   const readingTime = estimateReadingTime(blog.content);

//   return (
//     <>
//       <BlogHeader />

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           {/* LEFT SIDE: MAIN CONTENT */}
//           <main className="lg:col-span-8">
//             <div className="flex gap-2 mb-2">
//               <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs uppercase font-bold">
//                 {blog.category}
//               </span>
//               {blog.is_verified && (
//                 <span className="text-green-600 text-xs">✓ Verified</span>
//               )}
//             </div>

//             <h1 className="text-3xl md:text-4xl font-bold leading-tight text-slate-900">
//               {blog.title}
//             </h1>

//             <div className="mt-2 flex flex-wrap justify-start md:justify-between items-center text-xs text-gray-400 gap-2">
//               <span>Published: {new Date(blog.createdAt).toDateString()}</span>
//               <span>Updated: {new Date(blog.updatedAt).toDateString()}</span>
//               <span>{readingTime} min read</span>
//               <span className="bg-slate-100 px-2 py-1 rounded">
//                 {blog.reads} Reads
//               </span>
//             </div>

//             {/* MAIN BLOG IMAGE */}
//             <div className="relative w-full aspect-[16/9] md:h-[450px] mt-4 rounded-xl overflow-hidden shadow-lg">
//               <Image
//                 src={safeImage(blog.image?.url)}
//                 alt={blog.title}
//                 fill
//                 priority
//                 className="object-contain md:object-cover"
//               />
//             </div>

//             {/* DYNAMIC CONTENT BLOCKS */}
//             <div className="mt-6 space-y-6">
//               {blog.content?.map((block, i) => {
//                 if (!block) return null;

//                 if (block.type === "heading") {
//                   const Tag = `h${block.level || 2}`;
//                   return (
//                     <Tag
//                       key={i}
//                       style={{ color: block.color, textAlign: block.align }}
//                       className="font-bold text-2xl"
//                     >
//                       {block.text}
//                     </Tag>
//                   );
//                 }

//                 if (block.type === "paragraph") {
//                   return (
//                     <p
//                       key={i}
//                       style={{ color: block.color, textAlign: block.align }}
//                       className="text-lg leading-relaxed text-slate-700"
//                     >
//                       {block.text}
//                     </p>
//                   );
//                 }

//                 if (block.type === "list") {
//                   return (
//                     <ul
//                       key={i}
//                       className="list-disc ml-6 space-y-1 text-slate-700"
//                     >
//                       {block.list_items?.map((li, index) => (
//                         <li key={index}>{li}</li>
//                       ))}
//                     </ul>
//                   );
//                 }

//                 if (block.type === "number_list") {
//                   return (
//                     <ol
//                       key={i}
//                       className="list-decimal ml-6 space-y-1 text-slate-700"
//                     >
//                       {block.list_items?.map((li, index) => (
//                         <li key={index}>{li}</li>
//                       ))}
//                     </ol>
//                   );
//                 }

//                 if (block.type === "image") {
//                   return (
//                     <div key={i} className="mt-4">
//                       <div className="relative w-full aspect-[16/9] md:h-[400px] rounded-xl overflow-hidden">
//                         <Image
//                           src={safeImage(block.media?.url)}
//                           alt={block.media?.caption || "blog image"}
//                           fill
//                           className="object-contain md:object-cover"
//                         />
//                       </div>
//                       {block.media?.caption && (
//                         <p className="text-center text-sm text-gray-500 mt-2 italic">
//                           {block.media.caption}
//                         </p>
//                       )}
//                     </div>
//                   );
//                 }

//                 if (block.type === "video") {
//                   return (
//                     <div key={i} className="mt-4">
//                       <video
//                         controls
//                         src={block.media?.url}
//                         className="w-full rounded-xl shadow-md"
//                       />
//                       {block.media?.caption && (
//                         <p className="text-center text-sm text-gray-500 mt-1">
//                           {block.media.caption}
//                         </p>
//                       )}
//                     </div>
//                   );
//                 }

//                 if (block.type === "table") {
//                   return (
//                     <div key={i} className="overflow-x-auto mt-4">
//                       <table className="w-full border-collapse border border-gray-200">
//                         <thead className="bg-gray-100">
//                           <tr>
//                             {block.table?.headers?.map((h, index) => (
//                               <th
//                                 key={index}
//                                 className="p-2 border border-gray-300 text-left"
//                               >
//                                 {h}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {block.table?.rows?.map((row, r) => (
//                             <tr key={r}>
//                               {row.map((cell, c) => (
//                                 <td
//                                   key={c}
//                                   className="p-2 border border-gray-300"
//                                 >
//                                   {cell}
//                                 </td>
//                               ))}
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   );
//                 }

//                 if (block.type === "quote") {
//                   return (
//                     <blockquote
//                       key={i}
//                       className="border-l-4 border-blue-500 pl-4 italic text-lg text-gray-700 mt-4 bg-blue-50 py-2 pr-4"
//                     >
//                       {block.text}
//                     </blockquote>
//                   );
//                 }

//                 if (block.type === "code") {
//                   return (
//                     <pre
//                       key={i}
//                       className="bg-slate-900 text-green-400 p-3 rounded-lg overflow-x-auto mt-4 font-mono text-sm"
//                     >
//                       <code>{block.text}</code>
//                     </pre>
//                   );
//                 }

//                 return null;
//               })}
//             </div>

//             {/* FAQ SECTION */}
//             {blog.faqs?.length > 0 && (
//               <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-6">
//                 <h2 className="text-xl font-bold mb-4 text-slate-900 border-b pb-2">
//                   Common Questions
//                 </h2>
//                 <div className="space-y-4">
//                   {blog.faqs.map((faq, i) => (
//                     <div key={i}>
//                       <h4 className="font-bold text-lg text-slate-800 flex gap-2">
//                         <span className="text-blue-600">Q.</span> {faq.question}
//                       </h4>
//                       <p className="text-slate-600 mt-1 pl-4">{faq.answer}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* AUTHOR DETAILS */}
//             <div className="mt-6 flex flex-col md:flex-row items-center md:items-start gap-4 p-6 bg-white border rounded-2xl shadow-sm">
//               <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-50 shadow-sm">
//                 <Image
//                   src={safeImage(blog.author?.profile_img?.url)}
//                   alt={blog.author?.name || "author"}
//                   fill
//                   className="object-contain"
//                 />
//               </div>
//               <div className="flex-1 text-center md:text-left">
//                 <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
//                   Written By
//                 </p>
//                 <p className="font-bold text-xl md:text-2xl text-slate-900">
//                   {blog.author?.name}
//                 </p>
//                 <p className="text-sm md:text-md text-slate-500 italic mb-2">
//                   {blog.author?.designation} • {blog.author?.specialization}
//                 </p>
//                 {blog.author?.description && (
//                   <p className="text-slate-600 leading-relaxed">
//                     {blog.author.description}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </main>

//           {/* RIGHT SIDEBAR */}
//           <aside className="lg:col-span-4">
//             <div className="sticky top-8 space-y-6">
//               <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                 <Blogget />
//               </div>
//             </div>
//           </aside>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }





// "use client";

// import Image from "next/image";
// import Link from "next/link";

// import BlogHeader from "@/app/layout/BlogHeader.jsx";
// import Footer from "@/app/layout/Footer.jsx";
// import Blogget from "@/app/components/Blogget.jsx";

// import { useBlogDetail } from "../hooks/useBlogDetail.js";
// import { estimateReadingTime } from "../services/blogService.js";

// const safeImage = (url) => (url ? url : "/placeholder.jpg");

// /*
//   Rich HTML renderer for blog content.

//   This is intentionally NOT RichTextField.
//   RichTextField is the admin editor.
//   Here we only render the HTML saved in database.
// */
// const RichTextContent = ({
//   html,
//   className = "",
//   style = {},
// }) => {
//   if (!html) return null;

//   return (
//     <div
//       style={style}
//       className={`
//         w-full
//         max-w-full
//         min-w-0
//         overflow-hidden
//         break-words
//         [overflow-wrap:anywhere]

//         /* Paragraphs */
//         [&_p]:break-words
//         [&_p]:max-w-full

//         /* Div / span */
//         [&_div]:max-w-full
//         [&_div]:break-words
//         [&_span]:break-words

//         /* Links */
//         [&_a]:text-blue-600
//         [&_a]:underline
//         [&_a]:font-medium
//         [&_a]:break-words
//         hover:[&_a]:text-blue-800

//         /* Images inserted from RichTextField */
//         [&_img]:block
//         [&_img]:max-w-full
//         [&_img]:h-auto
//         [&_img]:rounded-lg
//         [&_img]:mx-auto

//         /* Video */
//         [&_video]:block
//         [&_video]:w-full
//         [&_video]:max-w-full
//         [&_video]:h-auto
//         [&_video]:rounded-lg

//         /* iframe / YouTube */
//         [&_iframe]:block
//         [&_iframe]:w-full
//         [&_iframe]:max-w-full
//         [&_iframe]:aspect-video
//         [&_iframe]:min-h-[220px]
//         [&_iframe]:rounded-lg

//         /* Lists */
//         [&_ul]:max-w-full
//         [&_ol]:max-w-full
//         [&_li]:break-words
//         [&_li]:[overflow-wrap:anywhere]

//         /* Tables inside rich text */
//         [&_table]:max-w-full
//         [&_table]:border-collapse

//         /* Pre / Code */
//         [&_pre]:max-w-full
//         [&_pre]:overflow-x-auto
//         [&_pre]:whitespace-pre-wrap
//         [&_pre]:break-words
//         [&_code]:break-words

//         ${className}
//       `}
//       dangerouslySetInnerHTML={{ __html: html }}
//     />
//   );
// };

// /** @param {{ slug: string, initialBlog: object }} props */
// export default function BlogDetailView({ slug, initialBlog }) {
//   const { data } = useBlogDetail(slug, {
//     success: true,
//     data: initialBlog,
//   });

//   const blog = data?.data || initialBlog;

//   if (!blog) return null;

//   const readingTime = estimateReadingTime(blog.content);

//   return (
//     <>
//       <BlogHeader />

//       <div
//         className="
//           max-w-7xl
//           mx-auto
//           px-4
//           sm:px-5
//           lg:px-6
//           py-6
//           md:py-8
//           overflow-hidden
//         "
//       >
//         <div
//           className="
//             grid
//             grid-cols-1
//             lg:grid-cols-12
//             gap-6
//             lg:gap-8
//             min-w-0
//           "
//         >
//           {/* =====================================================
//               LEFT SIDE: MAIN CONTENT
//           ====================================================== */}
//           <main className="lg:col-span-8 min-w-0 max-w-full">

//             {/* CATEGORY */}
//             <div className="flex flex-wrap gap-2 mb-2">
//               <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs uppercase font-bold">
//                 {blog.category}
//               </span>

//               {blog.is_verified && (
//                 <span className="text-green-600 text-xs flex items-center">
//                   ✓ Verified
//                 </span>
//               )}
//             </div>

//             {/* TITLE */}
//             <h1
//               className="
//                 text-2xl
//                 sm:text-3xl
//                 md:text-4xl
//                 font-bold
//                 leading-tight
//                 text-slate-900
//                 break-words
//               "
//             >
//               {blog.title}
//             </h1>

//             {/* BLOG META */}
//             <div
//               className="
//                 mt-2
//                 flex
//                 flex-wrap
//                 justify-start
//                 md:justify-between
//                 items-center
//                 text-xs
//                 text-gray-400
//                 gap-2
//               "
//             >
//               <span>
//                 Published:{" "}
//                 {blog.createdAt
//                   ? new Date(blog.createdAt).toDateString()
//                   : "-"}
//               </span>

//               <span>
//                 Updated:{" "}
//                 {blog.updatedAt
//                   ? new Date(blog.updatedAt).toDateString()
//                   : "-"}
//               </span>

//               <span>{readingTime} min read</span>

//               <span className="bg-slate-100 px-2 py-1 rounded">
//                 {blog.reads || 0} Reads
//               </span>
//             </div>

//             {/* =====================================================
//                 MAIN BLOG IMAGE
//             ====================================================== */}
//             <div
//               className="
//                 relative
//                 w-full
//                 aspect-[16/9]
//                 md:h-[450px]
//                 mt-4
//                 rounded-xl
//                 overflow-hidden
//                 shadow-lg
//                 bg-gray-50
//               "
//             >
//               <Image
//                 src={safeImage(blog.image?.url)}
//                 alt={blog.title || "Blog image"}
//                 fill
//                 priority
//                 sizes="
//                   (max-width: 768px) 100vw,
//                   (max-width: 1024px) 70vw,
//                   800px
//                 "
//                 className="object-contain md:object-cover"
//               />
//             </div>

//             {/* =====================================================
//                 DYNAMIC CONTENT BLOCKS
//             ====================================================== */}
//             <div
//               className="
//                 mt-6
//                 space-y-6
//                 min-w-0
//                 max-w-full
//                 overflow-hidden
//               "
//             >
//               {blog.content?.map((block, i) => {
//                 if (!block) return null;

//                 /* =================================================
//                    HEADING
//                 ================================================== */
//                 if (block.type === "heading") {
//                   const level = Math.min(
//                     Math.max(Number(block.level) || 2, 1),
//                     6
//                   );

//                   const Tag = `h${level}`;

//                   return (
//                     <Tag
//                       key={i}
//                       style={{
//                         color: block.color,
//                         textAlign: block.align,
//                       }}
//                       className="
//                         font-bold
//                         leading-tight
//                         break-words
//                         [overflow-wrap:anywhere]
//                         text-xl
//                         sm:text-2xl
//                         md:text-3xl
//                       "
//                     >
//                       {block.text}
//                     </Tag>
//                   );
//                 }

//                 /* =================================================
//                    PARAGRAPH - RICH TEXT HTML
//                 ================================================== */
//                 if (block.type === "paragraph") {
//                   return (
//                     <RichTextContent
//                       key={i}
//                       html={block.text}
//                       style={{
//                         color: block.color,
//                         textAlign: block.align,
//                       }}
//                       className="
//                         text-base
//                         md:text-lg
//                         leading-relaxed
//                         text-slate-700
//                       "
//                     />
//                   );
//                 }

//                 /* =================================================
//                    BULLET LIST
//                 ================================================== */
//                 if (block.type === "list") {
//                   return (
//                     <ul
//                       key={i}
//                       className="
//                         list-disc
//                         ml-5
//                         md:ml-6
//                         space-y-2
//                         text-slate-700
//                         max-w-full
//                         break-words
//                         [overflow-wrap:anywhere]
//                       "
//                     >
//                       {block.list_items?.map((li, index) => (
//                         <li
//                           key={index}
//                           className="
//                             max-w-full
//                             break-words
//                             [overflow-wrap:anywhere]
//                           "
//                         >
//                           <RichTextContent
//                             html={li}
//                             className="
//                               inline
//                               text-base
//                               md:text-lg
//                             "
//                           />
//                         </li>
//                       ))}
//                     </ul>
//                   );
//                 }

//                 /* =================================================
//                    NUMBERED LIST
//                 ================================================== */
//                 if (block.type === "number_list") {
//                   return (
//                     <ol
//                       key={i}
//                       className="
//                         list-decimal
//                         ml-5
//                         md:ml-6
//                         space-y-2
//                         text-slate-700
//                         max-w-full
//                         break-words
//                         [overflow-wrap:anywhere]
//                       "
//                     >
//                       {block.list_items?.map((li, index) => (
//                         <li
//                           key={index}
//                           className="
//                             max-w-full
//                             break-words
//                             [overflow-wrap:anywhere]
//                           "
//                         >
//                           <RichTextContent
//                             html={li}
//                             className="
//                               inline
//                               text-base
//                               md:text-lg
//                             "
//                           />
//                         </li>
//                       ))}
//                     </ol>
//                   );
//                 }

//                 /* =================================================
//                    IMAGE BLOCK
//                 ================================================== */
//                 if (block.type === "image") {
//                   return (
//                     <div
//                       key={i}
//                       className="
//                         mt-4
//                         w-full
//                         max-w-full
//                         overflow-hidden
//                       "
//                     >
//                       <div
//                         className="
//                           relative
//                           w-full
//                           aspect-[16/9]
//                           md:h-[400px]
//                           rounded-xl
//                           overflow-hidden
//                           bg-gray-50
//                         "
//                       >
//                         <Image
//                           src={safeImage(block.media?.url)}
//                           alt={
//                             block.media?.caption ||
//                             "blog image"
//                           }
//                           fill
//                           sizes="
//                             (max-width: 768px) 100vw,
//                             800px
//                           "
//                           className="object-contain md:object-cover"
//                         />
//                       </div>

//                       {block.media?.caption && (
//                         <p
//                           className="
//                             text-center
//                             text-sm
//                             text-gray-500
//                             mt-2
//                             italic
//                             break-words
//                           "
//                         >
//                           {block.media.caption}
//                         </p>
//                       )}
//                     </div>
//                   );
//                 }

//                 /* =================================================
//                    VIDEO BLOCK
//                 ================================================== */
//                 if (block.type === "video") {
//                   return (
//                     <div
//                       key={i}
//                       className="
//                         mt-4
//                         w-full
//                         max-w-full
//                         overflow-hidden
//                       "
//                     >
//                       <video
//                         controls
//                         preload="metadata"
//                         src={block.media?.url}
//                         className="
//                           block
//                           w-full
//                           max-w-full
//                           h-auto
//                           rounded-xl
//                           shadow-md
//                         "
//                       />

//                       {block.media?.caption && (
//                         <p
//                           className="
//                             text-center
//                             text-sm
//                             text-gray-500
//                             mt-1
//                             break-words
//                           "
//                         >
//                           {block.media.caption}
//                         </p>
//                       )}
//                     </div>
//                   );
//                 }

//                 /* =================================================
//                    TABLE BLOCK
//                 ================================================== */
//                 if (block.type === "table") {
//                   return (
//                     <div
//                       key={i}
//                       className="
//                         overflow-x-auto
//                         overflow-y-hidden
//                         mt-4
//                         max-w-full
//                         rounded-lg
//                         border
//                         border-gray-200
//                       "
//                     >
//                       <table
//                         className="
//                           w-full
//                           min-w-[600px]
//                           md:min-w-full
//                           border-collapse
//                           border
//                           border-gray-200
//                         "
//                       >
//                         <thead className="bg-gray-100">
//                           <tr>
//                             {block.table?.headers?.map(
//                               (h, index) => (
//                                 <th
//                                   key={index}
//                                   className="
//                                     p-2
//                                     md:p-3
//                                     border
//                                     border-gray-300
//                                     text-left
//                                     text-sm
//                                     md:text-base
//                                     break-words
//                                   "
//                                 >
//                                   {h}
//                                 </th>
//                               )
//                             )}
//                           </tr>
//                         </thead>

//                         <tbody>
//                           {block.table?.rows?.map(
//                             (row, r) => (
//                               <tr key={r}>
//                                 {row.map((cell, c) => (
//                                   <td
//                                     key={c}
//                                     className="
//                                       p-2
//                                       md:p-3
//                                       border
//                                       border-gray-300
//                                       text-sm
//                                       md:text-base
//                                       break-words
//                                     "
//                                   >
//                                     {cell}
//                                   </td>
//                                 ))}
//                               </tr>
//                             )
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   );
//                 }

//                 /* =================================================
//                    QUOTE - RICH TEXT HTML
//                 ================================================== */
//                 if (block.type === "quote") {
//                   return (
//                     <blockquote
//                       key={i}
//                       className="
//                         border-l-4
//                         border-blue-500
//                         pl-3
//                         md:pl-4
//                         italic
//                         text-base
//                         md:text-lg
//                         text-gray-700
//                         mt-4
//                         bg-blue-50
//                         py-3
//                         pr-3
//                         md:pr-4
//                         max-w-full
//                         overflow-hidden
//                       "
//                     >
//                       <RichTextContent
//                         html={block.text}
//                         className="text-gray-700"
//                       />
//                     </blockquote>
//                   );
//                 }

//                 /* =================================================
//                    CODE BLOCK
//                 ================================================== */
//                 if (block.type === "code") {
//                   return (
//                     <pre
//                       key={i}
//                       className="
//                         bg-slate-900
//                         text-green-400
//                         p-3
//                         md:p-4
//                         rounded-lg
//                         overflow-x-auto
//                         mt-4
//                         font-mono
//                         text-xs
//                         md:text-sm
//                         max-w-full
//                         whitespace-pre-wrap
//                         break-words
//                       "
//                     >
//                       <code>{block.text}</code>
//                     </pre>
//                   );
//                 }

//                 return null;
//               })}
//             </div>

//             {/* =====================================================
//                 FAQ SECTION
//             ====================================================== */}
//             {blog.faqs?.length > 0 && (
//               <div
//                 className="
//                   mt-6
//                   bg-slate-50
//                   border
//                   border-slate-200
//                   rounded-2xl
//                   p-4
//                   md:p-6
//                   overflow-hidden
//                 "
//               >
//                 <h2
//                   className="
//                     text-lg
//                     md:text-xl
//                     font-bold
//                     mb-4
//                     text-slate-900
//                     border-b
//                     pb-2
//                     break-words
//                   "
//                 >
//                   Common Questions
//                 </h2>

//                 <div className="space-y-5">
//                   {blog.faqs.map((faq, i) => (
//                     <div
//                       key={i}
//                       className="min-w-0 max-w-full"
//                     >
//                       <h4
//                         className="
//                           font-bold
//                           text-base
//                           md:text-lg
//                           text-slate-800
//                           flex
//                           gap-2
//                           break-words
//                         "
//                       >
//                         <span className="text-blue-600 flex-shrink-0">
//                           Q.
//                         </span>

//                         <span className="break-words">
//                           {faq.question}
//                         </span>
//                       </h4>

//                       <RichTextContent
//                         html={faq.answer}
//                         className="
//                           text-slate-600
//                           mt-1
//                           pl-0
//                           md:pl-4
//                           text-sm
//                           md:text-base
//                           leading-relaxed
//                         "
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* =====================================================
//                 AUTHOR DETAILS
//             ====================================================== */}
//             <div
//               className="
//                 mt-6
//                 flex
//                 flex-col
//                 md:flex-row
//                 items-center
//                 md:items-start
//                 gap-4
//                 p-4
//                 md:p-6
//                 bg-white
//                 border
//                 rounded-2xl
//                 shadow-sm
//                 overflow-hidden
//               "
//             >
//               <div
//                 className="
//                   relative
//                   w-20
//                   h-20
//                   rounded-full
//                   overflow-hidden
//                   flex-shrink-0
//                   border-2
//                   border-gray-50
//                   shadow-sm
//                 "
//               >
//                 <Image
//                   src={safeImage(
//                     blog.author?.profile_img?.url
//                   )}
//                   alt={
//                     blog.author?.name || "author"
//                   }
//                   fill
//                   sizes="80px"
//                   className="object-contain"
//                 />
//               </div>

//               <div
//                 className="
//                   flex-1
//                   min-w-0
//                   text-center
//                   md:text-left
//                   max-w-full
//                 "
//               >
//                 <p
//                   className="
//                     text-xs
//                     font-bold
//                     text-blue-600
//                     uppercase
//                     tracking-widest
//                     mb-1
//                   "
//                 >
//                   Written By
//                 </p>

//                 <p
//                   className="
//                     font-bold
//                     text-xl
//                     md:text-2xl
//                     text-slate-900
//                     break-words
//                   "
//                 >
//                   {blog.author?.name}
//                 </p>

//                 <p
//                   className="
//                     text-sm
//                     md:text-md
//                     text-slate-500
//                     italic
//                     mb-2
//                     break-words
//                   "
//                 >
//                   {blog.author?.designation}
//                   {" • "}
//                   {blog.author?.specialization}
//                 </p>

//                 {blog.author?.description && (
//                   <RichTextContent
//                     html={blog.author.description}
//                     className="
//                       text-slate-600
//                       leading-relaxed
//                       text-sm
//                       md:text-base
//                     "
//                   />
//                 )}
//               </div>
//             </div>

//             {/* =====================================================
//                 CONTINUE EXPLORING
//             ====================================================== */}
//             <div
//               className="
//                 mt-6
//                 flex
//                 flex-wrap
//                 items-center
//                 gap-3
//                 p-4
//                 md:p-6
//                 bg-slate-50
//                 border
//                 border-slate-200
//                 rounded-2xl
//                 overflow-hidden
//               "
//             >
//               <Link
//                 href="/blog"
//                 className="text-blue-600 font-semibold hover:underline"
//               >
//                 ← Back to Blog
//               </Link>

//               <span className="text-slate-300 hidden sm:inline">
//                 |
//               </span>

//               <Link
//                 href="/explore"
//                 className="text-blue-600 font-semibold hover:underline"
//               >
//                 Explore Courses →
//               </Link>

//               <span className="text-slate-300 hidden sm:inline">
//                 |
//               </span>

//               <Link
//                 href="/topunivers"
//                 className="text-blue-600 font-semibold hover:underline"
//               >
//                 Browse Universities →
//               </Link>
//             </div>
//           </main>

//         {/* RIGHT SIDEBAR */}
// <aside className="lg:col-span-4 min-w-0">
//   <div className="lg:sticky lg:top-6">
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//       <Blogget />
//     </div>
//   </div>
// </aside>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }



"use client";

import Image from "next/image";
import Link from "next/link";

import BlogHeader from "@/app/layout/BlogHeader.jsx";
import Footer from "@/app/layout/Footer.jsx";
import Blogget from "@/app/components/Blogget.jsx";

import { useBlogDetail } from "../hooks/useBlogDetail.js";
import { estimateReadingTime } from "../services/blogService.js";

const safeImage = (url) => (url ? url : "/placeholder.jpg");

/*
  Rich HTML renderer for blog content.

  RichTextField is only used in Admin.
  Here we only render HTML saved in database.
*/
const RichTextContent = ({
  html,
  className = "",
  style = {},
}) => {
  if (!html) return null;

  return (
    <div
      style={style}
      className={`
        w-full
        max-w-full
        min-w-0
        overflow-hidden
        break-words
        [overflow-wrap:anywhere]

        [&_p]:break-words
        [&_p]:max-w-full

        [&_div]:max-w-full
        [&_div]:break-words
        [&_span]:break-words

        [&_a]:text-blue-600
        [&_a]:underline
        [&_a]:font-medium
        [&_a]:break-words
        hover:[&_a]:text-blue-800

        [&_img]:block
        [&_img]:max-w-full
        [&_img]:h-auto
        [&_img]:rounded-lg
        [&_img]:mx-auto

        [&_video]:block
        [&_video]:w-full
        [&_video]:max-w-full
        [&_video]:h-auto
        [&_video]:rounded-lg

        [&_iframe]:block
        [&_iframe]:w-full
        [&_iframe]:max-w-full
        [&_iframe]:aspect-video
        [&_iframe]:min-h-[220px]
        [&_iframe]:rounded-lg

        [&_ul]:max-w-full
        [&_ol]:max-w-full
        [&_li]:break-words
        [&_li]:[overflow-wrap:anywhere]

        [&_table]:max-w-full
        [&_table]:border-collapse

        [&_pre]:max-w-full
        [&_pre]:overflow-x-auto
        [&_pre]:whitespace-pre-wrap
        [&_pre]:break-words

        [&_code]:break-words

        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/** @param {{ slug: string, initialBlog: object }} props */
export default function BlogDetailView({ slug, initialBlog }) {
  const { data } = useBlogDetail(slug, {
    success: true,
    data: initialBlog,
  });

  const blog = data?.data || initialBlog;

  if (!blog) return null;

  const readingTime = estimateReadingTime(blog.content);

  return (
    <>
      <BlogHeader />

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-5
          lg:px-6
          py-6
          md:py-8
          overflow-hidden
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-6
            lg:gap-8
            min-w-0
            items-start
          "
        >
          {/* =====================================================
              LEFT SIDE - ONLY THIS SECTION WILL SCROLL
          ====================================================== */}
          <main
            className="
              lg:col-span-8
              min-w-0
              max-w-full

              lg:h-[calc(100vh-110px)]
              lg:overflow-y-auto
              lg:overflow-x-hidden

              lg:pr-3

              [scrollbar-width:thin]
            "
          >
            {/* CATEGORY */}
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs uppercase font-bold">
                {blog.category}
              </span>

              {blog.is_verified && (
                <span className="text-green-600 text-xs flex items-center">
                  ✓ Verified
                </span>
              )}
            </div>

            {/* TITLE */}
            <h1
              className="
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-bold
                leading-tight
                text-slate-900
                break-words
              "
            >
              {blog.title}
            </h1>

            {/* BLOG META */}
            <div
              className="
                mt-2
                flex
                flex-wrap
                justify-start
                md:justify-between
                items-center
                text-xs
                text-gray-400
                gap-2
              "
            >
              <span>
                Published:{" "}
                {blog.createdAt
                  ? new Date(blog.createdAt).toDateString()
                  : "-"}
              </span>

              <span>
                Updated:{" "}
                {blog.updatedAt
                  ? new Date(blog.updatedAt).toDateString()
                  : "-"}
              </span>

              <span>{readingTime} min read</span>

              <span className="bg-slate-100 px-2 py-1 rounded">
                {blog.reads || 0} Reads
              </span>
            </div>

            {/* =====================================================
                MAIN BLOG IMAGE
            ====================================================== */}
            <div
              className="
                relative
                w-full
                aspect-[16/9]
                md:h-[450px]
                mt-4
                rounded-xl
                overflow-hidden
                shadow-lg
                bg-gray-50
              "
            >
              <Image
                src={safeImage(blog.image?.url)}
                alt={blog.title || "Blog image"}
                fill
                priority
                sizes="
                  (max-width: 768px) 100vw,
                  (max-width: 1024px) 70vw,
                  800px
                "
                className="object-contain md:object-cover"
              />
            </div>

            {/* =====================================================
                DYNAMIC CONTENT BLOCKS
            ====================================================== */}
            <div
              className="
                mt-6
                space-y-6
                min-w-0
                max-w-full
                overflow-hidden
              "
            >
              {blog.content?.map((block, i) => {
                if (!block) return null;

                /* HEADING */
                if (block.type === "heading") {
                  const level = Math.min(
                    Math.max(Number(block.level) || 2, 1),
                    6
                  );

                  const Tag = `h${level}`;

                  return (
                    <Tag
                      key={i}
                      style={{
                        color: block.color,
                        textAlign: block.align,
                      }}
                      className="
                        font-bold
                        leading-tight
                        break-words
                        [overflow-wrap:anywhere]
                        text-xl
                        sm:text-2xl
                        md:text-3xl
                      "
                    >
                      {block.text}
                    </Tag>
                  );
                }

                /* PARAGRAPH */
                if (block.type === "paragraph") {
                  return (
                    <RichTextContent
                      key={i}
                      html={block.text}
                      style={{
                        color: block.color,
                        textAlign: block.align,
                      }}
                      className="
                        text-base
                        md:text-lg
                        leading-relaxed
                        text-slate-700
                      "
                    />
                  );
                }

                /* BULLET LIST */
                if (block.type === "list") {
                  return (
                    <ul
                      key={i}
                      className="
                        list-disc
                        ml-5
                        md:ml-6
                        space-y-2
                        text-slate-700
                        max-w-full
                        break-words
                        [overflow-wrap:anywhere]
                      "
                    >
                      {block.list_items?.map((li, index) => (
                        <li
                          key={index}
                          className="
                            max-w-full
                            break-words
                            [overflow-wrap:anywhere]
                          "
                        >
                          <RichTextContent
                            html={li}
                            className="
                              inline
                              text-base
                              md:text-lg
                            "
                          />
                        </li>
                      ))}
                    </ul>
                  );
                }

                /* NUMBERED LIST */
                if (block.type === "number_list") {
                  return (
                    <ol
                      key={i}
                      className="
                        list-decimal
                        ml-5
                        md:ml-6
                        space-y-2
                        text-slate-700
                        max-w-full
                        break-words
                        [overflow-wrap:anywhere]
                      "
                    >
                      {block.list_items?.map((li, index) => (
                        <li
                          key={index}
                          className="
                            max-w-full
                            break-words
                            [overflow-wrap:anywhere]
                          "
                        >
                          <RichTextContent
                            html={li}
                            className="
                              inline
                              text-base
                              md:text-lg
                            "
                          />
                        </li>
                      ))}
                    </ol>
                  );
                }

                /* IMAGE BLOCK */
                if (block.type === "image") {
                  return (
                    <div
                      key={i}
                      className="
                        mt-4
                        w-full
                        max-w-full
                        overflow-hidden
                      "
                    >
                      <div
                        className="
                          relative
                          w-full
                          aspect-[16/9]
                          md:h-[400px]
                          rounded-xl
                          overflow-hidden
                          bg-gray-50
                        "
                      >
                        <Image
                          src={safeImage(block.media?.url)}
                          alt={
                            block.media?.caption ||
                            "blog image"
                          }
                          fill
                          sizes="
                            (max-width: 768px) 100vw,
                            800px
                          "
                          className="object-contain md:object-cover"
                        />
                      </div>

                      {block.media?.caption && (
                        <p
                          className="
                            text-center
                            text-sm
                            text-gray-500
                            mt-2
                            italic
                            break-words
                          "
                        >
                          {block.media.caption}
                        </p>
                      )}
                    </div>
                  );
                }

                /* VIDEO BLOCK */
                if (block.type === "video") {
                  return (
                    <div
                      key={i}
                      className="
                        mt-4
                        w-full
                        max-w-full
                        overflow-hidden
                      "
                    >
                      <video
                        controls
                        preload="metadata"
                        src={block.media?.url}
                        className="
                          block
                          w-full
                          max-w-full
                          h-auto
                          rounded-xl
                          shadow-md
                        "
                      />

                      {block.media?.caption && (
                        <p
                          className="
                            text-center
                            text-sm
                            text-gray-500
                            mt-1
                            break-words
                          "
                        >
                          {block.media.caption}
                        </p>
                      )}
                    </div>
                  );
                }

                /* TABLE BLOCK */
                if (block.type === "table") {
                  return (
                    <div
                      key={i}
                      className="
                        overflow-x-auto
                        overflow-y-hidden
                        mt-4
                        max-w-full
                        rounded-lg
                        border
                        border-gray-200
                      "
                    >
                      <table
                        className="
                          w-full
                          min-w-[600px]
                          md:min-w-full
                          border-collapse
                          border
                          border-gray-200
                        "
                      >
                        <thead className="bg-gray-100">
                          <tr>
                            {block.table?.headers?.map(
                              (h, index) => (
                                <th
                                  key={index}
                                  className="
                                    p-2
                                    md:p-3
                                    border
                                    border-gray-300
                                    text-left
                                    text-sm
                                    md:text-base
                                    break-words
                                  "
                                >
                                  {h}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>

                        <tbody>
                          {block.table?.rows?.map(
                            (row, r) => (
                              <tr key={r}>
                                {row.map((cell, c) => (
                                  <td
                                    key={c}
                                    className="
                                      p-2
                                      md:p-3
                                      border
                                      border-gray-300
                                      text-sm
                                      md:text-base
                                      break-words
                                    "
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                /* QUOTE */
                if (block.type === "quote") {
                  return (
                    <blockquote
                      key={i}
                      className="
                        border-l-4
                        border-blue-500
                        pl-3
                        md:pl-4
                        italic
                        text-base
                        md:text-lg
                        text-gray-700
                        mt-4
                        bg-blue-50
                        py-3
                        pr-3
                        md:pr-4
                        max-w-full
                        overflow-hidden
                      "
                    >
                      <RichTextContent
                        html={block.text}
                        className="text-gray-700"
                      />
                    </blockquote>
                  );
                }

                /* CODE BLOCK */
                if (block.type === "code") {
                  return (
                    <pre
                      key={i}
                      className="
                        bg-slate-900
                        text-green-400
                        p-3
                        md:p-4
                        rounded-lg
                        overflow-x-auto
                        mt-4
                        font-mono
                        text-xs
                        md:text-sm
                        max-w-full
                        whitespace-pre-wrap
                        break-words
                      "
                    >
                      <code>{block.text}</code>
                    </pre>
                  );
                }

                return null;
              })}
            </div>

            {/* =====================================================
                FAQ SECTION
            ====================================================== */}
            {blog.faqs?.length > 0 && (
              <div
                className="
                  mt-6
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-2xl
                  p-4
                  md:p-6
                  overflow-hidden
                "
              >
                <h2
                  className="
                    text-lg
                    md:text-xl
                    font-bold
                    mb-4
                    text-slate-900
                    border-b
                    pb-2
                    break-words
                  "
                >
                  Common Questions
                </h2>

                <div className="space-y-5">
                  {blog.faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="min-w-0 max-w-full"
                    >
                      <h4
                        className="
                          font-bold
                          text-base
                          md:text-lg
                          text-slate-800
                          flex
                          gap-2
                          break-words
                        "
                      >
                        <span className="text-blue-600 flex-shrink-0">
                          Q.
                        </span>

                        <span className="break-words">
                          {faq.question}
                        </span>
                      </h4>

                      <RichTextContent
                        html={faq.answer}
                        className="
                          text-slate-600
                          mt-1
                          pl-0
                          md:pl-4
                          text-sm
                          md:text-base
                          leading-relaxed
                        "
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =====================================================
                AUTHOR DETAILS
            ====================================================== */}
            <div
              className="
                mt-6
                flex
                flex-col
                md:flex-row
                items-center
                md:items-start
                gap-4
                p-4
                md:p-6
                bg-white
                border
                rounded-2xl
                shadow-sm
                overflow-hidden
              "
            >
              <div
                className="
                  relative
                  w-20
                  h-20
                  rounded-full
                  overflow-hidden
                  flex-shrink-0
                  border-2
                  border-gray-50
                  shadow-sm
                "
              >
                <Image
                  src={safeImage(
                    blog.author?.profile_img?.url
                  )}
                  alt={
                    blog.author?.name || "author"
                  }
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>

              <div
                className="
                  flex-1
                  min-w-0
                  text-center
                  md:text-left
                  max-w-full
                "
              >
                <p
                  className="
                    text-xs
                    font-bold
                    text-blue-600
                    uppercase
                    tracking-widest
                    mb-1
                  "
                >
                  Written By
                </p>

                <p
                  className="
                    font-bold
                    text-xl
                    md:text-2xl
                    text-slate-900
                    break-words
                  "
                >
                  {blog.author?.name}
                </p>

                <p
                  className="
                    text-sm
                    md:text-md
                    text-slate-500
                    italic
                    mb-2
                    break-words
                  "
                >
                  {blog.author?.designation}
                  {" • "}
                  {blog.author?.specialization}
                </p>

                {blog.author?.description && (
                  <RichTextContent
                    html={blog.author.description}
                    className="
                      text-slate-600
                      leading-relaxed
                      text-sm
                      md:text-base
                    "
                  />
                )}
              </div>
            </div>

            {/* =====================================================
                CONTINUE EXPLORING
            ====================================================== */}
            <div
              className="
                mt-6
                flex
                flex-wrap
                items-center
                gap-3
                p-4
                md:p-6
                bg-slate-50
                border
                border-slate-200
                rounded-2xl
                overflow-hidden
              "
            >
              <Link
                href="/blog"
                className="text-blue-600 font-semibold hover:underline"
              >
                ← Back to Blog
              </Link>

              <span className="text-slate-300 hidden sm:inline">
                |
              </span>

              <Link
                href="/explore"
                className="text-blue-600 font-semibold hover:underline"
              >
                Explore Courses →
              </Link>

              <span className="text-slate-300 hidden sm:inline">
                |
              </span>

              <Link
                href="/topunivers"
                className="text-blue-600 font-semibold hover:underline"
              >
                Browse Universities →
              </Link>
            </div>
          </main>

          {/* =====================================================
              RIGHT SIDE - FORM STAYS FIXED/STICKY
          ====================================================== */}
          <aside
            className="
              lg:col-span-4
              min-w-0
              self-start
            "
          >
            <div
              className="
                lg:sticky
                lg:top-6
              "
            >
              <div
                className="
                  bg-white
                  rounded-xl
                  shadow-sm
                  border
                  border-gray-100
                  overflow-hidden
                "
              >
                <Blogget />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}

