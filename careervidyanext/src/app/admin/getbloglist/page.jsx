"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api";
import { Pencil, Trash2, X, Loader2, Save, Plus, Minus } from "lucide-react";

export default function BlogList() {

const [blogs,setBlogs] = useState([]);
const [loading,setLoading] = useState(true);

const [editingBlog,setEditingBlog] = useState(null);
const [isEditModalOpen,setIsEditModalOpen] = useState(false);

const [coverFile,setCoverFile] = useState(null);
const [authorFile,setAuthorFile] = useState(null);
const [contentFiles,setContentFiles] = useState({});

const [isSubmitting,setIsSubmitting] = useState(false);

/* ================= FETCH BLOGS ================= */

const fetchBlogs = async ()=>{

try{

const res = await api.get("/api/v1/blog");

setBlogs(res.data?.data || []);

}catch(err){

console.log(err);

}

setLoading(false);

};

useEffect(()=>{
fetchBlogs();
},[]);

/* ================= DELETE ================= */

const handleDelete = async(id)=>{

if(!confirm("Delete Blog?")) return;

try{

await api.delete(`/api/v1/blog/${id}`);

setBlogs(prev=>prev.filter(b=>b._id !== id));

}catch(err){

alert("Delete Failed");

}

};

/* ================= UPDATE ================= */

const handleUpdate = async(e)=>{

e.preventDefault();

setIsSubmitting(true);

try{

const formData = new FormData();

formData.append("jsonData",JSON.stringify(editingBlog));

if(coverFile){
formData.append("coverImage",coverFile);
}

if(authorFile){
formData.append("authorImage",authorFile);
}

Object.keys(contentFiles).forEach(i=>{
formData.append("contentImages",contentFiles[i])
})

await api.put(`/api/v1/blog/${editingBlog._id}`,formData,{
headers:{'Content-Type':'multipart/form-data'}
});

alert("Blog Updated");

fetchBlogs();

setIsEditModalOpen(false);

}catch(err){

console.log(err);
alert("Update Failed");

}

setIsSubmitting(false);

};

/* ================= CONTENT UPDATE ================= */

const updateContent = (index,key,value)=>{

const updated = [...editingBlog.content];

updated[index][key] = value;

setEditingBlog({...editingBlog,content:updated});

};

/* ================= ADD CONTENT ================= */

const addContent = ()=>{

setEditingBlog({

...editingBlog,

content:[

...editingBlog.content,

{
type:"paragraph",
text:"",
level:2,
color:"#000000",
align:"left",
list_items:[],
table:{headers:[],rows:[]},
media:{caption:""}
}

]

});

};

/* ================= REMOVE CONTENT ================= */

const removeContent = (index)=>{

const updated = editingBlog.content.filter((_,i)=>i!==index);

setEditingBlog({...editingBlog,content:updated});

};

/* ================= LOADING ================= */

if(loading){
return <div className="p-10 text-center">Loading...</div>;
}

/* ================= PAGE ================= */

return(

<div className="p-6 bg-slate-100 min-h-screen">

<h1 className="text-2xl font-bold mb-6">Blog Manager</h1>

<div className="bg-white rounded shadow overflow-hidden">

<table className="w-full">

<thead className="bg-slate-900 text-white">

<tr>

<th className="p-3 text-left">Title</th>
<th className="p-3 text-center">Category</th>
<th className="p-3 text-center">Reads</th>
<th className="p-3 text-center">Actions</th>

</tr>

</thead>

<tbody>

{blogs.map(blog=>(

<tr key={blog._id} className="border-b">

<td className="p-3 font-medium">
{blog.title}
</td>

<td className="p-3 text-center">
{blog.category}
</td>

<td className="p-3 text-center">
{blog.reads}
</td>

<td className="p-3 flex justify-center gap-2">

<button
onClick={()=>{

setEditingBlog(JSON.parse(JSON.stringify(blog)));
setIsEditModalOpen(true);

}}
className="p-2 border rounded text-blue-600"
>

<Pencil size={16}/>

</button>

<button
onClick={()=>handleDelete(blog._id)}
className="p-2 border rounded text-red-600"
>

<Trash2 size={16}/>

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* ================= EDIT MODAL ================= */}

{isEditModalOpen && editingBlog &&(

<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">

<div className="bg-white w-full max-w-6xl h-[90vh] rounded-lg flex flex-col overflow-hidden">

{/* HEADER */}

<div className="flex justify-between items-center p-4 bg-slate-900 text-white">

<h2 className="font-bold">
Edit Blog
</h2>

<button onClick={()=>setIsEditModalOpen(false)}>
<X/>
</button>

</div>

<form
onSubmit={handleUpdate}
className="flex-1 overflow-y-auto p-6 space-y-8"
>

{/* BASIC */}

<div className="grid grid-cols-2 gap-6">

<input
className="border p-2 rounded"
value={editingBlog.custom_id}
onChange={(e)=>setEditingBlog({...editingBlog,custom_id:e.target.value})}
/>

<input
className="border p-2 rounded"
value={editingBlog.category}
onChange={(e)=>setEditingBlog({...editingBlog,category:e.target.value})}
/>

<input
className="border p-2 rounded col-span-2"
value={editingBlog.title}
onChange={(e)=>setEditingBlog({...editingBlog,title:e.target.value})}
/>

<div>

<img
src={editingBlog.image?.url}
className="w-24 h-24 rounded object-cover"
/>

<input
type="file"
onChange={(e)=>setCoverFile(e.target.files[0])}
/>

</div>

</div>

{/* AUTHOR */}

<div>

<h3 className="font-bold mb-3">Author</h3>

<div className="grid grid-cols-2 gap-4">

<input
className="border p-2"
value={editingBlog.author?.name || ""}
onChange={(e)=>setEditingBlog({
...editingBlog,
author:{...editingBlog.author,name:e.target.value}
})}
/>

<input
className="border p-2"
value={editingBlog.author?.designation || ""}
onChange={(e)=>setEditingBlog({
...editingBlog,
author:{...editingBlog.author,designation:e.target.value}
})}
/>

<input
className="border p-2"
value={editingBlog.author?.specialization || ""}
onChange={(e)=>setEditingBlog({
...editingBlog,
author:{...editingBlog.author,specialization:e.target.value}
})}
/>

<input
className="border p-2"
value={editingBlog.author?.experience || ""}
onChange={(e)=>setEditingBlog({
...editingBlog,
author:{...editingBlog.author,experience:e.target.value}
})}
/>

<textarea
className="border p-2 col-span-2"
value={editingBlog.author?.description || ""}
onChange={(e)=>setEditingBlog({
...editingBlog,
author:{...editingBlog.author,description:e.target.value}
})}
/>

<input
type="file"
onChange={(e)=>setAuthorFile(e.target.files[0])}
/>

</div>

</div>

{/* CONTENT */}

<div>

<h3 className="font-bold mb-4">Content Blocks</h3>

{editingBlog.content?.map((block,i)=>(

<div key={i} className="border p-4 rounded mb-4">

<select
value={block.type}
onChange={(e)=>updateContent(i,"type",e.target.value)}
className="border p-2 mb-2"
>

<option value="heading">Heading</option>
<option value="paragraph">Paragraph</option>
<option value="image">Image</option>
<option value="quote">Quote</option>
<option value="code">Code</option>

</select>

{/* TEXT BLOCK */}

{["heading","paragraph","quote","code"].includes(block.type) &&(

<textarea
className="border p-2 w-full"
value={block.text || ""}
onChange={(e)=>updateContent(i,"text",e.target.value)}
/>

)}

{/* IMAGE BLOCK */}

{block.type==="image" &&(

<div className="space-y-2">

<input
type="file"
onChange={(e)=>setContentFiles({
...contentFiles,
[i]:e.target.files[0]
})}
/>

<input
className="border p-2 w-full"
placeholder="Caption"
value={block.media?.caption || ""}
onChange={(e)=>{

const updated=[...editingBlog.content]

updated[i].media={
...updated[i].media,
caption:e.target.value
}

setEditingBlog({
...editingBlog,
content:updated
})

}}
/>

</div>

)}

<button
type="button"
onClick={()=>removeContent(i)}
className="text-red-500 mt-2"
>
<Minus/>
</button>

</div>

))}

<button
type="button"
onClick={addContent}
className="flex gap-2 text-blue-600"
>

<Plus/> Add Block

</button>

</div>

{/* FAQ */}

<div>

<h3 className="font-bold mb-4">FAQs</h3>

{editingBlog.faqs?.map((f,i)=>(

<div key={i} className="border p-4 mb-3">

<input
className="w-full border p-2 mb-2"
value={f.question}
onChange={(e)=>{

const faqs=[...editingBlog.faqs];
faqs[i].question=e.target.value;

setEditingBlog({...editingBlog,faqs});

}}
/>

<textarea
className="w-full border p-2"
value={f.answer}
onChange={(e)=>{

const faqs=[...editingBlog.faqs];
faqs[i].answer=e.target.value;

setEditingBlog({...editingBlog,faqs});

}}
/>

</div>

))}

</div>

{/* SEO */}

<div>

<h3 className="font-bold mb-3">SEO</h3>

<input
className="border p-2 w-full mb-2"
value={editingBlog.seo?.meta_title || ""}
onChange={(e)=>setEditingBlog({
...editingBlog,
seo:{...editingBlog.seo,meta_title:e.target.value}
})}
/>

<textarea
className="border p-2 w-full"
value={editingBlog.seo?.meta_desc || ""}
onChange={(e)=>setEditingBlog({
...editingBlog,
seo:{...editingBlog.seo,meta_desc:e.target.value}
})}
/>

</div>

</form>

<div className="p-4 border-t flex gap-4">

<button
onClick={()=>setIsEditModalOpen(false)}
className="border px-6 py-2 rounded"
>
Cancel
</button>

<button
onClick={handleUpdate}
disabled={isSubmitting}
className="flex-1 bg-green-600 text-white rounded flex justify-center items-center gap-2"
>

{isSubmitting ? (
<Loader2 className="animate-spin"/>
) : (
<>
<Save size={18}/>
Update Blog
</>
)}

</button>

</div>

</div>

</div>

)}

</div>

);

}