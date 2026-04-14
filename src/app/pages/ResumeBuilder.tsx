import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Plus, 
  Trash2, 
  Download,
  Eye,
  Palette,
  Save,
  CheckCircle2
} from "lucide-react";
import { ResumePreview } from "../components/ResumePreview";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { safeLocalStorage } from "../utils/localStorage";

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experiences: Experience[];
  education: Education[];
  skills: string[];
  theme: "blue" | "green" | "purple";
}

export function ResumeBuilder() {
  const [showPreview, setShowPreview] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    // Load from localStorage on init
    const saved = safeLocalStorage.getItem<ResumeData | null>("resume", null);
    return saved || {
      personalInfo: {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        summary: ""
      },
      experiences: [],
      education: [],
      skills: [],
      theme: "blue"
    };
  });

  const [newSkill, setNewSkill] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'experience' | 'education', id: string } | null>(null);

  // Auto-save every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (resumeData.personalInfo.name) {
        saveResume(true); // silent save
      }
    }, 30000); // 30 seconds

    return () => clearInterval(timer);
  }, [resumeData]);

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveResume();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resumeData]);

  // Calculate completion progress
  const calculateProgress = () => {
    let completed = 0;
    const total = 5; // personal, experience, education, skills, summary
    
    if (resumeData.personalInfo.name && resumeData.personalInfo.email) completed++;
    if (resumeData.experiences.length > 0) completed++;
    if (resumeData.education.length > 0) completed++;
    if (resumeData.skills.length > 0) completed++;
    if (resumeData.personalInfo.summary) completed++;
    
    return (completed / total) * 100;
  };

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation (Saudi format)
  const validatePhone = (phone: string) => {
    const phoneRegex = /^(05|5)[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  };

  const saveResume = (silent = false) => {
    // Validate email and phone before saving
    if (resumeData.personalInfo.email && !validateEmail(resumeData.personalInfo.email)) {
      toast.error('البريد الإلكتروني غير صحيح');
      return;
    }

    if (resumeData.personalInfo.phone && !validatePhone(resumeData.personalInfo.phone)) {
      toast.error('رقم الهاتف غير صحيح (يجب أن يبدأ بـ 05)');
      return;
    }

    setIsSaving(true);
    const success = safeLocalStorage.setItem("resume", resumeData);
    
    if (success) {
      setLastSaved(new Date());
      if (!silent) {
        toast.success('تم حفظ السيرة الذاتية بنجاح!');
      }
    } else {
      toast.error('فشل في حفظ السيرة الذاتية');
    }
    
    setIsSaving(false);
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experiences: [
        ...resumeData.experiences,
        { id: Date.now().toString(), title: "", company: "", period: "", description: "" }
      ]
    });
  };

  const removeExperience = (id: string) => {
    setItemToDelete({ type: 'experience', id });
    setDeleteDialogOpen(true);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData({
      ...resumeData,
      experiences: resumeData.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { id: Date.now().toString(), degree: "", institution: "", year: "" }
      ]
    });
  };

  const removeEducation = (id: string) => {
    setItemToDelete({ type: 'education', id });
    setDeleteDialogOpen(true);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((_, i) => i !== index)
    });
  };

  const exportToPDF = async () => {
    const element = document.getElementById("resume-preview");
    if (!element) return;

    try {
      toast.loading("جاري إنشاء ملف PDF...");
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${resumeData.personalInfo.name || "السيرة_الذاتية"}.pdf`);
      
      toast.success("تم تصدير السيرة الذاتية بنجاح!");
    } catch (error) {
      toast.error("حدث خطأ أثناء التصدير");
    }
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'experience') {
        setResumeData({
          ...resumeData,
          experiences: resumeData.experiences.filter(exp => exp.id !== itemToDelete.id)
        });
      } else if (itemToDelete.type === 'education') {
        setResumeData({
          ...resumeData,
          education: resumeData.education.filter(edu => edu.id !== itemToDelete.id)
        });
      }
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            إنشاء سيرة ذاتية احترافية
          </h1>
          <p className="text-gray-600">
            املأ البيانات أدناه لإنشاء سيرتك الذاتية الاحترافية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="personal">معلومات شخصية</TabsTrigger>
                  <TabsTrigger value="experience">الخبرات</TabsTrigger>
                  <TabsTrigger value="education">التعليم</TabsTrigger>
                  <TabsTrigger value="skills">المهارات</TabsTrigger>
                </TabsList>

                {/* Personal Info Tab */}
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">الاسم الكامل</Label>
                      <Input
                        id="name"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                        })}
                        placeholder="أحمد محمد"
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">المسمى الوظيفي</Label>
                      <Input
                        id="title"
                        value={resumeData.personalInfo.title}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, title: e.target.value }
                        })}
                        placeholder="مطور برمجيات"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                        })}
                        placeholder="ahmed@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                        })}
                        placeholder="+966 50 123 4567"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="location">الموقع</Label>
                      <Input
                        id="location"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                        })}
                        placeholder="الرياض، المملكة العربية السعودية"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="summary">نبذة تعريفية</Label>
                      <Textarea
                        id="summary"
                        value={resumeData.personalInfo.summary}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, summary: e.target.value }
                        })}
                        placeholder="اكتب نبذة مختصرة عن نفسك وخبراتك..."
                        rows={4}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-4">
                  <Button onClick={addExperience} className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة خبرة
                  </Button>
                  {resumeData.experiences.map((exp) => (
                    <Card key={exp.id} className="p-4 space-y-3 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 left-2"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-8">
                        <div>
                          <Label>المسمى الوظيفي</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                            placeholder="مطور Full Stack"
                          />
                        </div>
                        <div>
                          <Label>الشركة</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            placeholder="شركة التقنية"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>الفترة الزمنية</Label>
                          <Input
                            value={exp.period}
                            onChange={(e) => updateExperience(exp.id, "period", e.target.value)}
                            placeholder="2020 - حتى الآن"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>الوصف</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                            placeholder="اكتب وصف للمهام والإنجازات..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  {resumeData.experiences.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      لا توجد خبرات مضافة بعد
                    </div>
                  )}
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education" className="space-y-4">
                  <Button onClick={addEducation} className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة مؤهل دراسي
                  </Button>
                  {resumeData.education.map((edu) => (
                    <Card key={edu.id} className="p-4 space-y-3 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 left-2"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-8">
                        <div>
                          <Label>الدرجة العلمية</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                            placeholder="بكالوريوس علوم الحاسب"
                          />
                        </div>
                        <div>
                          <Label>المؤسسة التعليمية</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                            placeholder="جامعة الملك سعود"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>السنة</Label>
                          <Input
                            value={edu.year}
                            onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                            placeholder="2019"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  {resumeData.education.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      لا توجد مؤهلات دراسية مضافة بعد
                    </div>
                  )}
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      placeholder="أضف مهارة (مثال: React, JavaScript)"
                    />
                    <Button onClick={addSkill} className="gap-2">
                      <Plus className="w-4 h-4" />
                      إضافة
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => removeSkill(index)}
                          className="hover:text-blue-900"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {resumeData.skills.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      لا توجد مهارات مضافة بعد
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Actions & Theme Section */}
          <div className="space-y-6">
            {/* Actions Card */}
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-lg">الإجراءات</h3>
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                className="w-full gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? "إخفاء" : "معاينة"} السيرة الذاتية
              </Button>
              <Button onClick={saveResume} variant="outline" className="w-full">
                حفظ السيرة الذاتية
              </Button>
              <Button onClick={exportToPDF} className="w-full gap-2">
                <Download className="w-4 h-4" />
                تصدير PDF
              </Button>
            </Card>

            {/* Theme Card */}
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Palette className="w-5 h-5" />
                اختر اللون
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(["blue", "green", "purple"] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setResumeData({ ...resumeData, theme })}
                    className={`h-16 rounded-lg border-2 transition-all ${
                      resumeData.theme === theme ? "border-gray-900 scale-105" : "border-gray-200"
                    } ${
                      theme === "blue" ? "bg-gradient-to-br from-blue-500 to-blue-600" :
                      theme === "green" ? "bg-gradient-to-br from-green-500 to-green-600" :
                      "bg-gradient-to-br from-purple-500 to-purple-600"
                    }`}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h3 className="text-xl font-bold">معاينة السيرة الذاتية</h3>
                <Button variant="ghost" onClick={() => setShowPreview(false)}>
                  إغلاق
                </Button>
              </div>
              <div className="p-8">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteDialogOpen && (
          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="تأكيد الحذف"
            description="هل أنت متأكد من أنك تريد حذف هذا العنصر؟ لا يمكن استعادة العناصر المحذوفة."
            onConfirm={handleDeleteConfirm}
          />
        )}

        {/* Save Progress */}
        <div className="mt-8">
          <Progress value={calculateProgress()} className="h-2" />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>الإكمال: {calculateProgress().toFixed(0)}%</span>
            <span>آخر حفظ: {lastSaved ? lastSaved.toLocaleTimeString() : 'لم يتم الحفظ بعد'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}