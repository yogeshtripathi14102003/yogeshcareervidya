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

//   RichTextField is only used in Admin.
//   Here we only render HTML saved in database.
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

//         [&_p]:break-words
//         [&_p]:max-w-full

//         [&_div]:max-w-full
//         [&_div]:break-words
//         [&_span]:break-words

//         [&_a]:text-blue-600
//         [&_a]:underline
//         [&_a]:font-medium
//         [&_a]:break-words
//         hover:[&_a]:text-blue-800

//         [&_img]:block
//         [&_img]:max-w-full
//         [&_img]:h-auto
//         [&_img]:rounded-lg
//         [&_img]:mx-auto

//         [&_video]:block
//         [&_video]:w-full
//         [&_video]:max-w-full
//         [&_video]:h-auto
//         [&_video]:rounded-lg

//         [&_iframe]:block
//         [&_iframe]:w-full
//         [&_iframe]:max-w-full
//         [&_iframe]:aspect-video
//         [&_iframe]:min-h-[220px]
//         [&_iframe]:rounded-lg

//         [&_ul]:max-w-full
//         [&_ol]:max-w-full
//         [&_li]:break-words
//         [&_li]:[overflow-wrap:anywhere]

//         [&_table]:max-w-full
//         [&_table]:border-collapse

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
//             items-start
//           "
//         >
//           {/* =====================================================
//               LEFT SIDE - ONLY THIS SECTION WILL SCROLL
//           ====================================================== */}
//           <main
//             className="
//               lg:col-span-8
//               min-w-0
//               max-w-full

//               lg:h-[calc(100vh-110px)]
//               lg:overflow-y-auto
//               lg:overflow-x-hidden

//               lg:pr-3

//               [scrollbar-width:thin]
//             "
//           >
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

//                 /* HEADING */
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

//                 /* PARAGRAPH */
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

//                 /* BULLET LIST */
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

//                 /* NUMBERED LIST */
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

//                 /* IMAGE BLOCK */
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
//                       <img
//                         src={safeImage(block.media?.url)}
//                         alt={
//                           block.media?.caption ||
//                           "blog image"
//                         }
//                         className="
//                           block
//                           w-full
//                           h-auto
//                           max-w-full
//                           rounded-xl
//                           shadow-md
//                           bg-gray-50
//                         "
//                       />

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

//                 /* VIDEO BLOCK */
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

//                 /* TABLE BLOCK */
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

//                 /* QUOTE */
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

//                 /* CODE BLOCK */
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

//           {/* =====================================================
//               RIGHT SIDE - FORM STAYS FIXED/STICKY
//           ====================================================== */}
//           <aside
//             className="
//               lg:col-span-4
//               min-w-0
//               self-start
//             "
//           >
//             <div
//               className="
//                 lg:sticky
//                 lg:top-6
//               "
//             >
//               <div
//                 className="
//                   bg-white
//                   rounded-xl
//                   shadow-sm
//                   border
//                   border-gray-100
//                   overflow-hidden
//                 "
//               >
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



"use client";

import Image from "next/image";
import Link from "next/link";

import BlogHeader from "@/app/layout/BlogHeader.jsx";
import Footer from "@/app/layout/Footer.jsx";
import Blogget from "@/app/components/Blogget.jsx";

import { useBlogDetail } from "../hooks/useBlogDetail.js";
import { estimateReadingTime } from "../services/blogService.js";

const safeImage = (url) => url || "/placeholder.jpg";

