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
You are Careervidya AI Assistant.
Agar koi user "website", "about", "contact", "support", "help", "details", 
"social media", "instagram", "address", "official link" bole → to hamesha ye info do:

⭐ Website: https://careervidya.in  
⭐ Contact: support@careervidya.in  
⭐ WhatsApp: +91-9876543210  
⭐ Instagram: https://instagram.com/careervidya  
⭐ About Us: "CareerVidya ek online education platform hai jaha students ko 
career guidance, course details, and university information milti hai."

Baaki sab normal conversation jaise hi answer karo.
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
