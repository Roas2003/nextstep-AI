
import * as React from "react";
import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../components/ui/tabs";

import {
  Target,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Sparkles
} from "lucide-react";

import { Link } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;


interface Course {
  id: string;
  title: string;
  provider: string;
  level: "مبتدئ" | "متوسط" | "متقدم";
  duration: string;
  rating: number;
  students: string;
  skill: string;
  url: string;
}

interface CareerPath {
  title: string;
  description: string;
  matchPercentage: number;
  requiredSkills: string[];
  averageSalary: string;
  growthRate: string;
}

export function SkillAnalysis() {
  const { user } = useAuth();

  const [userSkills, setUserSkills] = useState<string[]>([]);
const [selectedPath, setSelectedPath] = useState<number>(0);
const [youtubeCourses, setYoutubeCourses] = useState<Course[]>([]);
const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  useEffect(() => {
    const loadSkills = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profile")
        .select("skills")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      if (data?.skills) {
        const skillsArray = String(data.skills)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        setUserSkills(skillsArray);
      }
    };

    loadSkills();
  }, [user]);

  const normalizeSkill = (skill: string) => {
    const normalized = skill
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  
    const aliases: Record<string, string> = {
      js: "javascript",
      javascript: "javascript",
  
      ts: "typescript",
      typescript: "typescript",
  
      reactjs: "react",
      "react.js": "react",
      react: "react",
  
      node: "node.js",
      nodejs: "node.js",
      "node.js": "node.js",
  
      expressjs: "express",
      "express.js": "express",
      express: "express",
  
      rn: "react native",
      reactnative: "react native",
      "react-native": "react native",
      "react native": "react native",
  
      html5: "html",
      html: "html",
  
      css3: "css",
      css: "css",
  
      mongo: "mongodb",
      mongodb: "mongodb",
  
      postgres: "postgresql",
      postgresql: "postgresql",
  
      "api design": "api",
      restapi: "api",
      "rest api": "api",
      api: "api",
  
      vuejs: "vue",
      "vue.js": "vue",
      vue: "vue",
  
      nextjs: "next.js",
      "next.js": "next.js",
  
      golang: "go",
      go: "go",
  
      dotnet: ".net",
      ".net": ".net",
  
      csharp: "c#",
      "c#": "c#",
  
      cicd: "ci/cd",
      "ci cd": "ci/cd",
      "ci/cd": "ci/cd",
  
      php: "php",
      laravel: "laravel",
    };
  
    return aliases[normalized] || normalized;
  };
  const normalizedUserSkills = Array.from(
    new Set(userSkills.map((skill) => normalizeSkill(skill)))
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

  const careerPaths: CareerPath[] = [
    {
      title: "مطور Full Stack",

      description:
        "تطوير تطبيقات ويب كاملة باستخدام تقنيات Frontend و Backend",

        matchPercentage: calculateMatch([
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
        
        requiredSkills: [
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
        ],

      averageSalary: "15,000 - 25,000 ريال",

      growthRate: "23% سنوياً"
    },

    {
      title: "مهندس DevOps",

      description:
        "إدارة البنية التحتية والنشر المستمر للتطبيقات",

        matchPercentage: calculateMatch([
          "Linux",
          "Git",
          "Bash",
          "Docker",
          "CI/CD",
          "AWS",
          "Kubernetes",
          "Terraform",
        ]),

        requiredSkills: [
          "Linux",
          "Git",
          "Bash",
          "Docker",
          "CI/CD",
          "AWS",
          "Kubernetes",
          "Terraform",
        ],

      averageSalary: "18,000 - 30,000 ريال",

      growthRate: "27% سنوياً"
    },

    {
      title: "مطور تطبيقات الموبايل",

      description:
        "تطوير تطبيقات iOS و Android",

      matchPercentage: calculateMatch([
        "React Native",
        "Flutter",
        "Swift",
        "Kotlin"
      ]),

      requiredSkills: [
        "React Native",
        "Flutter",
        "Swift",
        "Kotlin",
        "Mobile UI/UX"
      ],

      averageSalary: "14,000 - 24,000 ريال",

      growthRate: "21% سنوياً"
    }
  ];

  const courses: Course[] = [
    {
      id: "1",
      title: "React المتقدمة - بناء تطبيقات احترافية",
      provider: "Udemy",
      level: "متقدم",
      duration: "40 ساعة",
      rating: 4.8,
      students: "125,000+",
      skill: "React",
      url: "https://www.udemy.com/topic/react/"
    },
    {
      id: "2",
      title: "Node.js و Express للمبتدئين",
      provider: "Coursera",
      level: "متوسط",
      duration: "25 ساعة",
      rating: 4.7,
      students: "85,000+",
      skill: "Node.js",
      url: "https://www.coursera.org/courses?query=nodejs"
    },
    {
      id: "3",
      title: "MongoDB من الصفر",
      provider: "MongoDB University",
      level: "متوسط",
      duration: "30 ساعة",
      rating: 4.6,
      students: "95,000+",
      skill: "MongoDB",
      url: "https://learn.mongodb.com"
    },
    {
      id: "4",
      title: "TypeScript من الصفر إلى الاحتراف",
      provider: "Udemy",
      level: "مبتدئ",
      duration: "15 ساعة",
      rating: 4.9,
      students: "65,000+",
      skill: "TypeScript",
      url: "https://www.udemy.com/topic/typescript/"
    },
    {
      id: "5",
      title: "تصميم وبناء REST APIs",
      provider: "Coursera",
      level: "متوسط",
      duration: "20 ساعة",
      rating: 4.7,
      students: "60,000+",
      skill: "API Design",
      url: "https://www.coursera.org/courses?query=api"
    },
    {
      id: "6",
      title: "Docker للمبتدئين",
      provider: "Udemy",
      level: "مبتدئ",
      duration: "18 ساعة",
      rating: 4.7,
      students: "90,000+",
      skill: "Docker",
      url: "https://www.udemy.com/topic/docker/"
    },
    {
      id: "7",
      title: "Kubernetes للمطورين",
      provider: "Pluralsight",
      level: "متوسط",
      duration: "22 ساعة",
      rating: 4.6,
      students: "55,000+",
      skill: "Kubernetes",
      url: "https://www.pluralsight.com"
    },
    {
      id: "8",
      title: "CI/CD و GitHub Actions",
      provider: "Coursera",
      level: "متوسط",
      duration: "16 ساعة",
      rating: 4.5,
      students: "40,000+",
      skill: "CI/CD",
      url: "https://www.coursera.org/courses?query=ci%20cd"
    },
    {
      id: "9",
      title: "AWS Cloud Fundamentals",
      provider: "AWS Skill Builder",
      level: "مبتدئ",
      duration: "20 ساعة",
      rating: 4.8,
      students: "100,000+",
      skill: "AWS",
      url: "https://skillbuilder.aws"
    },
    {
      id: "10",
      title: "Linux Administration Basics",
      provider: "Coursera",
      level: "مبتدئ",
      duration: "18 ساعة",
      rating: 4.6,
      students: "70,000+",
      skill: "Linux",
      url: "https://www.coursera.org/courses?query=linux"
    },
    {
      id: "11",
      title: "React Native Complete Guide",
      provider: "Udemy",
      level: "متوسط",
      duration: "30 ساعة",
      rating: 4.7,
      students: "80,000+",
      skill: "React Native",
      url: "https://www.udemy.com/topic/react-native/"
    },
    {
      id: "12",
      title: "Flutter Development Bootcamp",
      provider: "Udemy",
      level: "متوسط",
      duration: "35 ساعة",
      rating: 4.8,
      students: "100,000+",
      skill: "Flutter",
      url: "https://www.udemy.com/topic/flutter/"
    },
    {
      id: "13",
      title: "Swift for iOS Development",
      provider: "Coursera",
      level: "مبتدئ",
      duration: "25 ساعة",
      rating: 4.6,
      students: "50,000+",
      skill: "Swift",
      url: "https://www.coursera.org/courses?query=swift"
    },
    {
      id: "14",
      title: "Kotlin for Android",
      provider: "Udemy",
      level: "مبتدئ",
      duration: "22 ساعة",
      rating: 4.7,
      students: "55,000+",
      skill: "Kotlin",
      url: "https://www.udemy.com/topic/kotlin/"
    },
    {
      id: "15",
      title: "Mobile UI/UX Design",
      provider: "Coursera",
      level: "متوسط",
      duration: "18 ساعة",
      rating: 4.8,
      students: "70,000+",
      skill: "Mobile UI/UX",
      url: "https://www.coursera.org/courses?query=mobile%20ui%20ux"
    }
  ];
  const missingSkills =
  careerPaths[selectedPath].requiredSkills.filter(
    (skill) =>
      !normalizedUserSkills.includes(normalizeSkill(skill))
  );
  
  const recommendedCourses = courses.filter((course) =>
    missingSkills.some(
      (skill) =>
        normalizeSkill(course.skill) === normalizeSkill(skill)
    )
  );
  const fetchYouTubeCourses = async () => {
    try {
      if (!YOUTUBE_API_KEY || missingSkills.length === 0) {
        setYoutubeCourses([]);
        return;
      }
  
      setIsLoadingCourses(true);
  
      const skillsToSearch = missingSkills.slice(0, 4);
  
      const results = await Promise.all(
        skillsToSearch.map(async (skill) => {
          const query = `${skill} full course tutorial`;
  
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
              query
            )}&key=${YOUTUBE_API_KEY}`
          );
  
          const data = await response.json();
          const item = data.items?.[0];
  
          if (!item) return null;
  
          return {
            id: item.id.videoId,
            title: item.snippet.title,
            provider: item.snippet.channelTitle,
            level: "مبتدئ" as const,
            duration: "YouTube",
            rating: 4.8,
            students: "YouTube",
            skill: skill,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          };
        })
      );
  
      setYoutubeCourses(results.filter(Boolean) as Course[]);
    } catch (error) {
      console.error("Failed to fetch YouTube courses:", error);
      setYoutubeCourses([]);
    } finally {
      setIsLoadingCourses(false);
    }
  };
  useEffect(() => {
    fetchYouTubeCourses();
  }, [selectedPath, userSkills]);
  const skillCategories = [
    {
      category: "تطوير Frontend",
  
      userHas: [
        "React",
        "TypeScript",
        "JavaScript",
        "HTML",
        "CSS",
      ].filter((skill) =>
        normalizedUserSkills.includes(normalizeSkill(skill))
      ).length,
  
      total: 5,
    },
  
    {
      category: "تطوير Backend",
  
      userHas: [
        "Node.js",
        "Python",
        "Java",
        "PHP",
        "Laravel",
        "API",
      ].filter((skill) =>
        normalizedUserSkills.includes(normalizeSkill(skill))
      ).length,
  
      total: 6,
    },
  
    {
      category: "قواعد البيانات",
  
      userHas: [
        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "Redis",
        "Firebase",
      ].filter((skill) =>
        normalizedUserSkills.includes(normalizeSkill(skill))
      ).length,
  
      total: 5,
    },
  
    {
      category: "DevOps",
  
      userHas: [
        "Linux",
        "Git",
        "Bash",
        "Docker",
        "CI/CD",
        "AWS",
        "Kubernetes",
        "Terraform",
      ].filter((skill) =>
        normalizedUserSkills.includes(normalizeSkill(skill))
      ).length,
  
      total: 8,
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "مبتدئ":
        return "bg-green-100 text-green-700";

      case "متوسط":
        return "bg-blue-100 text-blue-700";

      case "متقدم":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-cyan-600" />
            تحليل المهارات والمسار المهني
          </h1>

          <p className="text-gray-600">
            اكتشف نقاط قوتك واحصل على اقتراحات مخصصة لتطوير مسارك المهني
          </p>

        </div>

        {userSkills.length === 0 ? (

          <Card className="p-12 text-center">

            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              لا توجد مهارات للتحليل
            </h3>

            <p className="text-gray-600 mb-6">
              قم بإضافة مهاراتك في صفحة السيرة الذاتية أولاً للحصول على تحليل مخصص
            </p>

            <Link to="/resume">
              <Button className="gap-2">

                <ArrowLeft className="w-4 h-4" />
                إضافة المهارات

              </Button>
            </Link>

          </Card>

        ) : (

          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

              {skillCategories.map((category, index) => {

                const percentage = Math.min(
                  (category.userHas / category.total) * 100,
                  100
                );

                return (
                  <Card key={index} className="p-6">

                    <div className="flex items-center justify-between mb-4">

                      <h3 className="font-bold text-gray-900">
                        {category.category}
                      </h3>

                      <Badge variant="secondary">
                        {Math.min(category.userHas, category.total)}/
                        {category.total}
                      </Badge>

                    </div>

                    <Progress value={percentage} className="mb-2" />

                    <p className="text-sm text-gray-600">
                      {percentage.toFixed(0)}% مكتمل
                    </p>

                  </Card>
                );
              })}
            </div>

            <Tabs defaultValue="careers" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">

                <TabsTrigger value="careers">
                  المسارات المهنية المقترحة
                </TabsTrigger>

                <TabsTrigger value="courses">
                  الدورات التدريبية
                </TabsTrigger>

              </TabsList>

              <TabsContent value="careers" className="space-y-6">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {careerPaths.map((path, index) => (

                    <Card
                      key={index}
                      className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                        selectedPath === index
                          ? "border-2 border-blue-500"
                          : ""
                      }`}
                      onClick={() => setSelectedPath(index)}
                    >

                      <div className="flex items-center justify-between mb-4">

                        <Target className="w-8 h-8 text-blue-600" />

                        <div className="text-right">

                          <div className="text-3xl font-bold text-blue-600">
                            {path.matchPercentage}%
                          </div>

                          <div className="text-xs text-gray-600">
                            نسبة التوافق
                          </div>

                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {path.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4">
                        {path.description}
                      </p>

                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="courses" className="space-y-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {(youtubeCourses.length > 0 ? youtubeCourses : recommendedCourses).map((course) => (
                                      <Card
                      key={course.id}
                      className="p-6 hover:shadow-lg transition-shadow"
                    >

                      <div className="flex items-start justify-between mb-4">

                        <div className="flex-1">

                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {course.title}
                          </h3>

                          <p className="text-blue-600 font-semibold mb-2">
                            {course.provider}
                          </p>

                        </div>

                        <BookOpen className="w-6 h-6 text-cyan-600 flex-shrink-0 mr-3" />
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">

                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>

                        <Badge variant="secondary">
                          {course.duration}
                        </Badge>

                        <Badge variant="secondary">
                          ⭐ {course.rating}
                        </Badge>

                      </div>

                      <Button className="w-full gap-2" asChild>

                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          عرض الدورة
                          <ExternalLink className="w-4 h-4" />
                        </a>

                      </Button>

                    </Card>
                  ))}
                </div>
              </TabsContent>

            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
