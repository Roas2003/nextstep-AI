import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Clock,
  DollarSign,
  ExternalLink,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

interface JobDetailsData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  matchPercentage: number;
  postedDate: string;
  url?: string | null;
}

const cleanText = (text: string) =>
  text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const normalizeLocation = (location: string) => {
  const cleanedLocation = cleanText(location || "");
  const lower = cleanedLocation.toLowerCase();

  if (
    lower.includes("remote") ||
    lower.includes("worldwide") ||
    lower.includes("anywhere") ||
    lower.includes("usa") ||
    lower.includes("europe") ||
    lower.includes("canada") ||
    lower.includes("latam")
  ) {
    return "عن بعد";
  }

  if (
    lower.includes("amman") ||
    cleanedLocation.includes("عمان")
  ) {
    return "عمان";
  }

  if (
    lower.includes("irbid") ||
    cleanedLocation.includes("إربد") ||
    cleanedLocation.includes("اربد")
  ) {
    return "إربد";
  }

  if (
    lower.includes("zarqa") ||
    cleanedLocation.includes("الزرقاء")
  ) {
    return "الزرقاء";
  }

  if (
    lower.includes("aqaba") ||
    cleanedLocation.includes("العقبة")
  ) {
    return "العقبة";
  }

  return "عن بعد";
};

