import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { 
  FileText, 
  Target, 
  GraduationCap, 
  Briefcase,
  TrendingUp,
  Award,
  ArrowLeft,
  Sparkles,
  Zap,
  Brain,
  Rocket
} from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  const features = [
    {
      icon: FileText,
      title: "إنشاء سيرة ذاتية احترافية",
      description: "قوالب جاهزة وتصميم احترافي مع إمكانية التخصيص والتصدير بصيغة PDF",
      color: "from-blue-500 to-blue-600",
      link: "/resume"
    },
    {
      icon: Target,
      title: "تحليل المهارات",
      description: "تحليل تلقائي لمهاراتك واقتراح مسار وظيفي مناسب",
      color: "from-cyan-500 to-cyan-600",
      link: "/skills"
    },
    {
      icon: GraduationCap,
      title: "دورات تدريبية مقترحة",
      description: "اقتراحات لأفضل الدورات لتطوير مهاراتك المهنية",
      color: "from-purple-500 to-purple-600",
      link: "/skills"
    },
    {
      icon: Briefcase,
      title: "مطابقة الوظائف",
      description: "ابحث عن الوظائف المناسبة لمهاراتك مع تحليل نسبة التوافق",
      color: "from-green-500 to-green-600",
      link: "/jobs"
    }
  ];

  const stats = [
    { icon: TrendingUp, value: "10,000+", label: "فرصة وظيفية" },
    { icon: Award, value: "500+", label: "دورة تدريبية" },
    { icon: FileText, value: "50,000+", label: "سيرة ذاتية" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                ابدأ خطوتك القادمة
                <span className="block text-cyan-300">نحو النجاح المهني</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                مساعدك الذكي لإنشاء سيرة ذاتية احترافية، تحليل المهارات، واكتشاف أفضل الفرص الوظيفية المناسبة لك
              </p>
              <div className="flex gap-4">
                <Link to="/resume">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 gap-2">
                    ابدأ الآن
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="bg-blue-700/50 border-white/30 hover:bg-blue-700/70 text-white">
                    لوحة التحكم
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              {/* 3D Animated AI Brain Visualization */}
              <div className="relative h-[300px] md:h-[400px] flex items-center justify-center">
                {/* Central Brain Icon with 3D effect */}
                <motion.div 
                  className="relative z-10"
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  <div className="relative w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-cyan-500/50 flex items-center justify-center transform hover:scale-110 transition-transform duration-300"
                    style={{
                      boxShadow: '0 25px 50px -12px rgba(6, 182, 212, 0.5), inset 0 2px 4px 0 rgba(255, 255, 255, 0.4)'
                    }}
                  >
                    <Brain className="w-16 h-16 md:w-24 md:h-24 text-white" strokeWidth={1.5} />
                    
                    {/* Pulsing glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-cyan-400 to-purple-600 opacity-50 blur-xl"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </motion.div>

                {/* Orbiting Icons - Top Right - Hidden on mobile */}
                <motion.div
                  className="absolute top-4 md:top-8 right-6 md:right-12 hidden sm:block"
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0
                  }}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
                    style={{ boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)' }}
                  >
                    <Rocket className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </motion.div>

                {/* Orbiting Icons - Bottom Left */}
                <motion.div
                  className="absolute bottom-6 md:bottom-12 left-4 md:left-8"
                  animate={{ 
                    y: [0, 15, 0],
                    rotate: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
                    style={{ boxShadow: '0 10px 30px rgba(34, 211, 238, 0.4)' }}
                  >
                    <Target className="w-8 h-8 md:w-12 md:h-12 text-white" />
                  </div>
                </motion.div>

                {/* Orbiting Icons - Top Left - Hidden on small screens */}
                <motion.div
                  className="absolute top-8 md:top-16 left-8 md:left-16 hidden md:block"
                  animate={{ 
                    y: [0, -15, 0],
                    x: [0, 10, 0],
                    rotate: [0, 15, 0]
                  }}
                  transition={{ 
                    duration: 4.5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg md:rounded-xl shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
                    style={{ boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4)' }}
                  >
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                </motion.div>

                {/* Orbiting Icons - Bottom Right */}
                <motion.div
                  className="absolute bottom-10 md:bottom-20 right-8 md:right-16 hidden sm:block"
                  animate={{ 
                    y: [0, 20, 0],
                    x: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
                    style={{ boxShadow: '0 10px 30px rgba(52, 211, 153, 0.4)' }}
                  >
                    <Zap className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </motion.div>

                {/* Floating Particles - Reduced on mobile */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-white/40 rounded-full hidden md:block"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeInOut"
                    }}
                  />
                ))}

                {/* Background glow effects */}
                <div className="absolute -bottom-4 md:-bottom-6 -right-4 md:-right-6 w-24 h-24 md:w-40 md:h-40 bg-cyan-400 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute -top-4 md:-top-6 -left-4 md:-left-6 w-24 h-24 md:w-40 md:h-40 bg-purple-400 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-64 md:h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center gap-4 justify-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ميزات تساعدك على التميز
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نوفر لك جميع الأدوات التي تحتاجها لبناء مسار مهني ناجح
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={feature.link}>
                <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 group cursor-pointer h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            جاهز لبناء مستقبلك المهني؟
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المستخدمين الذين حققوا أهدافهم المهنية معنا
          </p>
          <Link to="/resume">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 gap-2">
              ابدأ الآن مجاناً
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}