import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Sparkles, Lock, Mail, ArrowRight, Brain, User, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  // Form validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) {
      return 'الاسم مطلوب';
    }
    if (name.trim().length < 3) {
      return 'الاسم يجب أن يكون 3 أحرف على الأقل';
    }
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email) {
      return 'البريد الإلكتروني مطلوب';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'البريد الإلكتروني غير صحيح';
    }
    return '';
  };

  // Handle changes with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (touched.name) {
      setNameError(validateName(value));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setEmailError(validateEmail(value));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setConfirmPasswordError(
        value !== password && value.length > 0 ? 'كلمات المرور غير متطابقة' : ''
      );
    }
  };

  // Handle blur events
  const handleNameBlur = () => {
    setTouched({ ...touched, name: true });
    setNameError(validateName(name));
  };

  const handleEmailBlur = () => {
    setTouched({ ...touched, email: true });
    setEmailError(validateEmail(email));
  };

  const handleConfirmPasswordBlur = () => {
    setTouched({ ...touched, confirmPassword: true });
    setConfirmPasswordError(
      confirmPassword !== password && confirmPassword.length > 0 ? 'كلمات المرور غير متطابقة' : ''
    );
  };

  // Password validation
  const passwordRequirements = [
    { label: 'على الأقل 8 أحرف', met: password.length >= 8 },
    { label: 'يحتوي على حرف كبير', met: /[A-Z]/.test(password) },
    { label: 'يحتوي على حرف صغير', met: /[a-z]/.test(password) },
    { label: 'يحتوي على رقم', met: /[0-9]/.test(password) },
  ];

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const allRequirementsMet = passwordRequirements.every(req => req.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const confirmPasswordErr = confirmPassword !== password && confirmPassword.length > 0 ? 'كلمات المرور غير متطابقة' : '';
    
    setNameError(nameErr);
    setEmailError(emailErr);
    setConfirmPasswordError(confirmPasswordErr);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (nameErr || emailErr) {
      toast.error('يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    if (!allRequirementsMet) {
      toast.error('كلمة المرور لا تستوفي جميع المتطلبات');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(name, email, password);
      if (success) {
        toast.success('تم إنشاء الحساب بنجاح! سجل دخولك الآن');
        navigate('/login');
      } else {
        setEmailError('البريد الإلكتروني مستخدم بالفعل');
        toast.error('البريد الإلكتروني مستخدم بالفعل');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-cyan-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg"
        >
          {/* Logo and Title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 via-violet-500 to-cyan-500 mb-4 shadow-2xl shadow-purple-500/50"
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-200 via-violet-200 to-cyan-200 bg-clip-text text-transparent">
              انضم إلى Next Step AI
            </h1>
            <p className="text-purple-200/80 text-lg">ابدأ رحلتك نحو مستقبل مهني مشرق</p>
          </motion.div>

          {/* Register Card */}
          <motion.div
            className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">إنشاء حساب جديد</h2>
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </motion.div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="name" className="text-white/90 text-base mb-2 block">
                    الاسم الكامل
                  </Label>
                  <div className="relative group">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/70 group-focus-within:text-purple-400 transition-colors" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      onBlur={handleNameBlur}
                      className="pr-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300"
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                    {nameError && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400">{nameError}</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="email" className="text-white/90 text-base mb-2 block">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/70 group-focus-within:text-purple-400 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                      className="pr-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300"
                      placeholder="example@email.com"
                      required
                    />
                    {emailError && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400">{emailError}</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="password" className="text-white/90 text-base mb-2 block">
                    كلمة المرور
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/70 group-focus-within:text-purple-400 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      className="pr-11 pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-purple-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Requirements */}
                  {passwordFocused && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <p className="text-white/70 text-sm mb-2 font-medium">متطلبات كلمة المرور:</p>
                      <div className="space-y-1.5">
                        {passwordRequirements.map((req, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            {req.met ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-white/30" />
                            )}
                            <span className={`text-sm ${req.met ? 'text-green-400' : 'text-white/50'}`}>
                              {req.label}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Label htmlFor="confirmPassword" className="text-white/90 text-base mb-2 block">
                    تأكيد كلمة المرور
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/70 group-focus-within:text-purple-400 transition-colors" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      onBlur={handleConfirmPasswordBlur}
                      className={`pr-11 pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 transition-all duration-300 ${
                        confirmPassword.length > 0
                          ? passwordsMatch
                            ? 'focus:border-green-400/50 border-green-400/30'
                            : 'focus:border-red-400/50 border-red-400/30'
                          : 'focus:border-purple-400/50'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-purple-400 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {confirmPassword.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center gap-2"
                    >
                      {passwordsMatch ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400">كلمات المرور متطابقة</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-red-400">كلمات المرور غير متطابقة</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    disabled={isLoading || !allRequirementsMet || !passwordsMatch}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-500 hover:from-purple-400 hover:via-violet-400 hover:to-cyan-400 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <>
                        <span>إنشاء الحساب</span>
                        <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Login Link */}
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-white/70">
                  لديك حساب بالفعل؟{' '}
                  <Link
                    to="/login"
                    className="text-purple-400 hover:text-purple-300 font-semibold hover:underline transition-colors"
                  >
                    تسجيل الدخول
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Footer text */}
          <motion.p
            className="text-center text-white/50 mt-6 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            © 2026 Next Step AI. جميع الحقوق محفوظة
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};