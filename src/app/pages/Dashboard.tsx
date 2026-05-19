import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  FileText,
  Briefcase,
  Target,
  Award,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

interface SavedResume {
  id: string;
  name: string;
  lastModified: string;
  skills: string[];
}

interface SuggestedJob {
  title: string;
  match: number;
  reason: string;
}

export function Dashboard() {
  const { user } = useAuth();

  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        toast.error("فشل تحميل البيانات");
        setIsLoading(false);
        return;
      }

      if (data) {
        const skills = data.skills
          ? String(data.skills)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        setUserSkills(skills);

        setSavedResumes([
          {
            id: "1",
            name: data.name || "سيرة ذاتية",
            lastModified: new Date().toLocaleDateString(),
            skills,
          },
        ]);
      }

      setIsLoading(false);
    };

    loadData();
  }, [user]);

  const hasSkill = (keywords: string[]) => {
    return userSkills.some((skill) =>
      keywords.some((keyword) =>
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  const getSuggestedJobs = (): SuggestedJob[] => {
    const jobs: SuggestedJob[] = [];

    if (hasSkill(["react", "javascript", "html", "css", "frontend"])) {
      jobs.push({
        title: "Frontend Developer",
        match: 95,
        reason: "مناسب لأن عندك مهارات واجهات مثل React / JavaScript / HTML / CSS",
      });
    }

    if (hasSkill(["node", "express", "api", "backend", "database", "supabase"])) {
      jobs.push({
        title: "Backend Developer",
        match: 88,
        reason: "مناسب لأن عندك مهارات Backend أو Database أو Supabase",
      });
    }

    if (hasSkill(["ui", "ux", "figma", "design"])) {
      jobs.push({
        title: "UI/UX Designer",
        match: 90,
        reason: "مناسب لأن عندك مهارات تصميم وتجربة مستخدم",
      });
    }

    if (hasSkill(["python", "ai", "machine learning", "data"])) {
      jobs.push({
        title: "AI / Data Assistant",
        match: 85,
        reason: "مناسب لأن عندك مهارات Python أو AI أو Data",
      });
    }

    if (jobs.length === 0) {
      jobs.push({
        title: "Junior Software Developer",
        match: 70,
        reason: "مناسب كبداية لأنك بدأتِ ببناء سيرة ومهارات تقنية",
      });
    }

    return jobs;
  };

  const suggestedJobs = getSuggestedJobs();

  const averageMatch = suggestedJobs.length
    ? Math.round(
        suggestedJobs.reduce((sum, job) => sum + job.match, 0) /
          suggestedJobs.length
      )
    : 0;

  const stats = [
    {
      icon: FileText,
      label: "السير الذاتية",
      value: savedResumes.length,
      link: "/resume",
    },
    {
      icon: Briefcase,
      label: "وظائف مقترحة",
      value: suggestedJobs.length,
      link: "/dashboard",
    },
    {
      icon: Target,
      label: "المهارات",
      value: userSkills.length,
      link: "/skills",
    },
    {
      icon: Award,
      label: "التوافق",
      value: `${averageMatch}%`,
      link: "/dashboard",
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;

            return (
              <Link key={i} to={stat.link}>
                <Card className="p-4 text-center hover:shadow-md transition">
                  <Icon className="mx-auto mb-2" />
                  <p>{stat.label}</p>
                  <h2 className="text-xl font-bold">{stat.value}</h2>
                </Card>
              </Link>
            );
          })}
        </div>

        <Tabs defaultValue="resumes">
          <TabsList className="mb-4">
            <TabsTrigger value="resumes">السيرة</TabsTrigger>
            <TabsTrigger value="skills">المهارات</TabsTrigger>
            <TabsTrigger value="jobs">وظائف مقترحة</TabsTrigger>
          </TabsList>

          <TabsContent value="resumes">
            {isLoading ? (
              <DashboardSkeleton />
            ) : savedResumes.length > 0 ? (
              savedResumes.map((resume) => (
                <Card key={resume.id} className="p-4 mb-4">
                  <h3 className="font-bold">{resume.name}</h3>
                  <p className="text-sm text-gray-500">
                    آخر تعديل: {resume.lastModified}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {resume.skills.map((skill, i) => (
                      <Badge key={i}>{skill}</Badge>
                    ))}
                  </div>

                  <Link to="/resume">
                    <Button className="mt-3">تعديل السيرة</Button>
                  </Link>
                </Card>
              ))
            ) : (
              <Card className="p-6">
                <p>ما في بيانات. أنشئي سيرة ذاتية أولاً.</p>
                <Link to="/resume">
                  <Button className="mt-3">إنشاء سيرة</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="skills">
            <Card className="p-4">
              <h3 className="font-bold mb-3">مهاراتك الحالية</h3>

              {userSkills.length > 0 ? (
                userSkills.map((skill, i) => (
                  <Badge key={i} className="m-1">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p>ما في مهارات</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="space-y-4">
              {suggestedJobs.map((job, i) => (
                <Card key={i} className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-lg">{job.title}</h3>
                  </div>

                  <p className="text-gray-600 mb-3">{job.reason}</p>

                  <div className="mb-2 flex justify-between text-sm">
                    <span>نسبة التوافق</span>
                    <span>{job.match}%</span>
                  </div>

                  <Progress value={job.match} />

                  <Button
                    className="mt-4"
                    onClick={() => {
                      localStorage.setItem("selectedJob", job.title);
                      window.location.href = "/resume";
                    }}
                  >
                    حسّني السيرة لهذه الوظيفة
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}