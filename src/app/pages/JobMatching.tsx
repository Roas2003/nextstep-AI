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
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { safeLocalStorage } from "../utils/localStorage";

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    setTimeout(() => {
      // Load user skills from resume using safe localStorage
      const savedResume = safeLocalStorage.getItem("resume", null);
      if (savedResume) {
        setUserSkills(savedResume.skills || []);
      }

      // Mock job data
      const mockJobs: Job[] = [
        {
          id: "1",
          title: "مطور Full Stack - React & Node.js",
          company: "شركة التقنية المتقدمة",
          location: "الرياض",
          salary: "18,000 - 25,000 ريال",
          type: "دوام كامل",
          experience: "3-5 سنوات",
          description: "نبحث عن مطور Full Stack محترف للانضمام إلى فريقنا المتنامي. ستعمل على تطوير وصيانة تطبيقات ويب حديثة.",
          requirements: ["React", "Node.js", "MongoDB", "TypeScript", "REST API"],
          matchPercentage: 85,
          postedDate: "منذ يومين"
        },
        {
          id: "2",
          title: "مهندس DevOps",
          company: "مجموعة الابتكار الرقمي",
          location: "جدة",
          salary: "20,000 - 30,000 ريال",
          type: "دوام كامل",
          experience: "4-6 سنوات",
          description: "مطلوب مهندس DevOps خبير لإدارة البنية التحتية السحابية والأتمتة.",
          requirements: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform"],
          matchPercentage: 72,
          postedDate: "منذ 3 أيام"
        },
        {
          id: "3",
          title: "مطور Frontend - React",
          company: "مؤسسة الحلول الذكية",
          location: "الدمام",
          salary: "14,000 - 20,000 ريال",
          type: "دوام كامل",
          experience: "2-4 سنوات",
          description: "فرصة ممتازة للانضمام إلى فريق تطوير تطبيقات واجهة المستخدم الحديثة.",
          requirements: ["React", "JavaScript", "CSS", "HTML", "Redux"],
          matchPercentage: 90,
          postedDate: "منذ يوم"
        },
        {
          id: "4",
          title: "مطور Backend - Python",
          company: "شركة البيانات الذكية",
          location: "الرياض",
          salary: "16,000 - 24,000 ريال",
          type: "دوام كامل",
          experience: "3-5 سنوات",
          description: "نبحث عن مطور Backend متمرس في Python لبناء APIs قوية وقابلة للتوسع.",
          requirements: ["Python", "Django", "PostgreSQL", "Redis", "REST API"],
          matchPercentage: 68,
          postedDate: "منذ 4 أيام"
        },
        {
          id: "5",
          title: "مطور تطبيقات الموبايل - React Native",
          company: "تطبيقات المستقبل",
          location: "جدة",
          salary: "15,000 - 22,000 ريال",
          type: "دوام كامل",
          experience: "2-4 سنوات",
          description: "انضم لفريقنا في تطوير تطبيقات موبايل مبتكرة تخدم ملايين المستخدمين.",
          requirements: ["React Native", "JavaScript", "Mobile UI", "Redux", "Firebase"],
          matchPercentage: 78,
          postedDate: "منذ 5 أيام"
        },
        {
          id: "6",
          title: "مهندس أمن معلومات",
          company: "الأمن السيبراني المتقدم",
          location: "الرياض",
          salary: "22,000 - 35,000 ريال",
          type: "دوام كامل",
          experience: "5-7 سنوات",
          description: "فرصة رائعة للعمل على تأمين البنية التحتية وحماية البيانات الحساسة.",
          requirements: ["Security", "Penetration Testing", "Network Security", "Linux", "Python"],
          matchPercentage: 55,
          postedDate: "منذ أسبوع"
        },
        {
          id: "7",
          title: "مصمم UI/UX",
          company: "استوديو التصميم الإبداعي",
          location: "الخبر",
          salary: "12,000 - 18,000 ريال",
          type: "دوام كامل",
          experience: "2-4 سنوات",
          description: "نبحث عن مصمم UI/UX موهوب لإنشاء تجارب مستخدم استثنائية.",
          requirements: ["Figma", "Adobe XD", "UI Design", "UX Research", "Prototyping"],
          matchPercentage: 62,
          postedDate: "منذ 3 أيام"
        },
        {
          id: "8",
          title: "محلل بيانات - Data Analyst",
          company: "شركة التحليلات الذكية",
          location: "الرياض",
          salary: "15,000 - 23,000 ريال",
          type: "دوام كامل",
          experience: "2-4 سنوات",
          description: "انضم لفريق التحليلات لدينا واستخرج رؤى قيمة من البيانات الضخمة.",
          requirements: ["Python", "SQL", "Tableau", "Data Analysis", "Statistics"],
          matchPercentage: 70,
          postedDate: "منذ 6 أيام"
        }
      ];

      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    setIsFiltering(true);
    let filtered = jobs;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // City filter
    if (cityFilter !== "all") {
      filtered = filtered.filter(job => job.location === cityFilter);
    }

    // Experience filter
    if (experienceFilter !== "all") {
      filtered = filtered.filter(job => job.experience.includes(experienceFilter));
    }

    // Sort by match percentage
    filtered = [...filtered].sort((a, b) => b.matchPercentage - a.matchPercentage);

    setFilteredJobs(filtered);
    setIsFiltering(false);
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Briefcase className="w-10 h-10 text-blue-600" />
            الوظائف المتاحة
          </h1>
          <p className="text-gray-600">
            اكتشف أفضل الفرص الوظيفية المناسبة لمهاراتك
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
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
                <SelectItem value="1-2">1-2 سنوات</SelectItem>
                <SelectItem value="2-4">2-4 سنوات</SelectItem>
                <SelectItem value="3-5">3-5 سنوات</SelectItem>
                <SelectItem value="5+">5+ سنوات</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            تم العثور على <span className="font-bold text-gray-900">{filteredJobs.length}</span> وظيفة
          </p>
          <Badge variant="secondary" className="gap-2">
            <Filter className="w-4 h-4" />
            مرتبة حسب التوافق
          </Badge>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          <Skeleton className="w-full h-6" />
                        </h3>
                        <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                          <Building2 className="w-5 h-5" />
                          <Skeleton className="w-full h-4" />
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-bold text-2xl ${getMatchColor(0)}`}>
                        <Skeleton className="w-10 h-10" />
                        <div className="text-xs font-normal">توافق</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm"><Skeleton className="w-full h-4" /></span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm"><Skeleton className="w-full h-4" /></span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm"><Skeleton className="w-full h-4" /></span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm"><Skeleton className="w-full h-4" /></span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-full h-4" />
                    </p>

                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-2">المتطلبات:</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <Badge
                            key={index}
                            className={
                              "bg-gray-100 text-gray-700"
                            }
                          >
                            <Skeleton className="w-full h-4" />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Badge variant="secondary" className="gap-2">
                      <TrendingUp className="w-3 h-3" />
                      خبرة مطلوبة: <Skeleton className="w-full h-4" />
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <Button className="w-full gap-2">
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
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Job Info */}
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
                      <div className={`px-4 py-2 rounded-lg font-bold text-2xl ${getMatchColor(job.matchPercentage)}`}>
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
                      <h4 className="font-bold text-gray-900 mb-2">المتطلبات:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => {
                          const hasSkill = userSkills.some(skill =>
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

                  {/* Actions */}
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
              جرب تعديل معايير البحث للحصول على نتائج أفضل
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}