const normalizeExperience = (
  title: string,
  description: string
) => {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("junior") ||
    text.includes("entry") ||
    text.includes("fresh") ||
    text.includes("intern")
  ) {
    return "مبتدئ";
  }

  if (
    text.includes("senior") ||
    text.includes("lead") ||
    text.includes("principal") ||
    text.includes("staff")
  ) {
    return "متقدم";
  }

  return "متوسط";
};

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
    category?:
      | "frontend"
      | "backend"
      | "mobile"
      | "ux"
      | "devops";
  }> = [
    {
      name: "React",
      patterns: [
        /\breact\b/i,
        /\breactjs\b/i,
        /\breact js\b/i,
      ],
      category: "frontend",
    },
    {
      name: "TypeScript",
      patterns: [
        /\btypescript\b/i,
        /\btype script\b/i,
      ],
      category: "frontend",
    },
    {
      name: "JavaScript",
      patterns: [
        /\bjavascript\b/i,
        /\bjava script\b/i,
      ],
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
      patterns: [
        /\bvue\b/i,
        /\bvuejs\b/i,
        /\bvue js\b/i,
      ],
      category: "frontend",
    },
    {
      name: "Next.js",
      patterns: [
        /\bnextjs\b/i,
        /\bnext js\b/i,
      ],
      category: "frontend",
    },

    {
      name: "Node.js",
      patterns: [
        /\bnode\b/i,
        /\bnodejs\b/i,
        /\bnode js\b/i,
      ],
      category: "backend",
    },
    {
      name: "Express",
      patterns: [
        /\bexpress\b/i,
        /\bexpressjs\b/i,
        /\bexpress js\b/i,
      ],
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
      patterns: [
        /\bspring boot\b/i,
        /\bspringboot\b/i,
      ],
      category: "backend",
    },
    {
      name: "Ruby",
      patterns: [/\bruby\b/i],
      category: "backend",
    },
    {
      name: "Ruby on Rails",
      patterns: [
        /\bruby on rails\b/i,
        /\brails\b/i,
      ],
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
      patterns: [
        /\bmysql\b/i,
        /\bmy sql\b/i,
      ],
    },
    {
      name: "PostgreSQL",
      patterns: [
        /\bpostgresql\b/i,
        /\bpostgres\b/i,
      ],
    },
    {
      name: "MongoDB",
      patterns: [
        /\bmongodb\b/i,
        /\bmongo db\b/i,
      ],
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
      patterns: [
        /\bgraphql\b/i,
        /\bgraph ql\b/i,
      ],
    },

    {
      name: "Git",
      patterns: [/\bgit\b/i],
      category: "devops",
    },
    {
      name: "GitHub",
      patterns: [
        /\bgithub\b/i,
        /\bgit hub\b/i,
      ],
      category: "devops",
    },
    {
      name: "Docker",
      patterns: [/\bdocker\b/i],
      category: "devops",
    },
    {
      name: "Kubernetes",
      patterns: [
        /\bkubernetes\b/i,
        /\bk8s\b/i,
      ],
      category: "devops",
    },
    {
      name: "AWS",
      patterns: [
        /\baws\b/i,
        /\bamazon web services\b/i,
      ],
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
      patterns: [
        /\bci cd\b/i,
        /\bcontinuous integration\b/i,
      ],
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
      patterns: [
        /\bui design\b/i,
        /\buser interface design\b/i,
      ],
      category: "ux",
    },
    {
      name: "UX Design",
      patterns: [
        /\bux design\b/i,
        /\buser experience design\b/i,
      ],
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
      patterns: [
        /\bdata analysis\b/i,
        /\bdata analytics\b/i,
      ],
    },
  ];

  const detectedDetailedSkills = skillDefinitions
    .filter((definition) =>
      definition.patterns.some((pattern) =>
        pattern.test(normalizedText)
      )
    )
    .map((definition) => definition.name);

  const detectedProfileSkills = profileSkills.filter(
    (skill) => {
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
    }
  );

  const detailedSkills = Array.from(
    new Map(
      [
        ...detectedDetailedSkills,
        ...detectedProfileSkills,
      ].map((skill) => [
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
          normalizeSkill(skill) ===
          normalizeSkill(definition.name)
      )
  );

  const hasBackendDetails = skillDefinitions.some(
    (definition) =>
      definition.category === "backend" &&
      detailedSkills.some(
        (skill) =>
          normalizeSkill(skill) ===
          normalizeSkill(definition.name)
      )
  );

  const hasMobileDetails = skillDefinitions.some(
    (definition) =>
      definition.category === "mobile" &&
      detailedSkills.some(
        (skill) =>
          normalizeSkill(skill) ===
          normalizeSkill(definition.name)
      )
  );

  const hasUxDetails = skillDefinitions.some(
    (definition) =>
      definition.category === "ux" &&
      detailedSkills.some(
        (skill) =>
          normalizeSkill(skill) ===
          normalizeSkill(definition.name)
      )
  );

  const hasDevOpsDetails = skillDefinitions.some(
    (definition) =>
      definition.category === "devops" &&
      detailedSkills.some(
        (skill) =>
          normalizeSkill(skill) ===
          normalizeSkill(definition.name)
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
        normalizeSkill(skill) ===
          normalizeSkill("REST API") ||
        normalizeSkill(skill) ===
          normalizeSkill("GraphQL")
    )
  ) {
    generalSkills.push("API");
  }

  return Array.from(
    new Map(
      [...detailedSkills, ...generalSkills].map(
        (skill) => [
          normalizeSkill(skill),
          skill,
        ]
      )
    ).values()
  ).slice(0, 10);
};

const calculateMatch = (
  skills: string[],
  requirements: string[]
) => {
  if (
    skills.length === 0 ||
    requirements.length === 0
  ) {
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

  const matchedRequirements =
    normalizedRequirements.filter((requirement) =>
      normalizedSkills.has(requirement)
    );

  return Math.round(
    (matchedRequirements.length /
      normalizedRequirements.length) *
      100
  );
};

export function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] =
    useState<JobDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadJobDetails = async () => {
      if (!jobId) {
        toast.error("رقم الوظيفة غير موجود");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const {
          data: jobData,
          error: jobError,
        } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", jobId)
          .maybeSingle();

        if (jobError) {
          console.error(
            "Job details error:",
            jobError
          );
          toast.error(
            "فشل تحميل تفاصيل الوظيفة"
          );
          return;
        }

        if (!jobData) {
          toast.error("الوظيفة غير موجودة");
          return;
        }

        let skills: string[] = [];

        if (user) {
          const {
            data: profileData,
            error: profileError,
          } = await supabase
            .from("profile")
            .select("skills")
            .eq("user_id", user.id)
            .maybeSingle();

          if (profileError) {
            console.error(
              "Profile skills error:",
              profileError
            );
          }

          skills = profileData?.skills
            ? String(profileData.skills)
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            : [];
        }

        const description = cleanText(
          jobData.description || ""
        );

        const requirements =
          extractRequirements(
            `${jobData.title || ""} ${
              jobData.requirements || ""
            } ${description}`
          );

        setJob({
          id: String(jobData.id),
          title:
            jobData.title ||
            "وظيفة بدون عنوان",
          company:
            jobData.company ||
            "شركة غير محددة",
          location: normalizeLocation(
            jobData.location || ""
          ),
          salary:
            jobData.salary || "غير محدد",
          type:
            jobData.type || "دوام كامل",
          experience: normalizeExperience(
            jobData.title || "",
            description
          ),
          description:
            description ||
            "لا يوجد وصف متوفر لهذه الوظيفة.",
          requirements,
          matchPercentage: calculateMatch(
            skills,
            requirements
          ),
          postedDate:
            jobData.posted_date ||
            "غير محدد",
          url: jobData.url || null,
        });
      } catch (error) {
        console.error(
          "Unexpected job details error:",
          error
        );
        toast.error(
          "حدث خطأ أثناء تحميل الوظيفة"
        );
      } finally {
        setLoading(false);
      }
    };

    loadJobDetails();
  }, [jobId, user]);

  const handleApply = () => {
    if (!job?.url) {
      toast.error(
        "لا يوجد رابط تقديم لهذه الوظيفة"
      );
      return;
    }

    window.open(
      job.url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleSaveJob = async () => {
    if (!user) {
      toast.error(
        "يجب تسجيل الدخول أولًا"
      );
      return;
    }

    if (!job) {
      return;
    }

    try {
      setSaving(true);

      const {
        data: existingJob,
        error: existingError,
      } = await supabase
        .from("saved_jobs")
        .select("id")
        .eq("user_id", user.id)
        .eq("job_id", job.id)
        .maybeSingle();

      if (existingError) {
        console.error(
          "Saved job check error:",
          existingError
        );
        toast.error(
          "تعذر التحقق من الوظيفة المحفوظة"
        );
        return;
      }

      if (existingJob) {
        toast.info(
          "هذه الوظيفة محفوظة مسبقًا"
        );
        return;
      }

      const { error } = await supabase
        .from("saved_jobs")
        .insert({
          user_id: user.id,
          job_id: job.id,
          url: job.url || null,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          type: job.type,
          experience: job.experience,
          description: job.description,
          requirements:
            job.requirements.join(", "),
          match_percentage:
            job.matchPercentage,
          posted_date: job.postedDate,
        });

      if (error) {
        console.error(
          "Save job error:",
          error
        );
        toast.error("فشل حفظ الوظيفة");
        return;
      }

      toast.success(
        "تم حفظ الوظيفة بنجاح ✅"
      );
    } catch (error) {
      console.error(
        "Unexpected save job error:",
        error
      );
      toast.error(
        "حدث خطأ أثناء حفظ الوظيفة"
      );
    } finally {
      setSaving(false);
    }
  };

  const getMatchClasses = (
    percentage: number
  ) => {
    if (percentage >= 80) {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (percentage >= 60) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    return "bg-orange-50 text-orange-700 border-orange-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto max-w-5xl px-4">
          <Skeleton className="mb-6 h-10 w-40" />

          <Card className="p-8">
            <Skeleton className="mb-4 h-10 w-3/4" />
            <Skeleton className="mb-8 h-6 w-1/2" />
            <Skeleton className="mb-3 h-5 w-full" />
            <Skeleton className="mb-3 h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </Card>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto max-w-5xl px-4">
          <Card className="p-12 text-center">
            <Briefcase className="mx-auto mb-4 h-14 w-14 text-gray-400" />

            <h1 className="mb-3 text-2xl font-bold text-gray-900">
              الوظيفة غير موجودة
            </h1>

            <p className="mb-6 text-gray-600">
              قد تكون الوظيفة حُذفت أو أن الرابط غير صحيح.
            </p>

            <Button
              onClick={() =>
                navigate("/jobs")
              }
            >
              العودة إلى الوظائف
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8"
      dir="rtl"
    >
      <div className="container mx-auto max-w-5xl px-4">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowRight className="h-4 w-4" />
          رجوع
        </Button>

        <Card className="overflow-hidden">
          <div className="border-b bg-gradient-to-l from-blue-50 to-white p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
                  {job.title}
                </h1>

                <div className="flex items-center gap-2 text-lg font-semibold text-blue-600">
                  <Building2 className="h-5 w-5" />
                  {job.company}
                </div>
              </div>

              <div
                className={`min-w-28 rounded-xl border px-5 py-3 text-center ${getMatchClasses(
                  job.matchPercentage
                )}`}
              >
                <div className="text-3xl font-bold">
                  {job.matchPercentage}%
                </div>

                <div className="text-sm">
                  نسبة التوافق
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                <MapPin className="h-5 w-5 text-blue-600" />

                <div>
                  <p className="text-xs text-gray-500">
                    الموقع
                  </p>
                  <p className="font-semibold text-gray-900">
                    {job.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                <DollarSign className="h-5 w-5 text-blue-600" />

                <div>
                  <p className="text-xs text-gray-500">
                    الراتب
                  </p>
                  <p className="font-semibold text-gray-900">
                    {job.salary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                <Briefcase className="h-5 w-5 text-blue-600" />

                <div>
                  <p className="text-xs text-gray-500">
                    نوع العمل
                  </p>
                  <p className="font-semibold text-gray-900">
                    {job.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                <Clock className="h-5 w-5 text-blue-600" />

                <div>
                  <p className="text-xs text-gray-500">
                    تاريخ النشر
                  </p>
                  <p className="font-semibold text-gray-900">
                    {job.postedDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                وصف الوظيفة
              </h2>

              <p className="whitespace-pre-line leading-8 text-gray-700">
                {job.description}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                المهارات المطلوبة
              </h2>

              {job.requirements.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map(
                    (requirement, index) => (
                      <Badge
                        key={`${requirement}-${index}`}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {requirement}
                      </Badge>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500">
                  لم يتم تحديد مهارات لهذه الوظيفة.
                </p>
              )}
            </div>

            <div className="mb-8">
              <Badge
                variant="outline"
                className="gap-2 px-4 py-2"
              >
                <TrendingUp className="h-4 w-4" />
                المستوى الوظيفي:{" "}
                {job.experience}
              </Badge>
            </div>

            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
              <Button
                className="flex-1 gap-2"
                onClick={handleApply}
              >
                التقديم من الموقع الأصلي
                <ExternalLink className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="flex-1"
                disabled={saving}
                onClick={handleSaveJob}
              >
                {saving
                  ? "جاري الحفظ..."
                  : "حفظ الوظيفة"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}