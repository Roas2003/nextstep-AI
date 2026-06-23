
import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  ExternalLink,
  Search,
  Filter,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

interface Job {
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
  url?: string;
}

export function JobMatching() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cleanText = (text: string) =>
    text
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();

  const normalizeLocation = (location: string) => {
    const lower = location.toLowerCase();

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

    if (lower.includes("amman") || location.includes("عمان")) return "عمان";
    if (lower.includes("irbid") || location.includes("إربد") || location.includes("اربد")) return "إربد";
    if (lower.includes("zarqa") || location.includes("الزرقاء")) return "الزرقاء";
    if (lower.includes("aqaba") || location.includes("العقبة")) return "العقبة";

    return "عن بعد";
  };

  const normalizeExperience = (title: string, description: string) => {
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
      category?: "frontend" | "backend" | "mobile" | "ux" | "devops";
    }> = [
      // Frontend
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
  
      // Backend
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
  
      // Database and API
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
  
      // DevOps and cloud
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
  
      // Mobile
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
  
      // Design
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
  
      // AI and data
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
  
    /*
     * ندخل أيضًا مهارات المستخدم إذا كانت مذكورة فعلًا
     * في عنوان الوظيفة أو وصفها، حتى لو لم تكن بالقائمة السابقة.
     */
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
          (skill) => normalizeSkill(skill) === normalizeSkill(definition.name)
        )
    );
  
    const hasBackendDetails = skillDefinitions.some(
      (definition) =>
        definition.category === "backend" &&
        detailedSkills.some(
          (skill) => normalizeSkill(skill) === normalizeSkill(definition.name)
        )
    );
  
    const hasMobileDetails = skillDefinitions.some(
      (definition) =>
        definition.category === "mobile" &&
        detailedSkills.some(
          (skill) => normalizeSkill(skill) === normalizeSkill(definition.name)
        )
    );
  
    const hasUxDetails = skillDefinitions.some(
      (definition) =>
        definition.category === "ux" &&
        detailedSkills.some(
          (skill) => normalizeSkill(skill) === normalizeSkill(definition.name)
        )
    );
  
    const hasDevOpsDetails = skillDefinitions.some(
      (definition) =>
        definition.category === "devops" &&
        detailedSkills.some(
          (skill) => normalizeSkill(skill) === normalizeSkill(definition.name)
        )
    );
  
    /*
     * لا نعرض Frontend أو Backend إذا وجدنا تقنيات مفصلة.
     * نعرض التصنيف العام فقط عندما لا يوفر الوصف تفاصيل أكثر.
     */
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
  const calculateMatch = (
    skills: string[],
    requirements: string[]
  ) => {
    if (skills.length === 0 || requirements.length === 0) {
      return 0;
    }
  
    const normalizedSkills = new Set(
      skills.map((skill) => normalizeSkill(skill))
    );
  
    /*
     * نضيف التصنيف العام بناءً على المهارات الفعلية للمستخدم.
     * هذا لا يحذف المهارات الأصلية ولا يعطي توافقًا عشوائيًا.
     */
  
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
    const loadJobs = async () => {
      setIsLoading(true);

      try {
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profile")
          .select("skills")
          .eq("user_id", user.id)
          .maybeSingle();

        const skills = profile?.skills
          ? String(profile.skills)
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : [];

        setUserSkills(skills);

        const { data: jobsData, error } = await supabase
          .from("jobs")
          .select("*");

        if (error) {
          console.error(error);
          toast.error("فشل تحميل الوظائف");
          return;
        }

        const finalJobs: Job[] = (jobsData || []).map((job) => {
          const cleanDescription = cleanText(job.description || "");
          const requirements = extractRequirements(
            `${job.title || ""} ${job.requirements || ""} ${cleanDescription}`
          );

          return {
            id: String(job.id),
            title: job.title || "وظيفة بدون عنوان",
            company: job.company || "شركة غير محددة",
            location: normalizeLocation(job.location || ""),
            salary: job.salary || "غير محدد",
            type: job.type || "دوام كامل",
            experience: normalizeExperience(job.title || "", cleanDescription),
            description: cleanDescription.slice(0, 300) + "...",
            requirements,
            matchPercentage: calculateMatch(
              skills,
              requirements
            ),
            postedDate: job.posted_date || "غير محدد",
            url: job.url,
          };
        });
        console.table(
          finalJobs.map((job) => ({
            title: job.title,
            requirements: job.requirements.join(", "),
            matchPercentage: job.matchPercentage,
          }))
        );


        const matchedJobs = finalJobs
        .filter((job) => job.matchPercentage > 0)
        .sort((a, b) => b.matchPercentage - a.matchPercentage);
      
      setJobs(matchedJobs);
      setFilteredJobs(matchedJobs);
      } catch (error) {
        console.error("Jobs error:", error);
        toast.error("حدث خطأ أثناء تحميل الوظائف");
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [user, location.key]);
  useEffect(() => {
    let filtered = jobs;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((job) => job.location === locationFilter);
    }

    if (experienceFilter !== "all") {
      filtered = filtered.filter((job) => job.experience === experienceFilter);
    }

    filtered = [...filtered].sort(
      (a, b) => b.matchPercentage - a.matchPercentage
    );

    setFilteredJobs(filtered);
  }, [searchQuery, locationFilter, experienceFilter, jobs]);

  const handleViewDetails = (jobId: string) => {
    navigate(`/jobs/${encodeURIComponent(jobId)}`);
  };

  const handleApply = (job: Job) => {
    if (job.url) {
      window.open(job.url, "_blank");
    } else {
      toast.error("لا يوجد رابط تقديم لهذه الوظيفة");
    }
  };

  const handleSaveJob = async (job: Job) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    const { data: existingJob } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("user_id", user.id)
      .eq("job_id", job.id)
      .maybeSingle();

    if (existingJob) {
      toast.info("هذه الوظيفة محفوظة مسبقًا");
      return;
    }

    const { error } = await supabase.from("saved_jobs").insert({
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
      requirements: job.requirements.join(", "),
      match_percentage: job.matchPercentage,
      posted_date: job.postedDate,
    });

    if (error) {
      console.error(error);
      toast.error("فشل حفظ الوظيفة");
    } else {
      toast.success("تم حفظ الوظيفة بنجاح ✅");
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-50";
    if (percentage >= 60) return "text-blue-600 bg-blue-50";
    return "text-orange-600 bg-orange-50";
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Briefcase className="w-10 h-10 text-blue-600" />
            الوظائف المتاحة
          </h1>

          <p className="text-gray-600">
            اكتشف أفضل الفرص الوظيفية المناسبة لمهاراتك
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="mb-4">
            <p className="font-bold text-gray-900 mb-2">
              مهاراتك المستخدمة في التحليل:
            </p>

            <div className="flex flex-wrap gap-2">
              {userSkills.length > 0 ? (
                userSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-500 text-sm">
                  لا توجد مهارات محفوظة
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="ابحث عن وظيفة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <select
  value={locationFilter}
  onChange={(e) => setLocationFilter(e.target.value)}
  className="border rounded-md px-3 py-2"
>
  <option value="all">جميع المواقع</option>
</select>

            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
             <option value="all">جميع المستويات</option>
<option value="مبتدئ">مبتدئ</option>
<option value="متقدم">متقدم</option>
            </select>
          </div>
        </Card>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            تم العثور على{" "}
            <span className="font-bold text-gray-900">{filteredJobs.length}</span>{" "}
            وظيفة
          </p>

          <Badge variant="secondary" className="gap-2">
            <Filter className="w-4 h-4" />
            مرتبة حسب نسبة التوافق
          </Badge>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="p-6">
                <Skeleton className="w-3/4 h-7 mb-3" />
                <Skeleton className="w-1/2 h-5 mb-4" />
                <Skeleton className="w-full h-5 mb-2" />
              </Card>
            ))
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {job.title}
                        </h3>

                        <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                          <Building2 className="w-5 h-5" />
                          {job.company}
                        </div>
                      </div>

                      <div
                        className={`px-4 py-2 rounded-lg font-bold text-2xl ${getMatchColor(
                          job.matchPercentage
                        )}`}
                      >
                        {job.matchPercentage}%
                        <div className="text-xs font-normal">توافق</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{job.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">{job.salary}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">{job.type}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{job.postedDate}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-2">
                        المهارات المطلوبة:
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <Badge key={index} variant="secondary">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Badge variant="secondary" className="gap-2">
                      <TrendingUp className="w-3 h-3" />
                      المستوى: {job.experience}
                    </Badge>
                  </div>

             <div className="flex flex-col gap-3 lg:w-48">
  <Button
    className="w-full"
    onClick={() => handleViewDetails(job.id)}
  >
    عرض التفاصيل
  </Button>

  <Button
    variant="outline"
    onClick={() => handleApply(job)}
    className="w-full gap-2"
  >
    تقديم الآن
    <ExternalLink className="w-4 h-4" />
  </Button>

  <Button
    variant="outline"
    className="w-full"
    onClick={() => handleSaveJob(job)}
  >
    حفظ الوظيفة
  </Button>
</div>
                </div>
              </Card>
            ))
          )}
        </div>

        {filteredJobs.length === 0 && !isLoading && (
          <Card className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              لا توجد وظائف مطابقة
            </h3>

            <p className="text-gray-600">
              جربي تغيير البحث أو الفلاتر
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

