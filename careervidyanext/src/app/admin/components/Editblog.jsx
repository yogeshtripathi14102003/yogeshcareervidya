"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api";
import { useParams, useRouter } from "next/navigation";
import { PlusCircle, Trash2 } from "lucide-react";

export default function EditBlog() {

const { id } = useParams();
const router = useRouter();

const [loading,setLoading] = useState(false);

const [files,setFiles] = useState({
coverImage:null,
authorImage:null,
contentMedia:{}
});

const [formData,setFormData] = useState(null);


/* ---------------- FETCH BLOG ---------------- */

const fetchBlog = async ()=>{

try{

const res = await api.get(`/api/v1/blog/${id}`);

const blog = res.data?.data || res.data;

setFormData({
...blog,
seo:{
...blog.seo,
keywords: blog.seo?.keywords?.join(", ")
}
});

}catch(err){

console.error(err);
alert("Failed to load blog")

}

}

useEffect(()=>{

fetchBlog()

},[])



/* ---------------- HANDLE CHANGE ---------------- */

const handleChange = (e,path)=>{

const value = e.target.value

setFormData(prev=>{

const updated = JSON.parse(JSON.stringify(prev))
let ref = updated

path.forEach((key,i)=>{

if(i===path.length-1){

ref[key] = value

}else{

ref = ref[key]

}

})

return updated

})

}



/* ---------------- ADD ITEM ---------------- */

const addItem = (path,item)=>{

setFormData(prev=>{

const updated = JSON.parse(JSON.stringify(prev))
let ref = updated

path.forEach((k)=> ref = ref[k])

ref.push(item)

return updated

})

}


/* ---------------- REMOVE ITEM ---------------- */

const removeItem = (path,index)=>{

setFormData(prev=>{

const updated = JSON.parse(JSON.stringify(prev))
let ref = updated

path.forEach((k)=> ref = ref[k])

ref.splice(index,1)

return updated

})

}



/* ---------------- UPDATE BLOG ---------------- */

const handleSubmit = async (e)=>{

e.preventDefault()

setLoading(true)

const data = new FormData()

const submissionData = {

...formData,

seo:{
...formData.seo,
keywords: formData.seo.keywords
.split(",")
.map(k=>k.trim())
}

}

data.append("jsonData",JSON.stringify(submissionData))

if(files.coverImage) data.append("coverImage",files.coverImage)
if(files.authorImage) data.append("authorImage",files.authorImage)

Object.keys(files.contentMedia).forEach(index=>{

data.append("contentImages",files.contentMedia[index])
data.append("contentIndex",index)

})

try{

await api.put(`/api/v1/blog/${id}`,data,{
headers:{ "Content-Type":"multipart/form-data"}
})

alert("Blog Updated Successfully")

router.push("/admin/blogs")

}catch(err){

console.error(err)
alert("Update Failed")

}finally{

setLoading(false)

}

}


/* ---------------- LOADING ---------------- */

if(!formData){

return <div className="flex justify-center items-center h-screen">
Loading Blog...
</div>

}


/* ---------------- UI ---------------- */

return(

<div className="min-h-screen bg-slate-50 p-10">

<div className="max-w-6xl mx-auto">

<h1 className="text-3xl font-bold mb-8">
Edit Blog
</h1>

<form onSubmit={handleSubmit} className="space-y-10 bg-white p-8 rounded-xl shadow">

{/* BASIC INFO */}

<div className="space-y-4">

<h3 className="font-bold text-xl">Basic Info</h3>

<input
className="border p-2 w-full rounded"
placeholder="Title"
value={formData.title || ""}
onChange={(e)=>handleChange(e,["title"])}
/>

<input
className="border p-2 w-full rounded"
placeholder="Category"
value={formData.category || ""}
onChange={(e)=>handleChange(e,["category"])}
/>

</div>



{/* COVER IMAGE */}

<div>

<h3 className="font-bold mb-2">Cover Image</h3>

{formData.coverImage?.url && (
<img src={formData.coverImage.url} className="w-40 mb-2 rounded"/>
)}

<input
type="file"
onChange={(e)=>setFiles({...files,coverImage:e.target.files[0]})}
/>

</div>



{/* AUTHOR */}

<div className="space-y-3">

<h3 className="font-bold text-xl">Author</h3>

<input
className="border p-2 w-full rounded"
placeholder="Name"
value={formData.author?.name || ""}
onChange={(e)=>handleChange(e,["author","name"])}
/>

<input
className="border p-2 w-full rounded"
placeholder="Designation"
value={formData.author?.designation || ""}
onChange={(e)=>handleChange(e,["author","designation"])}
/>

</div>



{/* OVERVIEW */}

<div>

<h3 className="font-bold mb-3">Overview Points</h3>

{formData.overview?.points?.map((point,i)=>(

<div key={i} className="flex gap-2 mb-2">

<input
className="border p-2 w-full rounded"
value={point}
onChange={(e)=>handleChange(e,["overview","points",i])}
/>

<button
type="button"
onClick={()=>removeItem(["overview","points"],i)}
>
<Trash2 size={18}/>
</button>

</div>

))}

<button
type="button"
onClick={()=>addItem(["overview","points"],"")}
className="text-blue-600 flex items-center gap-1"
>

<PlusCircle size={16}/> Add Point

</button>

</div>



{/* SECOND SECTION TABLE */}

<div>

<h3 className="font-bold mb-3">Table</h3>

{formData.second_section?.table?.map((row,i)=>(

<div key={i} className="grid grid-cols-3 gap-2 mb-2">

<input
className="border p-2 rounded"
value={row.column1}
onChange={(e)=>handleChange(e,["second_section","table",i,"column1"])}
/>

<input
className="border p-2 rounded"
value={row.column2}
onChange={(e)=>handleChange(e,["second_section","table",i,"column2"])}
/>

<input
className="border p-2 rounded"
value={row.column3}
onChange={(e)=>handleChange(e,["second_section","table",i,"column3"])}
/>

</div>

))}

<button
type="button"
onClick={()=>addItem(["second_section","table"],{
column1:"",
column2:"",
column3:""
})}
className="text-blue-600"
>
Add Row
</button>

</div>



{/* CONTENT BLOCKS */}

<div>

<h3 className="font-bold mb-3">Content Blocks</h3>

{formData.content?.map((block,i)=>(

<div key={i} className="border p-4 mb-4 rounded">

<select
value={block.block_type}
onChange={(e)=>handleChange(e,["content",i,"block_type"])}
className="border p-2 rounded mb-2"
>

<option value="text">Text</option>
<option value="image">Image</option>
<option value="video">Video</option>

</select>

<textarea
className="border p-2 w-full rounded mb-2"
value={block.value}
onChange={(e)=>handleChange(e,["content",i,"value"])}
/>

{block.media?.url && (

<img src={block.media.url} className="w-40 mb-2"/>

)}

<input
type="file"
onChange={(e)=>setFiles({
...files,
contentMedia:{
...files.contentMedia,
[i]:e.target.files[0]
}
})}
/>

</div>

))}

<button
type="button"
onClick={()=>addItem(["content"],{
block_type:"text",
value:"",
media:{caption:""}
})}
className="text-blue-600"
>

Add Content Block

</button>

</div>



{/* FAQ */}

<div>

<h3 className="font-bold mb-3">FAQs</h3>

{formData.faqs?.map((faq,i)=>(

<div key={i} className="mb-3">

<input
className="border p-2 w-full rounded mb-1"
value={faq.question}
onChange={(e)=>handleChange(e,["faqs",i,"question"])}
placeholder="Question"
/>

<textarea
className="border p-2 w-full rounded"
value={faq.answer}
onChange={(e)=>handleChange(e,["faqs",i,"answer"])}
placeholder="Answer"
/>

</div>

))}

<button
type="button"
onClick={()=>addItem(["faqs"],{question:"",answer:""})}
className="text-blue-600"
>

Add FAQ

</button>

</div>



{/* SEO */}

<div className="space-y-3">

<h3 className="font-bold text-xl">SEO</h3>

<input
className="border p-2 w-full rounded"
placeholder="Meta Title"
value={formData.seo?.meta_title || ""}
onChange={(e)=>handleChange(e,["seo","meta_title"])}
/>

<textarea
className="border p-2 w-full rounded"
placeholder="Meta Description"
value={formData.seo?.meta_desc || ""}
onChange={(e)=>handleChange(e,["seo","meta_desc"])}
/>

<input
className="border p-2 w-full rounded"
placeholder="Keywords"
value={formData.seo?.keywords || ""}
onChange={(e)=>handleChange(e,["seo","keywords"])}
/>

</div>



{/* SUBMIT */}

<button
disabled={loading}
className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold"
>

{loading ? "Updating..." : "Update Blog"}

</button>

</form>

</div>

</div>

)

}