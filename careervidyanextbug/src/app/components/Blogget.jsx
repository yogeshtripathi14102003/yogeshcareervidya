"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import api from "@/utlis/api";

export default function QueryForm() {

const [formData,setFormData] = useState({
name:"",
email:"",
mobile:"",
city:"",
course:"",
branch:"",
message:""
});

const handleChange = (e)=>{

const {name,value} = e.target;

setFormData(prev=>({
...prev,
[name]:value
}));

};

const handleSubmit = async(e)=>{

e.preventDefault();

try{

await api.post("/api/v1/getintouch",formData);

alert("Query Submitted Successfully");

setFormData({
name:"",
email:"",
mobile:"",
city:"",
course:"",
branch:"",
message:""
});

}catch(err){

alert("Error submitting form");

}

};

return(

<div className="bg-white shadow-xl rounded-xl p-6 sticky top-24">

<h3 className="text-xl font-bold mb-4 text-[#05347f]">
Free Career Counselling
</h3>

<form
onSubmit={handleSubmit}
className="space-y-3"
>

<input
name="name"
value={formData.name}
onChange={handleChange}
placeholder="Name"
required
className="w-full border p-2 rounded"
/>

<input
name="email"
value={formData.email}
onChange={handleChange}
placeholder="Email"
required
className="w-full border p-2 rounded"
/>

<input
name="mobile"
value={formData.mobile}
onChange={handleChange}
placeholder="Mobile"
required
className="w-full border p-2 rounded"
/>

{/* COURSE INPUT */}

<input
name="course"
value={formData.course}
onChange={handleChange}
placeholder="Course (eg: B.Tech, MBA)"
required
className="w-full border p-2 rounded"
/>

{/* BRANCH INPUT */}

<input
name="branch"
value={formData.branch}
onChange={handleChange}
placeholder="Branch / Specialization"
required
className="w-full border p-2 rounded"
/>

<input
name="city"
value={formData.city}
onChange={handleChange}
placeholder="City"
required
className="w-full border p-2 rounded"
/>

<textarea
name="message"
value={formData.message}
onChange={handleChange}
placeholder="Message"
className="w-full border p-2 rounded"
/>

<button
className="w-full bg-[#05347f] text-white py-2 rounded flex items-center justify-center gap-2"
>

Send Message
<Send size={16}/>

</button>

</form>

</div>

);

}