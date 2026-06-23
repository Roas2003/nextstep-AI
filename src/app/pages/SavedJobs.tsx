import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

interface SavedJob {
  id: string;
  job_id: string;
  url?: string | null;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  description: string;
  requirements: string;
  match_percentage: number;
  posted_date: string;
}

export function SavedJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedJobs = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("saved_jobs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("فشل تحميل الوظائف المحفوظة");
    } else {
      setSavedJobs(data || []);
    }

    setLoading(false);
  };

  const deleteSavedJob = async (id: string) => {
    const { error } = await supabase.from("saved_jobs").delete().eq("id", id);

    if (error) {
      toast.error("فشل حذف الوظيفة");
    } else {
      toast.success("تم حذف الوظيفة من المحفوظات");
      setSavedJobs((prev) => prev.filter((job) => job.id !== id));
    }
  };
  const openJobDetails = (jobId: string) => {
    navigate(`/jobs/${encodeURIComponent(jobId)}`);
  };
  const openSavedJob = (url?: string | null) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast.error("لا يوجد رابط لهذه الوظيفة");
    }
  };
  useEffect(() => {
    loadSavedJobs();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        جاري تحميل الوظائف المحفوظة...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3 justify-end">
          الوظائف المحفوظة
          <Briefcase className="w-10 h-10 text-blue-600" />
        </h1>

        {savedJobs.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">لا توجد وظائف محفوظة بعد</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {savedJobs.map((job) => {

              return (
                <Card key={job.id} className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6 justify-between">
                    <div className="flex-1 text-right">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {job.title}
                      </h3>

                      <p className="text-blue-600 font-semibold mb-3">
                        {job.company}
                      </p>

                      <div className="flex flex-wrap gap-4 mb-4 text-gray-600 justify-end">
                        <span className="flex items-center gap-1">
                          {job.location}
                          <MapPin className="w-4 h-4" />
                        </span>

                        <span className="flex items-center gap-1">
                          {job.salary}
                          <DollarSign className="w-4 h-4" />
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 justify-end">
                        {job.requirements
                          ?.split(",")
                          .map((req, index) => (
                            <Badge key={index} variant="secondary">
                              {req.trim()}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div className="lg:w-44 flex flex-col gap-3">
                      <Badge className="justify-center py-2">
                        {job.match_percentage}% توافق
                      </Badge>

                    
 <Button
 className="w-full bg-black text-white hover:bg-gray-800"
 onClick={() => openJobDetails(job.job_id)}
>
 عرض التفاصيل
</Button>

<Button
 variant="outline"
 className="gap-2 w-full"
 onClick={() => openSavedJob(job.url)}
>
 <ExternalLink className="w-4 h-4" />
 التقديم من الموقع الأصلي
</Button>

<Button
 variant="destructive"
 className="gap-2 w-full"
 onClick={() => deleteSavedJob(job.id)}
>
 <Trash2 className="w-4 h-4" />
 حذف
</Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}