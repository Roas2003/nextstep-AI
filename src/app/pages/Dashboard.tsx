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
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Download,
  Eye,
  Trash2
} from "lucide-react";
import { Link } from "react-router";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { safeLocalStorage } from "../utils/localStorage";
import { toast } from "sonner";

interface SavedResume {
  id: string;
  name: string;
  lastModified: string;
  skills: string[];
}

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  status: "pending" | "reviewed" | "interview" | "rejected" | "accepted";
  appliedDate: string;
}

export function Dashboard() {
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'resume' | 'application', id: string } | null>(null);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    setTimeout(() => {
      // Load saved resume using safe localStorage
      const savedResume = safeLocalStorage.getItem("resume", null);
      if (savedResume) {
        setUserSkills(savedResume.skills || []);
        setSavedResumes([
          {
            id: "1",
            name: savedResume.personalInfo?.name || "سيرة ذاتية",
            lastModified: new Date().toLocaleDateString("ar-SA"),
            skills: savedResume.skills || []
          }
        ]);
      }

      // Mock job applications
      setApplications([
        {
          id: "1",
          jobTitle: "مطور Full Stack",
          company: "شركة التقنية المتقدمة",
          status: "interview",
          appliedDate: "2026-02-08"
        },
        {
          id: "2",
          jobTitle: "مطور Frontend",
          company: "مؤسسة الحلول الذكية",
          status: "reviewed",
          appliedDate: "2026-02-06"
        },
        {
          id: "3",
          jobTitle: "مهندس DevOps",
          company: "مجموعة الابتكار الرقمي",
          status: "pending",
          appliedDate: "2026-02-05"
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  // Skill radar chart data
  const skillData = [
    { skill: "Frontend", level: 85 },
    { skill: "Backend", level: 75 },
    { skill: "Database", level: 70 },
    { skill: "DevOps", level: 60 },
    { skill: "Mobile", level: 55 },
    { skill: "Design", level: 65 }
  ];

  // Application status chart data
  const applicationStatusData = [
    { name: "قيد المراجعة", value: 1 },
    { name: "مقابلة", value: 1 },
    { name: "انتظار", value: 1 }
  ];

  const stats = [
    {
      icon: FileText,
      label: "السير الذاتية",
      value: savedResumes.length,
      color: "from-blue-500 to-blue-600",
      link: "/resume"
    },
    {
      icon: Briefcase,
      label: "التقديمات",
      value: applications.length,
      color: "from-green-500 to-green-600",
      link: "/jobs"
    },
    {
      icon: Target,
      label: "المهارات",
      value: userSkills.length,
      color: "from-purple-500 to-purple-600",
      link: "/skills"
    },
    {
      icon: Award,
      label: "التوافق المتوسط",
      value: "78%",
      color: "from-orange-500 to-orange-600",
      link: "/jobs"
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "قيد الانتظار", color: "bg-gray-100 text-gray-700" };
      case "reviewed":
        return { label: "تمت المراجعة", color: "bg-blue-100 text-blue-700" };
      case "interview":
        return { label: "مقابلة مجدولة", color: "bg-green-100 text-green-700" };
      case "rejected":
        return { label: "مرفوض", color: "bg-red-100 text-red-700" };
      case "accepted":
        return { label: "مقبول", color: "bg-emerald-100 text-emerald-700" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-700" };
    }
  };

  const handleDelete = (type: 'resume' | 'application', id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'resume') {
        setSavedResumes(savedResumes.filter(resume => resume.id !== itemToDelete.id));
        toast.success("تم حذف السيرة الذاتية بنجاح");
      } else if (itemToDelete.type === 'application') {
        setApplications(applications.filter(app => app.id !== itemToDelete.id));
        toast.success("تم حذف التقديم بنجاح");
      }
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            لوحة التحكم
          </h1>
          <p className="text-gray-600">
            نظرة شاملة على نشاطاتك ومهاراتك
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} to={stat.link}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="resumes">السير الذاتية</TabsTrigger>
            <TabsTrigger value="applications">التقديمات</TabsTrigger>
            <TabsTrigger value="skills">المهارات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills Radar Chart */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  تحليل المهارات
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={skillData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="مستوى المهارة"
                      dataKey="level"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>

              {/* Application Status Chart */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  حالة التقديمات
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={applicationStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" name="عدد التقديمات" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                إجراءات سريعة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/resume">
                  <Button className="w-full gap-2 h-auto py-4" variant="outline">
                    <FileText className="w-5 h-5" />
                    <div className="text-right">
                      <div className="font-bold">إنشاء سيرة ذاتية</div>
                      <div className="text-xs opacity-70">ابدأ بإنشاء سيرة جديدة</div>
                    </div>
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button className="w-full gap-2 h-auto py-4" variant="outline">
                    <Briefcase className="w-5 h-5" />
                    <div className="text-right">
                      <div className="font-bold">تصفح الوظائف</div>
                      <div className="text-xs opacity-70">اكتشف فرص جديدة</div>
                    </div>
                  </Button>
                </Link>
                <Link to="/skills">
                  <Button className="w-full gap-2 h-auto py-4" variant="outline">
                    <Target className="w-5 h-5" />
                    <div className="text-right">
                      <div className="font-bold">تطوير المهارات</div>
                      <div className="text-xs opacity-70">اكتشف دورات جديدة</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </Card>
          </TabsContent>

          {/* Resumes Tab */}
          <TabsContent value="resumes" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                السير الذاتية المحفوظة
              </h3>
              <Link to="/resume">
                <Button className="gap-2">
                  <FileText className="w-4 h-4" />
                  إنشاء سيرة جديدة
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <DashboardSkeleton />
            ) : savedResumes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedResumes.map((resume) => (
                  <Card key={resume.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete('resume', resume.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {resume.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      آخر تعديل: {resume.lastModified}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resume.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {resume.skills.length > 3 && (
                        <Badge variant="secondary">
                          +{resume.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link to="/resume" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Eye className="w-4 h-4" />
                          عرض
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        تنزيل
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  لا توجد سير ذاتية محفوظة
                </h3>
                <p className="text-gray-600 mb-6">
                  ابدأ بإنشاء سيرتك الذاتية الأولى الآن
                </p>
                <Link to="/resume">
                  <Button>إنشاء سيرة ذاتية</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              التقديمات على الوظائف
            </h3>

            {isLoading ? (
              <DashboardSkeleton />
            ) : applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => {
                  const statusInfo = getStatusInfo(app.status);
                  return (
                    <Card key={app.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 mb-1">
                                {app.jobTitle}
                              </h4>
                              <p className="text-gray-600 mb-2">{app.company}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>تاريخ التقديم: {app.appliedDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => handleDelete('application', app.id)}>
                            عرض التفاصيل
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  لا توجد تقديمات بعد
                </h3>
                <p className="text-gray-600 mb-6">
                  ابدأ بالتقديم على الوظائف المناسبة لك
                </p>
                <Link to="/jobs">
                  <Button>تصفح الوظائف</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              مهاراتك وتطويرها
            </h3>

            {userSkills.length > 0 ? (
              <>
                <Card className="p-6">
                  <h4 className="font-bold text-gray-900 mb-4">مهاراتك الحالية</h4>
                  <div className="flex flex-wrap gap-2">
                    {userSkills.map((skill, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-700 px-4 py-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    دورات مقترحة لتطوير مهاراتك
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        title: "React المتقدمة - بناء تطبيقات احترافية",
                        progress: 65,
                        skill: "React"
                      },
                      {
                        title: "أساسيات Node.js و Express",
                        progress: 30,
                        skill: "Node.js"
                      },
                      {
                        title: "TypeScript من الصفر إلى الاحتراف",
                        progress: 0,
                        skill: "TypeScript"
                      }
                    ].map((course, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-gray-900">{course.title}</h5>
                          <Badge variant="secondary">{course.skill}</Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={course.progress} className="flex-1" />
                          <span className="text-sm text-gray-600">{course.progress}%</span>
                        </div>
                        {course.progress > 0 && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>جاري التعلم</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Link to="/skills">
                    <Button className="w-full mt-4">
                      عرض جميع الدورات
                    </Button>
                  </Link>
                </Card>
              </>
            ) : (
              <Card className="p-12 text-center">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  لم تضف مهارات بعد
                </h3>
                <p className="text-gray-600 mb-6">
                  أضف مهاراتك في السيرة الذاتية للحصول على اقتراحات مخصصة
                </p>
                <Link to="/resume">
                  <Button>إضافة المهارات</Button>
                </Link>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title={itemToDelete?.type === 'resume' ? 'حذف السيرة الذاتية' : 'حذف التقديم'}
        description="هل أنت متأكد من أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء"
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
      />
    </div>
  );
}