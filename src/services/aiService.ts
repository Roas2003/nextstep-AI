import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const generateAIJobs = async (skills: string[]) => {
  const prompt = `
You are an AI career advisor.

User skills:
${skills.join(", ")}

Suggest 5 suitable tech jobs.

Return ONLY valid JSON array. No markdown.

Each job must have:
id, title, company, location, salary, type, experience, description, requirements, matchPercentage, postedDate.

Use Arabic for description.
company must be "Gemini AI Career Assistant".
postedDate must be "Gemini AI Recommendation".
requirements must be an array of strings.
matchPercentage must be a number from 60 to 98.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const text = response.text || "";

  const cleanText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanText);
};

export const analyzeSkills = async (
  userSkills: string[],
  requiredSkills: string[]
) => {
  const normalize = (text: string) => text.toLowerCase().trim();

  let matched = 0;

  requiredSkills.forEach((req) => {
    const normalizedReq = normalize(req);

    const found = userSkills.some((skill) => {
      const normalizedSkill = normalize(skill);

      return (
        normalizedSkill.includes(normalizedReq) ||
        normalizedReq.includes(normalizedSkill)
      );
    });

    if (found) matched++;
  });

  const percentage =
    requiredSkills.length > 0
      ? Math.round((matched / requiredSkills.length) * 100)
      : 0;

  let message = "";

  if (percentage >= 85) {
    message = "توافق ممتاز جداً مع متطلبات الوظيفة";
  } else if (percentage >= 65) {
    message = "توافق جيد ويوجد بعض المهارات الناقصة";
  } else {
    message = "التوافق منخفض ويُنصح بتطوير مهارات إضافية";
  }

  return {
    percentage,
    message,
    matchedSkills: matched,
    totalSkills: requiredSkills.length,
  };
};