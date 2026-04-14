import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Target,
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { Link } from "react-router";

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
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<number>(0);

  useEffect(() => {
    // Load skills from saved resume
    const savedResume = localStorage.getItem("resume");
    if (savedResume) {
      const resume = JSON.parse(savedResume);
      setUserSkills(resume.skills || []);
    }
  }, []);

  const careerPaths: CareerPath[] = [
    {
      title: "مطور Full Stack",
      description: "تطوير تطبيقات ويب كاملة باستخدام تقنيات Frontend و Backend",
      matchPercentage: 85,
      requiredSkills: ["React", "Node.js", "MongoDB", "TypeScript", "API Design"],
      averageSalary: "15,000 - 25,000 ريال",
      growthRate: "23% سنوياً"
    },
    {
      title: "مهندس DevOps",
      description: "إدارة البنية التحتية والنشر المستمر للتطبيقات",
      matchPercentage: 72,
      requiredSkills: ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux"],
      averageSalary: "18,000 - 30,000 ريال",
      growthRate: "27% سنوياً"
    },
    {
      title: "مطور تطبيقات الموبايل",
      description: "تطوير تطبيقات iOS و Android",
      matchPercentage: 68,
      requiredSkills: ["React Native", "Flutter", "Swift", "Kotlin", "Mobile UI/UX"],
      averageSalary: "14,000 - 24,000 ريال",
      growthRate: "21% سنوياً"
    }
  ];

  const courses: Course[] = [
    {
      id: "1",
      title: "دورة React المتقدمة - بناء تطبيقات احترافية",
      provider: "Udemy",
      level: "متقدم",
      duration: "40 ساعة",
      rating: 4.8,
      students: "125,000+",
      skill: "React",
      url: "#"
    },
    {
      id: "2",
      title: "أساسيات Node.js و Express",
      provider: "Coursera",
      level: "متوسط",
      duration: "25 ساعة",
      rating: 4.7,
      students: "85,000+",
      skill: "Node.js",
      url: "#"
    },
    {
      id: "3",
      title: "TypeScript من الصفر إلى الاحتراف",
      provider: "Udacity",
      level: "مبتدئ",
      duration: "15 ساعة",
      rating: 4.9,
      students: "65,000+",
      skill: "TypeScript",
      url: "#"
    },
    {
      id: "4",
      title: "MongoDB - قواعد البيانات غير العلائقية",
      provider: "MongoDB University",
      level: "متوسط",
      duration: "30 ساعة",
      rating: 4.6,
      students: "95,000+",
      skill: "MongoDB",
      url: "#"
    },
    {
      id: "5",
      title: "Docker و Kubernetes للمبتدئين",
      provider: "Pluralsight",
      level: "مبتدئ",
      duration: "20 ساعة",
      rating: 4.7,
      students: "55,000+",
      skill: "DevOps",
      url: "#"
    },
    {
      id: "6",
      title: "تصميم واجهات المستخدم الحديثة",
      provider: "Design Academy",
      level: "متوسط",
      duration: "18 ساعة",
      rating: 4.8,
      students: "70,000+",
      skill: "UI/UX",
      url: "#"
    }
  ];

  const skillCategories = [
    {
      category: "تطوير Frontend",
      skills: ["React", "Vue.js", "Angular", "HTML/CSS", "JavaScript"],
      userHas: userSkills.filter(s => 
        ["React", "Vue.js", "Angular", "HTML", "CSS", "JavaScript"].some(tech => 
          s.toLowerCase().includes(tech.toLowerCase())
        )
      ).length,
      total: 5
    },
    {
      category: "تطوير Backend",
      skills: ["Node.js", "Python", "Java", "PHP", "API Design"],
      userHas: userSkills.filter(s => 
        ["Node", "Python", "Java", "PHP", "API"].some(tech => 
          s.toLowerCase().includes(tech.toLowerCase())
        )
      ).length,
      total: 5
    },
    {
      category: "قواعد البيانات",
      skills: ["MongoDB", "MySQL", "PostgreSQL", "Redis", "Firebase"],
      userHas: userSkills.filter(s => 
        ["MongoDB", "MySQL", "PostgreSQL", "Redis", "Firebase"].some(tech => 
          s.toLowerCase().includes(tech.toLowerCase())
        )
      ).length,
      total: 5
    },
    {
      category: "DevOps",
      skills: ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux"],
      userHas: userSkills.filter(s => 
        ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux"].some(tech => 
          s.toLowerCase().includes(tech.toLowerCase())
        )
      ).length,
      total: 5
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "مبتدئ": return "bg-green-100 text-green-700";
      case "متوسط": return "bg-blue-100 text-blue-700";
      case "متقدم": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
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
            {/* Skill Categories Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {skillCategories.map((category, index) => {
                const percentage = (category.userHas / category.total) * 100;
                return (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">{category.category}</h3>
                      <Badge variant="secondary">
                        {category.userHas}/{category.total}
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
                <TabsTrigger value="careers">المسارات المهنية المقترحة</TabsTrigger>
                <TabsTrigger value="courses">الدورات التدريبية</TabsTrigger>
              </TabsList>

              {/* Career Paths Tab */}
              <TabsContent value="careers" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {careerPaths.map((path, index) => (
                    <Card
                      key={index}
                      className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                        selectedPath === index ? "border-2 border-blue-500" : ""
                      }`}
                      onClick={() => setSelectedPath(index)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Target className="w-8 h-8 text-blue-600" />
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-600">
                            {path.matchPercentage}%
                          </div>
                          <div className="text-xs text-gray-600">نسبة التوافق</div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {path.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {path.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{path.averageSalary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-cyan-600" />
                          <span className="text-gray-700">نمو {path.growthRate}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Selected Path Details */}
                <Card className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    المهارات المطلوبة: {careerPaths[selectedPath].title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        المهارات المتوفرة لديك
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {careerPaths[selectedPath].requiredSkills
                          .filter(skill => 
                            userSkills.some(us => 
                              us.toLowerCase().includes(skill.toLowerCase())
                            )
                          )
                          .map((skill, index) => (
                            <Badge key={index} className="bg-green-100 text-green-700">
                              {skill}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-600" />
                        المهارات التي تحتاج إلى تطوير
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {careerPaths[selectedPath].requiredSkills
                          .filter(skill => 
                            !userSkills.some(us => 
                              us.toLowerCase().includes(skill.toLowerCase())
                            )
                          )
                          .map((skill, index) => (
                            <Badge key={index} className="bg-orange-100 text-orange-700">
                              {skill}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
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

                      <p className="text-sm text-gray-600 mb-4">
                        {course.students} طالب
                      </p>

                      <Button className="w-full gap-2" asChild>
                        <a href={course.url} target="_blank" rel="noopener noreferrer">
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