/* =========================================================
   RICH HTML CONTENT
   - Normal words stay intact
   - Long URLs/strings can wrap when required
   - No word-break: break-all
   - No overflow-wrap: anywhere
========================================================= */

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

        whitespace-normal
        break-words
        [overflow-wrap:break-word]
        [word-break:normal]

        [&_p]:max-w-full
        [&_p]:whitespace-normal
        [&_p]:break-words
        [&_p]:[overflow-wrap:break-word]
        [&_p]:[word-break:normal]

        [&_div]:max-w-full
        [&_div]:whitespace-normal
        [&_div]:break-words
        [&_div]:[overflow-wrap:break-word]
        [&_div]:[word-break:normal]

        [&_span]:whitespace-normal
        [&_span]:break-words
        [&_span]:[overflow-wrap:break-word]
        [&_span]:[word-break:normal]

        [&_strong]:font-bold
        [&_b]:font-bold

        [&_a]:text-blue-600
        [&_a]:underline
        [&_a]:font-medium
        [&_a]:break-words
        [&_a]:[overflow-wrap:break-word]
        [&_a]:[word-break:normal]
        hover:[&_a]:text-blue-800

        [&_ul]:list-disc
        [&_ul]:pl-6
        [&_ul]:mb-4

        [&_ol]:list-decimal
        [&_ol]:pl-6
        [&_ol]:mb-4

        [&_li]:whitespace-normal
        [&_li]:break-words
        [&_li]:[overflow-wrap:break-word]
        [&_li]:[word-break:normal]

        [&_h1]:font-bold
        [&_h2]:font-bold
        [&_h3]:font-bold
        [&_h4]:font-bold
        [&_h5]:font-bold
        [&_h6]:font-bold

        [&_img]:block
        [&_img]:max-w-full
        [&_img]:h-auto
        [&_img]:rounded-xl
        [&_img]:mx-auto

        [&_video]:block
        [&_video]:w-full
        [&_video]:max-w-full
        [&_video]:h-auto
        [&_video]:rounded-xl

        [&_iframe]:block
        [&_iframe]:w-full
        [&_iframe]:max-w-full
        [&_iframe]:aspect-video
        [&_iframe]:min-h-[220px]
        [&_iframe]:rounded-xl

        [&_pre]:max-w-full
        [&_pre]:overflow-x-auto
        [&_pre]:whitespace-pre-wrap

        [&_code]:whitespace-pre-wrap

        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/* =========================================================
   BLOG DETAIL VIEW
========================================================= */

