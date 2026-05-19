import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
  logo?: string;
}

export function JobMatching() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeAIJobs = (aiJobs: any[]): Job[] => {
    return aiJobs.map((job, index) => ({
      id: String(index + 1),
      title: job.title || "وظيفة تقنية مقترحة",
      company: job.company || "AI Suggested Company",
      location: job.location || "Remote",
      salary: job.salary || "غير محدد",
      type: job.type || "دوام كامل",
      experience: job.experience || "مناسب حسب المهارات",
      description:
        job.description ||
        "تم اقتراح هذه الوظيفة بناءً على تحليل مهاراتك باستخدام الذكاء الاصطناعي.",
      requirements: Array.isArray(job.requirements) ? job.requirements : userSkills,
      matchPercentage:
        typeof job.matchPercentage === "number" ? job.matchPercentage : 80,
      postedDate: job.postedDate || "AI Recommendation",
    }));
  };

  const getFallbackJobs = (skills: string[]): Job[] => {
    return [
      {
        id: "fallback-1",
        title: "Frontend Developer",
        company: "AI Career Assistant",
        location: "Remote",
        salary: "حسب الخبرة",
        type: "دوام كامل",
        experience: "مبتدئ - متوسط",
        description:
          "اقتراح احتياطي مناسب إذا كانت مهاراتك تحتوي على React أو JavaScript أو HTML أو CSS.",
        requirements: ["React", "JavaScript", "HTML", "CSS"],
        matchPercentage: skills.some((s) =>
          ["react", "javascript", "html", "css"].some((k) =>
            s.toLowerCase().includes(k)
          )
        )
          ? 90
          : 70,
        postedDate: "Fallback",
      },
      {
        id: "fallback-2",
        title: "Junior Software Developer",
        company: "AI Career Assistant",
        location: "Remote",
        salary: "حسب الخبرة",
        type: "دوام كامل",
        experience: "مبتدئ",
        description: "اقتراح عام مناسب كبداية للخريجين الجدد في مجال البرمجة.",
        requirements: ["Problem Solving", "Git", "Teamwork"],
        matchPercentage: 75,
        postedDate: "Fallback",
      },
    ];
  };

  useEffect(() => {
    const loadAIJobs = async () => {
      setIsLoading(true);

      try {
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profile")
          .select("skills")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error(profileError);
          toast.error("فشل تحميل مهارات المستخدم");
          setIsLoading(false);
          return;
        }

        const skills = profile?.skills
          ? String(profile.skills)
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : [];

        setUserSkills(skills);

        if (skills.length === 0) {
          toast.error("أضيفي مهارات في السيرة الذاتية أولاً");
          const fallback = getFallbackJobs([]);
          setJobs(fallback);
          setFilteredJobs(fallback);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.functions.invoke("suggest-jobs", {
          body: { skills },
        });
        if (error) {
          console.error("AI function error:", error);
        
          const context = (error as any).context;
          if (context) {
            const errorText = await context.text();
            console.error("AI function real error:", errorText);
          }
        
          throw new Error(error.message);
        }
        const aiJobs = Array.isArray(data)
          ? data
          : Array.isArray(data?.jobs)
          ? data.jobs
          : [];

        if (aiJobs.length === 0) {
          throw new Error("AI returned empty jobs");
        }

        const normalizedJobs = normalizeAIJobs(aiJobs);

        setJobs(normalizedJobs);
        setFilteredJobs(normalizedJobs);
      } catch (error) {
        console.error("AI jobs error:", error);
        toast.error("تعذر جلب الوظائف من AI، تم عرض اقتراحات احتياطية");

        const fallback = getFallbackJobs(userSkills);
        setJobs(fallback);
        setFilteredJobs(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    loadAIJobs();
  }, [user]);

  useEffect(() => {
    let filtered = jobs;

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (cityFilter !== "all") {
      filtered = filtered.filter((job) => job.location === cityFilter);
    }

    if (experienceFilter !== "all") {
      filtered = filtered.filter((job) =>
        job.experience.includes(experienceFilter)
      );
    }

    filtered = [...filtered].sort(
      (a, b) => b.matchPercentage - a.matchPercentage
    );

    setFilteredJobs(filtered);
  }, [searchQuery, cityFilter, experienceFilter, jobs]);

  const handleApply = (job: Job) => {
    toast.success(`تم التقديم على وظيفة ${job.title} بنجاح!`);
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
            اكتشف أفضل الفرص الوظيفية المناسبة لمهاراتك باستخدام AI
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
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

            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="المدينة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المدن</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="الرياض">الرياض</SelectItem>
                <SelectItem value="جدة">جدة</SelectItem>
                <SelectItem value="الدمام">الدمام</SelectItem>
                <SelectItem value="الخبر">الخبر</SelectItem>
              </SelectContent>
            </Select>

            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="سنوات الخبرة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                <SelectItem value="مبتدئ">مبتدئ</SelectItem>
                <SelectItem value="متوسط">متوسط</SelectItem>
                <SelectItem value="3-5">3-5 سنوات</SelectItem>
                <SelectItem value="5+">5+ سنوات</SelectItem>
              </SelectContent>
            </Select>
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
            مرتبة حسب توافق AI
          </Badge>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Skeleton className="w-3/4 h-7 mb-3" />
                        <Skeleton className="w-1/2 h-5" />
                      </div>
                      <Skeleton className="w-20 h-16" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <Skeleton className="w-full h-5" />
                      <Skeleton className="w-full h-5" />
                      <Skeleton className="w-full h-5" />
                      <Skeleton className="w-full h-5" />
                    </div>

                    <Skeleton className="w-full h-5 mb-2" />
                    <Skeleton className="w-full h-5 mb-2" />
                    <Skeleton className="w-2/3 h-5" />
                  </div>

                  <div className="flex flex-col gap-3 lg:w-48">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
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
                        <div className="text-xs font-normal">توافق AI</div>
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
                        المتطلبات:
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => {
                          const hasSkill = userSkills.some((skill) =>
                            skill.toLowerCase().includes(req.toLowerCase())
                          );

                          return (
                            <Badge
                              key={index}
                              className={
                                hasSkill
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }
                            >
                              {req}
                              {hasSkill && " ✓"}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <Badge variant="secondary" className="gap-2">
                      <TrendingUp className="w-3 h-3" />
                      خبرة مطلوبة: {job.experience}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-3 lg:w-48">
                    <Button onClick={() => handleApply(job)} className="w-full gap-2">
                      تقديم الآن
                      <ExternalLink className="w-4 h-4" />
                    </Button>

                    <Button variant="outline" className="w-full">
                      حفظ الوظيفة
                    </Button>

                    <Button variant="ghost" className="w-full">
                      عرض التفاصيل
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
              جرب تعديل معايير البحث أو أضف مهارات أكثر في السيرة الذاتية
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}