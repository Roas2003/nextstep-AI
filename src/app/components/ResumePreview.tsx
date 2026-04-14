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

interface ResumePreviewProps {
  data: ResumeData;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const themeColors = {
    blue: {
      primary: "bg-blue-600",
      light: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-600"
    },
    green: {
      primary: "bg-green-600",
      light: "bg-green-50",
      text: "text-green-600",
      border: "border-green-600"
    },
    purple: {
      primary: "bg-purple-600",
      light: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-600"
    }
  };

  const theme = themeColors[data.theme];

  return (
    <div id="resume-preview" className="bg-white p-8 shadow-lg" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div className={`${theme.primary} text-white p-8 rounded-t-lg -mx-8 -mt-8 mb-6`}>
        <h1 className="text-4xl font-bold mb-2">{data.personalInfo.name || "الاسم"}</h1>
        <p className="text-xl opacity-90">{data.personalInfo.title || "المسمى الوظيفي"}</p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {data.personalInfo.email && (
            <div className="flex items-center gap-2">
              <span>📧</span>
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <span>📱</span>
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{data.personalInfo.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${theme.text} mb-3 pb-2 border-b-2 ${theme.border}`}>
            نبذة تعريفية
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${theme.text} mb-3 pb-2 border-b-2 ${theme.border}`}>
            الخبرات العملية
          </h2>
          <div className="space-y-4">
            {data.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                  <span className="text-sm text-gray-600">{exp.period}</span>
                </div>
                <p className={`${theme.text} font-semibold mb-2`}>{exp.company}</p>
                <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${theme.text} mb-3 pb-2 border-b-2 ${theme.border}`}>
            المؤهلات الدراسية
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-600">{edu.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${theme.text} mb-3 pb-2 border-b-2 ${theme.border}`}>
            المهارات
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className={`${theme.light} ${theme.text} px-4 py-2 rounded-full font-semibold`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
