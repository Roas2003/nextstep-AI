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
    photo?: string;
  };
  experiences: Experience[];
  education: Education[];
  skills: string[];
}

interface ResumePreviewProps {
  data: ResumeData;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <div
      id="resume-preview"
      className="w-[794px] min-h-[1123px] mx-auto bg-white overflow-hidden relative shadow-2xl"
      style={{
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#fefefe]" />

      {/* Decorations */}
      <div className="absolute top-6 left-8 text-5xl text-[#f8de73]">
        ☀
      </div>

      <div className="absolute bottom-8 right-10 text-6xl text-[#f4a697] rotate-12">
        ❦
      </div>

      <div className="grid grid-cols-3 relative z-10 min-h-[1123px]">

        {/* LEFT SIDEBAR */}
        <div className="bg-[#fff9f7] p-8 border-r border-[#f0dede]">

          {/* Avatar */}
          <div className="flex justify-center mb-10">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-[#f8d4cd] shadow-md">

              {data.personalInfo.photo ? (
                <img
                  src={data.personalInfo.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl text-white">
                  👤
                </div>
              )}

            </div>
          </div>

          {/* Contact */}
          <div className="mb-10">
            <h2 className="text-[#7db7e7] font-extrabold text-2xl mb-5">
              Contact
            </h2>

            <div className="space-y-4 text-gray-700 text-sm leading-7">
              <p>{data.personalInfo.phone || "+123 456 7890"}</p>

              <p>
                {data.personalInfo.email || "your@email.com"}
              </p>

              <p>
                {data.personalInfo.location || "Your Location"}
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-10">
            <h2 className="text-[#7db7e7] font-extrabold text-2xl mb-5">
              Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {data.skills.length > 0 ? (
                data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-[#f8d4cd] text-gray-700 px-4 py-2 rounded-full text-sm shadow-sm"
                  >
                    {skill}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">
                  No skills added
                </p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-[#7db7e7] font-extrabold text-2xl mb-5">
              Profile
            </h2>

            <p className="text-gray-600 text-sm leading-8 whitespace-pre-line">
              {data.personalInfo.summary ||
                "Write a short professional summary about yourself."}
            </p>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-span-2 p-12 bg-white relative">

          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl font-extrabold text-[#8bbfe5] mb-3 leading-tight">
              {data.personalInfo.name || "Name Surname"}
            </h1>

            <p className="text-2xl text-[#8dc7b8] font-semibold">
              {data.personalInfo.title || "Professional Title"}
            </p>
          </div>

          {/* Experience */}
          <div className="mb-14">
            <h2 className="text-3xl font-bold text-[#7db7e7] mb-8">
              Work Experience
            </h2>

            <div className="space-y-10">
              {data.experiences.length > 0 ? (
                data.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-[#8fc0ec] rounded-[40px] p-8 text-white shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-2xl font-bold">
                          {exp.title || "Job Position"}
                        </h3>

                        <p className="text-white/90 font-medium mt-1">
                          {exp.company || "Company Name"}
                        </p>
                      </div>

                      <span className="text-sm text-white/90">
                        {exp.period || "2024 - 2026"}
                      </span>
                    </div>

                    <p className="leading-8 text-sm whitespace-pre-line">
                      {exp.description ||
                        "Write your job responsibilities and achievements here."}
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-[#8fc0ec] rounded-[40px] p-8 text-white shadow-lg">
                  <h3 className="text-2xl font-bold mb-3">
                    No Experience Added
                  </h3>

                  <p className="leading-8 text-sm">
                    Add your work experience from the form.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-3xl font-bold text-[#7db7e7] mb-8">
              Education
            </h2>

            <div className="space-y-8">
              {data.education.length > 0 ? (
                data.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="border-l-4 border-[#8dc7b8] pl-5"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {edu.degree || "Degree"}
                        </h3>

                        <p className="text-[#8dc7b8] font-medium mt-1">
                          {edu.institution || "University Name"}
                        </p>
                      </div>

                      <span className="text-sm text-gray-500">
                        {edu.year || "2026"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">
                  No education added
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}