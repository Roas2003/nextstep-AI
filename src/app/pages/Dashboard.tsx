import { useEffect, useMemo, useState } from "react";
import React from "react";
import { useNavigate } from "react-router";
import {
  Briefcase,
  Bookmark,
  FileText,
  Target,
  Sparkles,
  ArrowUpRight,
  Brain,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

interface ProfileData {
  name?: string;
  title?: string;
  skills?: string;
}

interface JobRow {
  id: string | number;
  title?: string | null;
  description?: string | null;
  requirements?: string | null;
}

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [matchedJobsCount, setMatchedJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const cleanText = (text: string) =>
    text
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
      const normalizeSkill = (skill: string) => {
        const normalized = skill
          .toLowerCase()
          .trim()
          .replace(/\s+/g, " ");
      
        const aliases: Record<string, string> = {
          node: "node.js",
          nodejs: "node.js",
          "node.js": "node.js",
      
          js: "javascript",
          javascript: "javascript",
      
          ts: "typescript",
          typescript: "typescript",
      
          reactjs: "react",
          "react.js": "react",
          react: "react",
      
          html5: "html",
          html: "html",
      
          css3: "css",
          css: "css",
      
          postgres: "postgresql",
          postgresql: "postgresql",
        };
      
        return aliases[normalized] || normalized;
      };
      
      const extractRequirements = (
        text: string,
        profileSkills: string[] = []
      ): string[] => {
        const normalizedText = text
          .toLowerCase()
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/[._-]+/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      
        const skillDefinitions: Array<{
          name: string;
          patterns: RegExp[];
          category?: "frontend" | "backend" | "mobile" | "ux" | "devops";
        }> = [
          {
            name: "React",
            patterns: [/\breact\b/i, /\breactjs\b/i, /\breact js\b/i],
            category: "frontend",
          },
          {
            name: "TypeScript",
            patterns: [/\btypescript\b/i, /\btype script\b/i],
            category: "frontend",
          },
          {
            name: "JavaScript",
            patterns: [/\bjavascript\b/i, /\bjava script\b/i],
            category: "frontend",
          },
          {
            name: "HTML",
            patterns: [/\bhtml\b/i, /\bhtml5\b/i],
            category: "frontend",
          },
          {
            name: "CSS",
            patterns: [/\bcss\b/i, /\bcss3\b/i],
            category: "frontend",
          },
          {
            name: "Angular",
            patterns: [/\bangular\b/i],
            category: "frontend",
          },
          {
            name: "Vue.js",
            patterns: [/\bvue\b/i, /\bvuejs\b/i, /\bvue js\b/i],
            category: "frontend",
          },
          {
            name: "Next.js",
            patterns: [/\bnextjs\b/i, /\bnext js\b/i],
            category: "frontend",
          },
      
          {
            name: "Node.js",
            patterns: [/\bnode\b/i, /\bnodejs\b/i, /\bnode js\b/i],
            category: "backend",
          },
          {
            name: "Express",
            patterns: [/\bexpress\b/i, /\bexpressjs\b/i, /\bexpress js\b/i],
            category: "backend",
          },
          {
            name: "PHP",
            patterns: [/\bphp\b/i],
            category: "backend",
          },
          {
            name: "Laravel",
            patterns: [/\blaravel\b/i],
            category: "backend",
          },
          {
            name: "Python",
            patterns: [/\bpython\b/i],
            category: "backend",
          },
          {
            name: "Django",
            patterns: [/\bdjango\b/i],
            category: "backend",
          },
          {
            name: "Java",
            patterns: [/\bjava\b/i],
            category: "backend",
          },
          {
            name: "Spring Boot",
            patterns: [/\bspring boot\b/i, /\bspringboot\b/i],
            category: "backend",
          },
          {
            name: "Ruby",
            patterns: [/\bruby\b/i],
            category: "backend",
          },
          {
            name: "Ruby on Rails",
            patterns: [/\bruby on rails\b/i, /\brails\b/i],
            category: "backend",
          },
          {
            name: "C#",
            patterns: [/c#/i, /\bc sharp\b/i],
            category: "backend",
          },
          {
            name: ".NET",
            patterns: [/\.net\b/i, /\bdot net\b/i],
            category: "backend",
          },
      
          {
            name: "SQL",
            patterns: [/\bsql\b/i],
          },
          {
            name: "MySQL",
            patterns: [/\bmysql\b/i, /\bmy sql\b/i],
          },
          {
            name: "PostgreSQL",
            patterns: [/\bpostgresql\b/i, /\bpostgres\b/i],
          },
          {
            name: "MongoDB",
            patterns: [/\bmongodb\b/i, /\bmongo db\b/i],
          },
          {
            name: "Supabase",
            patterns: [/\bsupabase\b/i],
          },
          {
            name: "Firebase",
            patterns: [/\bfirebase\b/i],
          },
          {
            name: "REST API",
            patterns: [
              /\brest api\b/i,
              /\brestful api\b/i,
              /\brestful services\b/i,
            ],
          },
          {
            name: "GraphQL",
            patterns: [/\bgraphql\b/i, /\bgraph ql\b/i],
          },
      
          {
            name: "Git",
            patterns: [/\bgit\b/i],
            category: "devops",
          },
          {
            name: "GitHub",
            patterns: [/\bgithub\b/i, /\bgit hub\b/i],
            category: "devops",
          },
          {
            name: "Docker",
            patterns: [/\bdocker\b/i],
            category: "devops",
          },
          {
            name: "Kubernetes",
            patterns: [/\bkubernetes\b/i, /\bk8s\b/i],
            category: "devops",
          },
          {
            name: "AWS",
            patterns: [/\baws\b/i, /\bamazon web services\b/i],
            category: "devops",
          },
          {
            name: "Azure",
            patterns: [/\bazure\b/i],
            category: "devops",
          },
          {
            name: "Linux",
            patterns: [/\blinux\b/i],
            category: "devops",
          },
          {
            name: "CI/CD",
            patterns: [/\bci cd\b/i, /\bcontinuous integration\b/i],
            category: "devops",
          },
      
          {
            name: "Flutter",
            patterns: [/\bflutter\b/i],
            category: "mobile",
          },
          {
            name: "React Native",
            patterns: [/\breact native\b/i],
            category: "mobile",
          },
          {
            name: "Kotlin",
            patterns: [/\bkotlin\b/i],
            category: "mobile",
          },
          {
            name: "Swift",
            patterns: [/\bswift\b/i],
            category: "mobile",
          },
          {
            name: "Android",
            patterns: [/\bandroid\b/i],
            category: "mobile",
          },
          {
            name: "iOS",
            patterns: [/\bios\b/i],
            category: "mobile",
          },
      
          {
            name: "Figma",
            patterns: [/\bfigma\b/i],
            category: "ux",
          },
          {
            name: "UI Design",
            patterns: [/\bui design\b/i, /\buser interface design\b/i],
            category: "ux",
          },
          {
            name: "UX Design",
            patterns: [/\bux design\b/i, /\buser experience design\b/i],
            category: "ux",
          },
      
          {
            name: "Machine Learning",
            patterns: [/\bmachine learning\b/i],
          },
          {
            name: "Artificial Intelligence",
            patterns: [/\bartificial intelligence\b/i],
          },
          {
            name: "Data Analysis",
            patterns: [/\bdata analysis\b/i, /\bdata analytics\b/i],
          },
        ];
      
        const detectedDetailedSkills = skillDefinitions
          .filter((definition) =>
            definition.patterns.some((pattern) => pattern.test(normalizedText))
          )
          .map((definition) => definition.name);
      
        const detectedProfileSkills = profileSkills.filter((skill) => {
          const originalSkill = skill
            .toLowerCase()
            .trim()
            .replace(/[._-]+/g, " ")
            .replace(/\s+/g, " ");
      
          const normalizedProfileSkill = normalizeSkill(skill)
            .toLowerCase()
            .replace(/[._-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
      
          return (
            originalSkill.length >= 2 &&
            (normalizedText.includes(originalSkill) ||
              normalizedText.includes(normalizedProfileSkill))
          );
        });
      
        const detailedSkills = Array.from(
          new Map(
            [...detectedDetailedSkills, ...detectedProfileSkills].map((skill) => [
              normalizeSkill(skill),
              skill,
            ])
          ).values()
        );
      
        const hasFrontendDetails = skillDefinitions.some(
          (definition) =>
            definition.category === "frontend" &&
            detailedSkills.some(
              (skill) =>
                normalizeSkill(skill) === normalizeSkill(definition.name)
            )
        );
      
        const hasBackendDetails = skillDefinitions.some(
          (definition) =>
            definition.category === "backend" &&
            detailedSkills.some(
              (skill) =>
                normalizeSkill(skill) === normalizeSkill(definition.name)
            )
        );
      
        const hasMobileDetails = skillDefinitions.some(
          (definition) =>
            definition.category === "mobile" &&
            detailedSkills.some(
              (skill) =>
                normalizeSkill(skill) === normalizeSkill(definition.name)
            )
        );
      
        const hasUxDetails = skillDefinitions.some(
          (definition) =>
            definition.category === "ux" &&
            detailedSkills.some(
              (skill) =>
                normalizeSkill(skill) === normalizeSkill(definition.name)
            )
        );
      
        const hasDevOpsDetails = skillDefinitions.some(
          (definition) =>
            definition.category === "devops" &&
            detailedSkills.some(
              (skill) =>
                normalizeSkill(skill) === normalizeSkill(definition.name)
            )
        );
      
        const generalSkills: string[] = [];
      
        if (
          !hasFrontendDetails &&
          (/\bfrontend\b/i.test(normalizedText) ||
            /\bfront end\b/i.test(normalizedText))
        ) {
          generalSkills.push("Frontend");
        }
      
        if (
          !hasBackendDetails &&
          (/\bbackend\b/i.test(normalizedText) ||
            /\bback end\b/i.test(normalizedText))
        ) {
          generalSkills.push("Backend");
        }
      
        if (
          !hasMobileDetails &&
          (/\bmobile development\b/i.test(normalizedText) ||
            /\bmobile developer\b/i.test(normalizedText))
        ) {
          generalSkills.push("Mobile Development");
        }
      
        if (
          !hasUxDetails &&
          (/\buser experience\b/i.test(normalizedText) ||
            /\bux\b/i.test(normalizedText))
        ) {
          generalSkills.push("UX");
        }
      
        if (
          !hasDevOpsDetails &&
          /\bdevops\b/i.test(normalizedText)
        ) {
          generalSkills.push("DevOps");
        }
      
        if (
          /\bapi\b/i.test(normalizedText) &&
          !detailedSkills.some(
            (skill) =>
              normalizeSkill(skill) === normalizeSkill("REST API") ||
              normalizeSkill(skill) === normalizeSkill("GraphQL")
          )
        ) {
          generalSkills.push("API");
        }
      
        return Array.from(
          new Map(
            [...detailedSkills, ...generalSkills].map((skill) => [
              normalizeSkill(skill),
              skill,
            ])
          ).values()
        ).slice(0, 10);
      };
      
      const calculateJobMatch = (
        skills: string[],
        requirements: string[]
      ) => {
        if (skills.length === 0 || requirements.length === 0) {
          return 0;
        }
      
        const normalizedSkills = new Set(
          skills.map((skill) => normalizeSkill(skill))
        );
      
        const frontendSkills = [
          "react",
          "javascript",
          "typescript",
          "html",
          "css",
          "angular",
          "vue",
          "next.js",
        ];
      
        const backendSkills = [
          "node.js",
          "express",
          "php",
          "laravel",
          "python",
          "java",
          "ruby",
          "ruby on rails",
          "c#",
          ".net",
        ];
      
        const uxSkills = [
          "ux",
          "ui",
          "figma",
          "user experience",
          "user interface",
        ];
      
        const mobileSkills = [
          "flutter",
          "react native",
          "kotlin",
          "swift",
          "android",
          "ios",
        ];
      
        const devOpsSkills = [
          "docker",
          "kubernetes",
          "linux",
          "aws",
          "terraform",
          "ci/cd",
        ];
      
        const hasAnySkill = (skillGroup: string[]) =>
          skillGroup.some((skill) =>
            normalizedSkills.has(normalizeSkill(skill))
          );
      
        if (hasAnySkill(frontendSkills)) {
          normalizedSkills.add("frontend");
        }
      
        if (hasAnySkill(backendSkills)) {
          normalizedSkills.add("backend");
        }
      
        if (hasAnySkill(uxSkills)) {
          normalizedSkills.add("ux");
          normalizedSkills.add("ui");
        }
      
        if (hasAnySkill(mobileSkills)) {
          normalizedSkills.add("mobile");
        }
      
        if (hasAnySkill(devOpsSkills)) {
          normalizedSkills.add("devops");
        }
      
        const normalizedRequirements = Array.from(
          new Set(
            requirements.map((requirement) =>
              normalizeSkill(requirement)
            )
          )
        );
      
        const matchedRequirements = normalizedRequirements.filter(
          (requirement) => normalizedSkills.has(requirement)
        );
      
        return Math.round(
          (matchedRequirements.length /
            normalizedRequirements.length) *
            100
        );
      };
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data: profileData } = await supabase
        .from("profile")
        .select("name, title, skills")
        .eq("user_id", user.id)
        .maybeSingle();

      const skills = profileData?.skills
        ? String(profileData.skills)
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [];

      const { data: savedJobsData } = await supabase
        .from("saved_jobs")
        .select("id")
        .eq("user_id", user.id);

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("id, title, description, requirements");

        const matchedJobs = ((jobsData || []) as JobRow[]).filter((job) => {
          const cleanDescription = cleanText(job.description || "");
        
          const requirements = extractRequirements(
            `${job.title || ""} ${job.requirements || ""} ${cleanDescription}`
          );
        
          const matchPercentage = calculateJobMatch(
            skills,
            requirements
          );
          return matchPercentage > 0;
        });
        
        const matchedJobsCountValue = matchedJobs.length;
      setProfile(profileData || null);
      setSavedJobsCount(savedJobsData?.length || 0);
      setMatchedJobsCount(matchedJobsCountValue);
            setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  const skillsArray = useMemo(() => {
    if (!profile?.skills) return [];

    return profile.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }, [profile?.skills]);

  const bestCareerMatch = useMemo(() => {
    const normalizedUserSkills = Array.from(
      new Set(
        skillsArray.map((skill) => normalizeSkill(skill))
      )
    );
  
    const calculateMatch = (requiredSkills: string[]) => {
      if (
        normalizedUserSkills.length === 0 ||
        requiredSkills.length === 0
      ) {
        return 0;
      }
  
      const normalizedRequiredSkills = Array.from(
        new Set(
          requiredSkills.map((skill) => normalizeSkill(skill))
        )
      );
  
      const matchedSkills = normalizedRequiredSkills.filter(
        (requiredSkill) =>
          normalizedUserSkills.includes(requiredSkill)
      );
  
      return Math.round(
        (matchedSkills.length /
          normalizedRequiredSkills.length) *
          100
      );
    };
  
    const careerPaths = [
      {
        title: "مطور Frontend",
        percentage: calculateMatch([
          "React",
          "TypeScript",
          "JavaScript",
          "HTML",
          "CSS",
        ]),
      },
      {
        title: "مطور Backend",
        percentage: calculateMatch([
          "Node.js",
          "Python",
          "Java",
          "PHP",
          "Laravel",
          "API",
        ]),
      },
      {
        title: "مطور Full Stack",
        percentage: calculateMatch([
          "HTML",
          "CSS",
          "JavaScript",
          "TypeScript",
          "React",
          "Node.js",
          "Express",
          "PHP",
          "Laravel",
          "API Design",
          "MongoDB",
          "SQL",
          "Supabase",
          "Git",
          "GitHub",
          "Docker",
          "AWS",
        ]),
      },
      {
        title: "مهندس DevOps",
        percentage: calculateMatch([
          "Linux",
          "Git",
          "Bash",
          "Docker",
          "CI/CD",
          "AWS",
          "Kubernetes",
          "Terraform",
        ]),
      },
      {
        title: "مطور تطبيقات الموبايل",
        percentage: calculateMatch([
          "React Native",
          "Flutter",
          "Swift",
          "Kotlin",
        ]),
      },
    ];
  
    return careerPaths.reduce((bestPath, currentPath) =>
      currentPath.percentage > bestPath.percentage
        ? currentPath
        : bestPath
    );
  }, [skillsArray]);
  
  const bestCareerPath = bestCareerMatch.title;
  const matchPercentage = bestCareerMatch.percentage;

  const userName =
    profile?.name?.trim() || user?.email?.split("@")[0] || "User";

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#f5fbff] flex items-center justify-center"
      >
        <p className="text-slate-600 text-lg">جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f5fbff] px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="rounded-[32px] bg-gradient-to-l from-[#24104f] via-[#050719] to-[#063d4b] text-white p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
                <Brain className="w-4 h-4 text-cyan-300" />
                AI Career Dashboard
              </div>

              <h1 className="text-5xl font-extrabold">مرحباً، {userName}</h1>

              <p className="text-xl leading-relaxed text-slate-200">
                لوحة ذكية تلخص مهاراتك، توافقك المهني، الوظائف المتاحة،
                والدورات التي تحتاجينها لتطوير مسارك المهني.
              </p>

              <div className="flex gap-3 justify-start flex-row-reverse">
                <button
                  onClick={() => navigate("/jobs")}
                  className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                >
                  استعراض الوظائف
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate("/skills")}
                  className="bg-cyan-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                >
                  تحليل المهارات
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/10 p-8 shadow-inner">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-cyan-100 text-lg">أفضل توافق مهني</p>
                  <h2 className="text-5xl font-black mt-2">
                    {matchPercentage}%
                  </h2>
                </div>

                <div className="bg-cyan-500/30 p-4 rounded-2xl">
                  <Target className="w-9 h-9 text-cyan-200" />
                </div>
              </div>

              <div className="w-full h-3 bg-white/80 rounded-full mt-7 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${matchPercentage}%` }}
                />
              </div>

              <div className="mt-6">
                <p className="text-cyan-100 mb-2">أفضل مسار مقترح لك</p>
                <h3 className="text-2xl font-extrabold">{bestCareerPath}</h3>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="المهارات"
            value={skillsArray.length}
            icon={<Target className="w-8 h-8" />}
            onClick={() => navigate("/skills")}
          />

          <DashboardCard
            title="وظائف محفوظة"
            value={savedJobsCount}
            icon={<Bookmark className="w-8 h-8" />}
            onClick={() => navigate("/saved-jobs")}
          />

          <DashboardCard
            title=" الوظائف المتوافقه" 
            value={matchedJobsCount}
            icon={<Briefcase className="w-8 h-8" />}
            onClick={() => navigate("/jobs")}
          />

          <DashboardCard
            title="السير الذاتية"
            value={profile ? 1 : 0}
            icon={<FileText className="w-8 h-8" />}
            onClick={() => navigate("/resume")}
          />
        </section>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  onClick,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-right bg-white rounded-[26px] p-7 shadow-md border border-cyan-100 min-h-[170px] flex justify-between items-start cursor-pointer hover:shadow-xl transition-all duration-300"
    >
      <div>
        <h3 className="text-4xl font-black text-slate-950">{value}</h3>
        <p className="mt-12 text-2xl font-bold text-slate-700">{title}</p>
      </div>

      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white flex items-center justify-center shadow-lg">
        {icon}
      </div>
    </button>
  );
}
