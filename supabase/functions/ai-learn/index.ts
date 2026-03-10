import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, mode, depth, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langInstruction = language && language !== "en"
      ? `IMPORTANT: You MUST respond entirely in ${language} language. All text, explanations, comments in code, and descriptions must be in ${language}.`
      : "";

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "text") {
      systemPrompt = `You are an expert Machine Learning tutor. ${langInstruction}
You MUST ONLY respond to topics related to AI, ML, or Deep Learning.
If the topic is NOT related to AI/ML/DL, respond with: "I apologize, but I can only provide information about Artificial Intelligence, Machine Learning, and Deep Learning topics."`;
      
      const depthMap: Record<string, string> = {
        brief: "Provide a brief explanation (2-3 paragraphs).",
        detailed: "Provide a detailed explanation (5-7 paragraphs) with examples.",
        comprehensive: "Provide a comprehensive explanation (8-12 paragraphs) with examples, mathematical foundations, and practical applications.",
      };

      userPrompt = `Explain the following ML/AI topic: "${topic}"
${depthMap[depth] || depthMap.detailed}
Include:
- Clear learning objective at the start
- Structured explanation with headings
- Real-world examples and applications
- Key takeaways
Format using markdown with proper headings, bold text, and bullet points.`;
    } else if (mode === "code") {
      systemPrompt = `You are an expert ML/AI Python code generator. ${langInstruction}
You MUST ONLY generate code for AI/ML/DL topics.
If the topic is NOT related to AI/ML/DL, respond with: "I apologize, but I can only generate code for AI, Machine Learning, and Deep Learning topics."`;

      userPrompt = `Generate a complete, working Python program that demonstrates: "${topic}"
Depth: ${depth}

Requirements:
- Include all necessary imports
- Add detailed comments explaining each step
- Include sample data or dataset loading
- Show model training and evaluation
- Print results and metrics
- The code should be ready to run in Google Colab

Format your response as:
1. First, a brief explanation of the approach (in markdown)
2. Then the complete Python code in a \`\`\`python code block
3. After the code, list the required dependencies
4. Provide step-by-step instructions to run in Google Colab`;
    } else if (mode === "audio") {
      systemPrompt = `You are an expert ML educator creating audio lecture scripts. ${langInstruction}
You MUST ONLY create content for AI/ML/DL topics.`;

      userPrompt = `Create a conversational audio lecture script about: "${topic}"
Depth: ${depth}

The script should:
- Be written in a natural, conversational teaching style
- Include pauses indicated by "(Pause)" for natural speech rhythm
- Start with a warm greeting and topic introduction
- Break down complex concepts into digestible explanations
- Use analogies and real-world examples
- End with a summary and key takeaways
- Be suitable for text-to-speech conversion
- Length: ${depth === "brief" ? "3-5 minutes" : depth === "detailed" ? "5-8 minutes" : "10-15 minutes"}`;
    } else if (mode === "image") {
      systemPrompt = `You are an expert at creating educational diagram descriptions for ML/AI topics. ${langInstruction}
You MUST ONLY create content for AI/ML/DL topics.`;

      userPrompt = `For the ML/AI topic: "${topic}"
Depth: ${depth}

Provide:
1. A brief explanation of the topic (2-3 paragraphs in markdown)
2. Then generate exactly 3 image prompt descriptions, each on a new line starting with "IMG-PROMPT::"
Each prompt should describe a specific educational diagram or visualization that would help understand this topic.
Make the prompts detailed and specific for generating educational technical diagrams.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: useStream,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to your workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!useStream) {
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      return new Response(text, {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
