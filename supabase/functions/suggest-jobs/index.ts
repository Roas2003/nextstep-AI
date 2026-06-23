import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function fallbackJobs() {
  return [
    {
      title: "Frontend Developer",
      company: "AI Career Assistant",
      location: "Remote",
      salary: "حسب الخبرة",
      type: "دوام كامل",
      experience: "مبتدئ",
      matchPercentage: 85,
      postedDate: "Fallback Recommendation",
      description: "اقتراح احتياطي مناسب لمهارات تطوير الواجهات.",
      requirements: ["React", "JavaScript", "HTML", "CSS"],
    },
  ];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const skills = Array.isArray(body.skills) ? body.skills : [];

    const apiKey =
      Deno.env.get("GEMINI_API_KEY") ||
      Deno.env.get("VITE_GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(JSON.stringify(fallbackJobs()), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `
You are an AI career advisor for fresh graduates.

User skills:
${skills.join(", ")}

Suggest 5 suitable tech jobs.

Return ONLY valid JSON array. No markdown.

Each job must have:
title, company, location, salary, type, experience, matchPercentage, postedDate, description, requirements.

Use Arabic for description.
company must be "AI Career Assistant".
salary must be "حسب الخبرة".
postedDate must be "AI Recommendation".
requirements must be an array.
matchPercentage must be a number from 60 to 98.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const jobs = JSON.parse(cleanText);

    return new Response(JSON.stringify(jobs), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini AI Error:", error);

    return new Response(JSON.stringify(fallbackJobs()), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});