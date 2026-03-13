import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Leaf, Loader2, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [selectedRole, setSelectedRole] = useState<"buyer" | "owner">("buyer");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tempName, setTempName] = useState("");
  const [pendingAuthData, setPendingAuthData] = useState<any>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      toast.error("Please enter email and password");
      return;
    }
    if (!validateEmail(loginForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsProcessing(true);
    try {
      const data = await api.post('/auth/login', loginForm);
      if (!data.name && data.role === 'buyer') {
        setPendingAuthData(data);
        setShowOnboarding(true);
      } else {
        setAuth(data, data.token);
        toast.success(data.role === 'owner' ? "Welcome back, Owner!" : `Welcome back ${data.name || ''}!`);
        navigate({ to: data.role === 'owner' ? "/owner" : "/" });
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignUp = async () => {
    if (!profileForm.email || !profileForm.password || !profileForm.confirmPassword) {
      toast.error("Please fill in email and all password fields");
      return;
    }
    if (profileForm.password !== profileForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!validateEmail(profileForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsProcessing(true);
    try {
      const data = await api.post('/auth/register', {
        email: profileForm.email,
        password: profileForm.password,
      });
      setPendingAuthData(data);
      setShowOnboarding(true);
    } catch (error: any) {
      toast.error(error.message || "Sign up failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    setIsProcessing(true);
    try {
      const data = await api.post('/auth/google', { token: credentialResponse.credential });
      if (!data.name && data.role === 'buyer') {
        setPendingAuthData(data);
        setShowOnboarding(true);
      } else {
        setAuth(data, data.token);
        toast.success(data.role === 'owner' ? "Welcome back, Owner!" : `Welcome back ${data.name || ''}!`);
        navigate({ to: data.role === 'owner' ? "/owner" : "/" });
      }
    } catch (error: any) {
      toast.error(error.message || "Google Login failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const loading = isProcessing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 flex flex-col">
      {/* Top bar */}
      <div className="p-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="rounded-xl overflow-hidden shadow-md border border-border">
            <img
              src="/logo.png"
              alt="JuteIt"
              className="h-12 w-12 object-cover"
            />
          </div>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-card dark:bg-card/50 rounded-3xl shadow-jute-lg border border-border overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-800 to-amber-600 px-8 py-8 text-white text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 ring-2 ring-white/10">
                  <img
                    src="/logo.png"
                    alt="JuteIt"
                    className="h-28 w-28 object-cover"
                  />
                </div>
              </div>
              <h1 className="font-display text-2xl font-bold">
                Welcome to JuteIt
              </h1>
              <p className="text-white/70 text-sm mt-1">
                Eco-friendly living starts here
              </p>
            </div>

            {/* Tabs */}
            <div className="p-6">
              <Tabs defaultValue="login">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="login" className="flex-1 font-ui">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex-1 font-ui">
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* Login */}
                <TabsContent value="login">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="font-ui text-sm font-medium mb-1.5 block">Email</Label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          className="font-ui !bg-amber-50 !text-stone-900 border-amber-300 placeholder:text-stone-400 focus-visible:ring-amber-500/30"
                          value={loginForm.email}
                          autoComplete="email"
                          onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label className="font-ui text-sm font-medium mb-1.5 block">Password</Label>
                        <div className="relative group">
                          <Input
                            key={showPassword ? "text-login" : "password-login"}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={loginForm.password}
                            autoComplete="current-password"
                            onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                            className="pr-10 font-ui !bg-amber-50 !text-stone-900 border-amber-300 placeholder:text-stone-400 focus-visible:ring-amber-500/30"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-stone-500 hover:text-stone-900 !z-50 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowPassword(!showPassword);
                            }}
                            type="button"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-ui h-11"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>

                    <div className="flex justify-center text-xs uppercase my-4">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id.apps.googleusercontent.com'}>
                        <div className="flex justify-center w-full">
                          <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google Login Failed")}
                          />
                        </div>
                      </GoogleOAuthProvider>
                    </div>
                  </div>
                </TabsContent>

                {/* Sign Up */}
                <TabsContent value="signup">
                  <div className="space-y-4">
                    <div>
                      <Label className="font-ui text-sm font-medium mb-1.5 block">
                        Email *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-500 z-10" />
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          className="pl-9 font-ui !bg-amber-50 !text-stone-900 border-amber-300 placeholder:text-stone-400 focus-visible:ring-amber-500/30"
                          value={profileForm.email}
                          autoComplete="email"
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="font-ui text-sm font-medium mb-1.5 block">
                        Password *
                      </Label>
                      <div className="relative group">
                        <Input
                          key={showSignupPassword ? "text-signup" : "password-signup"}
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="font-ui pr-10 !bg-amber-50 !text-stone-900 border-amber-300 placeholder:text-stone-400 focus-visible:ring-amber-500/30"
                          value={profileForm.password}
                          autoComplete="new-password"
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              password: e.target.value,
                            }))
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-stone-500 hover:text-stone-900 !z-50 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowSignupPassword(!showSignupPassword);
                          }}
                          type="button"
                        >
                          {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="font-ui text-sm font-medium mb-1.5 block">
                        Confirm Password *
                      </Label>
                      <div className="relative group">
                        <Input
                          key={showConfirmPassword ? "text-confirm" : "password-confirm"}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="font-ui pr-10 !bg-amber-50 !text-stone-900 border-amber-300 placeholder:text-stone-400 focus-visible:ring-amber-500/30"
                          value={profileForm.confirmPassword}
                          autoComplete="new-password"
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              confirmPassword: e.target.value,
                            }))
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-stone-500 hover:text-stone-900 !z-50 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowConfirmPassword(!showConfirmPassword);
                          }}
                          type="button"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleSignUp}
                      disabled={loading}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-ui h-11"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account & Continue"
                      )}
                    </Button>

                    <div className="flex justify-center text-xs uppercase my-4">
                      <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id.apps.googleusercontent.com'}>
                        <div className="flex justify-center w-full">
                          <GoogleLogin
                            text="signup_with"
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google Login Failed")}
                          />
                        </div>
                      </GoogleOAuthProvider>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By continuing, you agree to JuteIt's Terms and Privacy Policy
          </p>
        </motion.div>
      </div>

      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to JuteIt!</DialogTitle>
            <DialogDescription>
              By what name should we call you? We'd love to personalize your experience.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="w-full"
              onClick={async () => {
                if (!tempName.trim()) {
                  toast.error("Please enter your name");
                  return;
                }
                setIsProcessing(true);
                try {
                  const updatedUser = await api.put(`/users/${pendingAuthData._id}`, { name: tempName });
                  setAuth({ ...pendingAuthData, name: tempName }, pendingAuthData.token);
                  toast.success(`Welcome, ${tempName}!`);
                  setShowOnboarding(false);
                  navigate({ to: "/" });
                } catch (error: any) {
                  toast.error("Failed to save name, but you can update it later in your profile.");
                  setAuth(pendingAuthData, pendingAuthData.token);
                  setShowOnboarding(false);
                  navigate({ to: "/" });
                } finally {
                  setIsProcessing(false);
                }
              }}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