/** @param {{ slug: string, initialBlog: object }} props */
export default function BlogDetailView({
  slug,
  initialBlog,
}) {
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

      {/* =====================================================
          PAGE
      ====================================================== */}
      <div className="w-full bg-[#f8fafc]">
        <div
          className="
            max-w-[1500px]
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-6
            md:py-10
          "
        >
          {/* =================================================
              MAIN GRID
          ================================================== */}
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-12
              gap-6
              lg:gap-8
              items-start
            "
          >
            {/* =================================================
                LEFT BLOG
            ================================================== */}
            <main className="lg:col-span-8 min-w-0">
              <article
                className="
                  w-full
                  min-w-0
                  bg-white
                  rounded-2xl
                  border
                  border-slate-200
                  shadow-sm
                  overflow-hidden
                "
              >
                {/* =================================================
                    ARTICLE HEADER
                ================================================== */}
                <div
                  className="
                    p-5
                    sm:p-7
                    md:p-8
                    min-w-0
                  "
                >
                  {/* CATEGORY */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {blog.category && (
                      <span
                        className="
                          inline-flex
                          items-center
                          bg-blue-50
                          text-blue-700
                          border
                          border-blue-100
                          px-3
                          py-1.5
                          rounded-full
                          text-xs
                          font-bold
                          uppercase
                          tracking-wide
                        "
                      >
                        {blog.category}
                      </span>
                    )}

                    {blog.is_verified && (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1
                          text-green-600
                          bg-green-50
                          border
                          border-green-100
                          px-3
                          py-1.5
                          rounded-full
                          text-xs
                          font-semibold
                        "
                      >
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
                      lg:text-[42px]
                      font-extrabold
                      leading-[1.15]
                      tracking-tight
                      text-slate-900

                      whitespace-normal
                      break-words
                      [overflow-wrap:break-word]
                      [word-break:normal]
                    "
                  >
                    {blog.title}
                  </h1>

                  {/* META */}
                  <div
                    className="
                      mt-5
                      flex
                      flex-wrap
                      items-center
                      gap-x-4
                      gap-y-2
                      text-xs
                      sm:text-sm
                      text-slate-500
                    "
                  >
                    {blog.createdAt && (
                      <span>
                        Published{" "}
                        <strong className="text-slate-700">
                          {new Date(
                            blog.createdAt
                          ).toDateString()}
                        </strong>
                      </span>
                    )}

                    {blog.updatedAt && (
                      <span>
                        Updated{" "}
                        <strong className="text-slate-700">
                          {new Date(
                            blog.updatedAt
                          ).toDateString()}
                        </strong>
                      </span>
                    )}

                    <span>
                      <strong className="text-slate-700">
                        {readingTime}
                      </strong>{" "}
                      min read
                    </span>

                    <span
                      className="
                        bg-slate-100
                        text-slate-600
                        px-2.5
                        py-1
                        rounded-md
                        font-medium
                      "
                    >
                      {blog.reads || 0} Reads
                    </span>
                  </div>
                </div>

                {/* =================================================
                    MAIN BLOG IMAGE
                ================================================== */}
                <div className="px-4 sm:px-6 md:px-8">
                  <div
                    className="
                      relative
                      w-full
                      aspect-[16/9]
                      rounded-xl
                      overflow-hidden
                      bg-slate-100
                      border
                      border-slate-100
                    "
                  >
                    <Image
                      src={safeImage(blog.image?.url)}
                      alt={blog.title || "Blog image"}
                      fill
                      priority
                      sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1024px) 75vw,
                        900px
                      "
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* =================================================
                    BLOG CONTENT
                ================================================== */}
                <div
                  className="
                    p-5
                    sm:p-7
                    md:p-8
                    min-w-0
                  "
                >
                  <div
                    className="
                      w-full
                      max-w-full
                      min-w-0
                      space-y-7
                    "
                  >
                    {blog.content?.map((block, i) => {
                      if (!block) return null;

                      /* ===========================================
                         HEADING
                      ============================================ */
                      if (block.type === "heading") {
                        const level = Math.min(
                          Math.max(
                            Number(block.level) || 2,
                            1
                          ),
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
                              font-extrabold
                              leading-tight
                              text-slate-900

                              whitespace-normal
                              break-words
                              [overflow-wrap:break-word]
                              [word-break:normal]

                              text-xl
                              sm:text-2xl
                              md:text-3xl
                              pt-2
                            "
                          >
                            {block.text}
                          </Tag>
                        );
                      }

                      /* ===========================================
                         PARAGRAPH
                      ============================================ */
                      if (block.type === "paragraph") {
                        return (
                          <RichTextContent
                            key={i}
                            html={block.text}
                            style={{
                              color:
                                block.color ||
                                undefined,
                              textAlign:
                                block.align ||
                                undefined,
                            }}
                            className="
                              text-[16px]
                              sm:text-[17px]
                              md:text-[18px]
                              leading-[1.85]
                            "
                          />
                        );
                      }

                      /* ===========================================
                         BULLET LIST
                      ============================================ */
                      if (block.type === "list") {
                        return (
                          <ul
                            key={i}
                            className="
                              list-disc
                              pl-6
                              sm:pl-7
                              space-y-3

                              text-slate-700
                              text-base
                              sm:text-lg
                              leading-relaxed

                              whitespace-normal
                              break-words
                              [overflow-wrap:break-word]
                              [word-break:normal]
                            "
                          >
                            {block.list_items?.map(
                              (li, index) => (
                                <li
                                  key={index}
                                  className="
                                    pl-1
                                    whitespace-normal
                                    break-words
                                    [overflow-wrap:break-word]
                                    [word-break:normal]
                                  "
                                >
                                  <RichTextContent
                                    html={li}
                                    className="
                                      inline
                                      text-base
                                      sm:text-lg
                                    "
                                  />
                                </li>
                              )
                            )}
                          </ul>
                        );
                      }

                      /* ===========================================
                         NUMBERED LIST
                      ============================================ */
                      if (
                        block.type === "number_list"
                      ) {
                        return (
                          <ol
                            key={i}
                            className="
                              list-decimal
                              pl-6
                              sm:pl-7
                              space-y-3

                              text-slate-700
                              text-base
                              sm:text-lg
                              leading-relaxed

                              whitespace-normal
                              break-words
                              [overflow-wrap:break-word]
                              [word-break:normal]
                            "
                          >
                            {block.list_items?.map(
                              (li, index) => (
                                <li
                                  key={index}
                                  className="
                                    pl-1
                                    whitespace-normal
                                    break-words
                                    [overflow-wrap:break-word]
                                    [word-break:normal]
                                  "
                                >
                                  <RichTextContent
                                    html={li}
                                    className="
                                      inline
                                      text-base
                                      sm:text-lg
                                    "
                                  />
                                </li>
                              )
                            )}
                          </ol>
                        );
                      }

                      /* ===========================================
                         IMAGE BLOCK
                      ============================================ */
                      if (block.type === "image") {
                        return (
                          <figure
                            key={i}
                            className="
                              w-full
                              max-w-full
                              min-w-0
                            "
                          >
                            <div
                              className="
                                w-full
                                max-w-full
                                overflow-hidden
                                rounded-xl
                                bg-slate-50
                                border
                                border-slate-100
                              "
                            >
                              <img
                                src={safeImage(
                                  block.media?.url
                                )}
                                alt={
                                  block.media?.caption ||
                                  "Blog image"
                                }
                                className="
                                  block
                                  w-full
                                  h-auto
                                  max-w-full
                                  object-contain
                                "
                              />
                            </div>

                            {block.media?.caption && (
                              <figcaption
                                className="
                                  text-center
                                  text-sm
                                  text-slate-500
                                  mt-2
                                  italic

                                  whitespace-normal
                                  break-words
                                  [overflow-wrap:break-word]
                                  [word-break:normal]
                                "
                              >
                                {block.media.caption}
                              </figcaption>
                            )}
                          </figure>
                        );
                      }

                      /* ===========================================
                         VIDEO BLOCK
                      ============================================ */
                      if (block.type === "video") {
                        return (
                          <figure
                            key={i}
                            className="
                              w-full
                              max-w-full
                              min-w-0
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
                                shadow-sm
                                bg-black
                              "
                            />

                            {block.media?.caption && (
                              <figcaption
                                className="
                                  text-center
                                  text-sm
                                  text-slate-500
                                  mt-2
                                  italic

                                  whitespace-normal
                                  break-words
                                  [overflow-wrap:break-word]
                                  [word-break:normal]
                                "
                              >
                                {block.media.caption}
                              </figcaption>
                            )}
                          </figure>
                        );
                      }

                      /* ===========================================
                         TABLE BLOCK
                      ============================================ */
                      if (block.type === "table") {
                        return (
                          <div
                            key={i}
                            className="
                              w-full
                              max-w-full
                              overflow-x-auto
                              overflow-y-hidden
                              rounded-xl
                              border
                              border-slate-200
                              shadow-sm
                            "
                          >
                            <table
                              className="
                                w-full
                                min-w-[620px]
                                border-collapse
                                text-sm
                                md:text-base
                              "
                            >
                              <thead>
                                <tr className="bg-slate-100">
                                  {block.table?.headers?.map(
                                    (h, index) => (
                                      <th
                                        key={index}
                                        className="
                                          p-3
                                          md:p-4
                                          border
                                          border-slate-200
                                          text-left
                                          font-bold
                                          text-slate-800
                                          whitespace-normal
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
                                    <tr
                                      key={r}
                                      className="
                                        odd:bg-white
                                        even:bg-slate-50
                                      "
                                    >
                                      {row.map(
                                        (cell, c) => (
                                          <td
                                            key={c}
                                            className="
                                              p-3
                                              md:p-4
                                              border
                                              border-slate-200
                                              text-slate-700
                                              align-top
                                              whitespace-normal
                                              break-words
                                            "
                                          >
                                            {cell}
                                          </td>
                                        )
                                      )}
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        );
                      }

                      /* ===========================================
                         QUOTE
                      ============================================ */
                      if (block.type === "quote") {
                        return (
                          <blockquote
                            key={i}
                            className="
                              border-l-4
                              border-blue-500
                              bg-blue-50
                              rounded-r-xl
                              px-4
                              sm:px-5
                              py-4

                              text-base
                              sm:text-lg
                              italic
                              text-slate-700

                              overflow-hidden
                              whitespace-normal
                              break-words
                              [overflow-wrap:break-word]
                              [word-break:normal]
                            "
                          >
                            <RichTextContent
                              html={block.text}
                              className="text-slate-700"
                            />
                          </blockquote>
                        );
                      }

                      /* ===========================================
                         CODE BLOCK
                      ============================================ */
                      if (block.type === "code") {
                        return (
                          <pre
                            key={i}
                            className="
                              w-full
                              max-w-full
                              overflow-x-auto
                              rounded-xl
                              bg-slate-950
                              text-green-400
                              p-4
                              sm:p-5
                              text-xs
                              sm:text-sm
                              leading-relaxed
                              font-mono

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
                </div>

                {/* =================================================
                    FAQ
                ================================================== */}
                {blog.faqs?.length > 0 && (
                  <div className="px-5 sm:px-7 md:px-8 pb-8">
                    <section
                      className="
                        bg-slate-50
                        border
                        border-slate-200
                        rounded-2xl
                        p-5
                        md:p-6
                      "
                    >
                      <h2
                        className="
                          text-xl
                          md:text-2xl
                          font-extrabold
                          text-slate-900
                          pb-3
                          border-b
                          border-slate-200
                          whitespace-normal
                          break-words
                        "
                      >
                        Common Questions
                      </h2>

                      <div className="mt-5 space-y-6">
                        {blog.faqs.map((faq, i) => (
                          <div
                            key={i}
                            className="
                              min-w-0
                              max-w-full
                            "
                          >
                            <h3
                              className="
                                flex
                                items-start
                                gap-2
                                text-base
                                md:text-lg
                                font-bold
                                text-slate-800
                                whitespace-normal
                                break-words
                                [overflow-wrap:break-word]
                                [word-break:normal]
                              "
                            >
                              <span className="text-blue-600 flex-shrink-0">
                                Q.
                              </span>

                              <span
                                className="
                                  whitespace-normal
                                  break-words
                                  [overflow-wrap:break-word]
                                  [word-break:normal]
                                "
                              >
                                {faq.question}
                              </span>
                            </h3>

                            <RichTextContent
                              html={faq.answer}
                              className="
                                mt-2
                                text-sm
                                md:text-base
                                leading-relaxed
                                text-slate-600
                                md:pl-6
                              "
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {/* =================================================
                    AUTHOR
                ================================================== */}
                <div className="px-5 sm:px-7 md:px-8 pb-8">
                  <section
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      items-center
                      sm:items-start
                      gap-5
                      p-5
                      md:p-6
                      bg-white
                      border
                      border-slate-200
                      rounded-2xl
                    "
                  >
                    {/* AUTHOR IMAGE */}
                    <div
                      className="
                        relative
                        w-20
                        h-20
                        rounded-full
                        overflow-hidden
                        flex-shrink-0
                        border-2
                        border-slate-100
                        bg-slate-50
                      "
                    >
                      <Image
                        src={safeImage(
                          blog.author?.profile_img?.url
                        )}
                        alt={
                          blog.author?.name ||
                          "Author"
                        }
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* AUTHOR INFO */}
                    <div
                      className="
                        flex-1
                        min-w-0
                        text-center
                        sm:text-left
                      "
                    >
                      <p
                        className="
                          text-xs
                          font-bold
                          text-blue-600
                          uppercase
                          tracking-widest
                        "
                      >
                        Written By
                      </p>

                      <p
                        className="
                          mt-1
                          text-xl
                          md:text-2xl
                          font-extrabold
                          text-slate-900
                          whitespace-normal
                          break-words
                          [overflow-wrap:break-word]
                          [word-break:normal]
                        "
                      >
                        {blog.author?.name}
                      </p>

                      {(blog.author?.designation ||
                        blog.author?.specialization) && (
                        <p
                          className="
                            mt-1
                            text-sm
                            md:text-base
                            text-slate-500
                            whitespace-normal
                            break-words
                            [overflow-wrap:break-word]
                            [word-break:normal]
                          "
                        >
                          {blog.author?.designation}

                          {blog.author?.designation &&
                            blog.author?.specialization &&
                            " • "}

                          {blog.author?.specialization}
                        </p>
                      )}

                      {blog.author?.description && (
                        <RichTextContent
                          html={
                            blog.author.description
                          }
                          className="
                            mt-3
                            text-sm
                            md:text-base
                            leading-relaxed
                            text-slate-600
                          "
                        />
                      )}
                    </div>
                  </section>
                </div>

                {/* =================================================
                    CONTINUE EXPLORING
                ================================================== */}
                <div className="px-5 sm:px-7 md:px-8 pb-8">
                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:flex-wrap
                      gap-3
                      p-4
                      md:p-5
                      bg-slate-50
                      border
                      border-slate-200
                      rounded-2xl
                    "
                  >
                    <Link
                      href="/blog"
                      className="
                        inline-flex
                        items-center
                        justify-center
                        px-4
                        py-2.5
                        rounded-lg
                        bg-white
                        border
                        border-slate-200
                        text-blue-600
                        font-semibold
                        hover:bg-blue-50
                        transition
                      "
                    >
                      ← Back to Blog
                    </Link>

                    <Link
                      href="/explore"
                      className="
                        inline-flex
                        items-center
                        justify-center
                        px-4
                        py-2.5
                        rounded-lg
                        bg-blue-600
                        text-white
                        font-semibold
                        hover:bg-blue-700
                        transition
                      "
                    >
                      Explore Courses →
                    </Link>

                    <Link
                      href="/topunivers"
                      className="
                        inline-flex
                        items-center
                        justify-center
                        px-4
                        py-2.5
                        rounded-lg
                        bg-white
                        border
                        border-slate-200
                        text-blue-600
                        font-semibold
                        hover:bg-blue-50
                        transition
                      "
                    >
                      Browse Universities →
                    </Link>
                  </div>
                </div>
              </article>
            </main>

            {/* =================================================
                RIGHT SIDEBAR
                STICKY AFTER SCROLL
            ================================================== */}
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
                  lg:top-24
                  w-full
                "
              >
                <div
                  className="
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    shadow-sm
                    overflow-hidden
                  "
                >
                  <Blogget />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

