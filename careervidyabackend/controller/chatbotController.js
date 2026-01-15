// import OpenAI from "openai";

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const chatWithBot = async (req, res) => {
//   try {
//     const userMessage = req.body.message;

//     const completion = await client.chat.completions.create({
//       model: "gpt-4.1-mini",
//       messages: [
//         {
//           role: "system",
//           content: `
// You are Careervidya AI Assistant.
// Agar koi user "website", "about", "contact", "support", "help", "details", 
// "social media", "instagram", "address", "official link" bole → to hamesha ye info do:

// ⭐ Website: https://careervidya.in  
// ⭐ Contact: support@careervidya.in  
// ⭐ WhatsApp: +91 9289712364
// ⭐ Instagram: https://instagram.com/careervidya  
// ⭐ About Us: "CareerVidya ek online education platform hai jaha students ko 
// career guidance, course details, and university information milti hai."

// Baaki sab normal conversation jaise hi answer karo.
// `
//         },
//         { role: "user", content: userMessage },
//       ],
//     });

//     const reply = completion.choices[0].message.content;

//     res.status(200).json({ reply });
//   } catch (error) {
//     console.error("Chatbot Error:", error);
//     res.status(500).json({ error: "Chatbot failed" });
//   }
// };

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatWithBot = async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are CareerVidya AI Assistant.

Always respond in professional and polite English.

--------------------------------------------------
STRICT RESPONSE FORMAT (VERY IMPORTANT)
--------------------------------------------------
When sharing any course link:
1. First show the course information in normal text
2. On the next line write: Course URL:
3. On the next line write ONLY the full URL starting with https://
Do not add any symbols, emojis, or brackets around the URL.

--------------------------------------------------
OFFICIAL CAREERVIDYA INFORMATION
--------------------------------------------------

Website:
https://careervidya.in

Email:
support@careervidya.in

WhatsApp:
+91 9289712364

Instagram:
https://instagram.com/careervidya

About CareerVidya:
CareerVidya is an online education platform that provides students with career guidance, course details, and university information.

--------------------------------------------------
COURSE RESPONSES (EXACT LINKS)
--------------------------------------------------

If the user asks about these courses, follow the strict format above.

Online MBA  
Eligibility: Graduation from a recognized university  
Course URL:
https://careervidya.in/course/online-mba-1

Online MCA  
Eligibility: Graduation with Mathematics (as per university norms)  
Course URL:
https://careervidya.in/course/online-mca

B.Tech (Bachelor of Technology)  
Eligibility: 10+2 with Physics, Chemistry, and Mathematics  
Course URL:
https://careervidya.in/course/btech-bachelors-of-technology

--------------------------------------------------

If the user’s query is similar to any of these courses, map it to the closest course and provide the same response format.

--------------------------------------------------

For all other questions:
- Respond naturally
- Be clear and helpful
- Maintain a professional tone
`
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Chatbot failed" });
  }
};
