import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Sparkles, Lock, Mail, ArrowRight, Brain, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email.trim()) {
      toast.error("الرجاء إدخال البريد الإلكتروني");
      return;
    }
  
    if (!password.trim()) {
      toast.error("الرجاء إدخال كلمة المرور");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const success = await login(email, password);
  
      if (success) {
        toast.success("تم تسجيل الدخول بنجاح!");
        navigate("/");
      } else {
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900">

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div className="w-full max-w-md">

          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 mb-4">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Next Step AI</h1>
          </div>

          {/* Form */}
          <div className="backdrop-blur-2xl bg-white/10 p-8 rounded-3xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <Label className="text-white">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 text-white"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 text-white pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-2 text-white"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyan-500 text-white"
              >
                {isLoading ? 'Loading...' : 'Login'}
              </Button>

            </form>

            <p className="text-center text-white mt-4">
              ليس لديك حساب؟ <Link to="/register">إنشاء حساب</Link>
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
};