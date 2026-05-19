import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function smartJobs(skills: string[]) {
  const lower = skills.map((s) => s.toLowerCase());

  const has = (words: string[]) =>
    lower.some((skill) => words.some((w) => skill.includes(w)));

  return [
    {
      title: has(["react"])
        ? "React Frontend Developer"
        : "Frontend Developer",
      company: "AI Career Assistant",
      location: "Remote",
      salary: "حسب الخبرة",
      type: "دوام كامل",
      experience: "مبتدئ - متوسط",
      matchPercentage: has([
        "react",
        "javascript",
        "html",
        "css",
      ])
        ? 94
        : 75,
      postedDate: "AI Recommendation",
      description:
        "تم اقتراح هذه الوظيفة بعد تحليل مهارات المستخدم ومقارنتها بمتطلبات وظائف تطوير الواجهات.",
      requirements: [
        "React",
        "JavaScript",
        "HTML",
        "CSS",
        "Git",
      ],
    },

    {
      title: "Full Stack Developer",
      company: "AI Career Assistant",
      location: "Hybrid",
      salary: "حسب الخبرة",
      type: "دوام كامل",
      experience: "متوسط",
      matchPercentage: has([
        "react",
        "node",
        "database",
        "supabase",
      ])
        ? 90
        : 72,
      postedDate: "AI Recommendation",
      description:
        "اقتراح مناسب للمستخدمين الذين يجمعون بين مهارات الواجهة الأمامية وقواعد البيانات.",
      requirements: [
        "React",
        "Node.js",
        "Database",
        "API",
        "Supabase",
      ],
    },

    {
      title: "Backend Developer",
      company: "AI Career Assistant",
      location: "Remote",
      salary: "حسب الخبرة",
      type: "دوام كامل",
      experience: "مبتدئ - متوسط",
      matchPercentage: has([
        "sql",
        "database",
        "api",
        "supabase",
        "php",
      ])
        ? 88
        : 68,
      postedDate: "AI Recommendation",
      description:
        "تم اقتراح هذه الوظيفة بناءً على مهارات قواعد البيانات وربط الأنظمة والخدمات الخلفية.",
      requirements: [
        "SQL",
        "Database",
        "API",
        "Supabase",
      ],
    },

    {
      title: "UI/UX Designer",
      company: "AI Career Assistant",
      location: "Remote",
      salary: "حسب الخبرة",
      type: "دوام جزئي / تدريب",
      experience: "مبتدئ",
      matchPercentage: has([
        "figma",
        "design",
        "ui",
        "ux",
      ])
        ? 86
        : 62,
      postedDate: "AI Recommendation",
      description:
        "اقتراح مناسب إذا كان لدى المستخدم مهارات تصميم واجهات وتجربة مستخدم.",
      requirements: [
        "Figma",
        "UI Design",
        "UX Research",
        "Prototyping",
      ],
    },

    {
      title: "Junior Software Developer",
      company: "AI Career Assistant",
      location: "On-site",
      salary: "حسب الخبرة",
      type: "دوام كامل",
      experience: "مبتدئ",
      matchPercentage: 78,
      postedDate: "AI Recommendation",
      description:
        "وظيفة مناسبة للخريجين الجدد كبداية في مجال البرمجة وتطوير الأنظمة.",
      requirements: [
        "Problem Solving",
        "Git",
        "Teamwork",
        "Programming Basics",
      ],
    },
  ].sort((a, b) => b.matchPercentage - a.matchPercentage);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();

    const skills: string[] = Array.isArray(body.skills)
      ? body.skills
      : [];

    return new Response(
      JSON.stringify(smartJobs(skills)),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch {
    return new Response(
      JSON.stringify(smartJobs([])),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});