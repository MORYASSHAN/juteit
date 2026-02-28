import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "@tanstack/react-router";
import { Leaf, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend.d";
import { useAuth } from "../context/AuthContext";
<<<<<<< HEAD
import { api } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    password: "",
=======
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useInternetIdentity();
  const { setRole } = useAuth();
  const { actor } = useActor();

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
    phone: "",
    address: "",
  });
  const [selectedRole, setSelectedRole] = useState<"buyer" | "owner">("buyer");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogin = async () => {
<<<<<<< HEAD
    if (!loginForm.email || !loginForm.password) {
      toast.error("Please enter email and password");
      return;
    }
    setIsProcessing(true);
    try {
      const data = await api.post('/auth/login', loginForm);
      setAuth(data, data.token);
      toast.success(data.role === 'owner' ? "Welcome back, Owner!" : "Welcome back!");
      navigate({ to: data.role === 'owner' ? "/owner" : "/" });
    } catch (error: any) {
      toast.error(error.message || "Login failed");
=======
    setIsProcessing(true);
    try {
      await login();
      if (actor) {
        try {
          const isAdmin = await actor.isCallerAdmin();
          if (isAdmin) {
            setRole(UserRole.admin);
            toast.success("Welcome back, Owner!");
            navigate({ to: "/owner" });
          } else {
            setRole(UserRole.user);
            toast.success("Welcome back!");
            navigate({ to: "/" });
          }
        } catch {
          setRole(UserRole.user);
          toast.success("Logged in successfully!");
          navigate({ to: "/" });
        }
      } else {
        setRole(UserRole.user);
        toast.success("Logged in successfully!");
        navigate({ to: "/" });
      }
    } catch {
      toast.error("Login failed. Please try again.");
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignUp = async () => {
<<<<<<< HEAD
    if (!profileForm.name || !profileForm.email || !profileForm.password) {
=======
    if (!profileForm.name || !profileForm.email) {
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
      toast.error("Please fill in required fields");
      return;
    }
    setIsProcessing(true);
    try {
<<<<<<< HEAD
      const data = await api.post('/auth/register', {
        ...profileForm,
        role: selectedRole
      });
      setAuth(data, data.token);
      toast.success(selectedRole === "owner" ? "Account created! Welcome, Owner." : "Account created! Welcome to JuteIt.");
      navigate({ to: selectedRole === "owner" ? "/owner" : "/" });
    } catch (error: any) {
      toast.error(error.message || "Sign up failed");
=======
      await login();
      if (actor) {
        try {
          await actor.saveCallerUserProfile({
            name: profileForm.name,
            email: profileForm.email,
            phone: profileForm.phone,
            address: profileForm.address,
          });
        } catch {
          // Profile save failed, continue
        }
      }

      if (selectedRole === "owner") {
        setRole(UserRole.admin);
        toast.success("Account created! Welcome, Owner.");
        navigate({ to: "/owner" });
      } else {
        setRole(UserRole.user);
        toast.success("Account created! Welcome to JuteIt.");
        navigate({ to: "/" });
      }
    } catch {
      toast.error("Sign up failed. Please try again.");
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
    } finally {
      setIsProcessing(false);
    }
  };

<<<<<<< HEAD
  const handleOAuthLogin = (provider: string) => {
    toast.info(`${provider} login will be available once OAuth is configured.`);
  };

  const loading = isProcessing;
=======
  const loading = isLoggingIn || isProcessing;
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 flex flex-col">
      {/* Top bar */}
      <div className="p-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <img
            src="/assets/generated/juteit-logo-transparent.dim_400x120.png"
            alt="JuteIt"
            className="h-8 w-auto"
          />
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
          <div className="bg-card rounded-3xl shadow-jute-lg border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-800 to-amber-600 px-8 py-8 text-white text-center">
              <div className="flex justify-center mb-3">
                <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Leaf className="h-7 w-7" />
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
<<<<<<< HEAD
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium mb-1 block">Email</Label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-1 block">Password</Label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        />
                      </div>
                    </div>

=======
                    <p className="text-sm text-muted-foreground text-center">
                      Use Internet Identity to securely access your account.
                    </p>
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
                    <Button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-ui h-11"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
<<<<<<< HEAD
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={() => handleOAuthLogin('Google')} className="rounded-xl h-11">
                        Google
                      </Button>
                      <Button variant="outline" onClick={() => handleOAuthLogin('Apple')} className="rounded-xl h-11">
                        Apple/iOS
                      </Button>
                    </div>
=======
                          Connecting...
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4 mr-2" />
                          Login with Internet Identity
                        </>
                      )}
                    </Button>
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
                  </div>
                </TabsContent>

                {/* Sign Up */}
                <TabsContent value="signup">
                  <div className="space-y-4">
                    {/* Role selector */}
                    <div>
                      <Label className="font-ui text-sm mb-2 block">
                        I am a...
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedRole("buyer")}
<<<<<<< HEAD
                          className={`p-3 rounded-xl border-2 text-center transition-all ${selectedRole === "buyer"
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                            }`}
=======
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            selectedRole === "buyer"
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
                        >
                          <div className="text-xl mb-1">🛍️</div>
                          <div className="text-sm font-ui font-medium">
                            Buyer
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Shop products
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedRole("owner")}
<<<<<<< HEAD
                          className={`p-3 rounded-xl border-2 text-center transition-all ${selectedRole === "owner"
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                            }`}
=======
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            selectedRole === "owner"
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
                        >
                          <div className="text-xl mb-1">🏪</div>
                          <div className="text-sm font-ui font-medium">
                            Owner
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Manage store
                          </div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label className="font-ui text-sm font-medium mb-1.5 block">
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Your full name"
                          className="pl-9 font-ui"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="font-ui text-sm font-medium mb-1.5 block">
                        Email *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          className="pl-9 font-ui"
                          value={profileForm.email}
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
<<<<<<< HEAD
                        Password *
                      </Label>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="font-ui"
                          value={profileForm.password}
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              password: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="font-ui text-sm font-medium mb-1.5 block">
=======
>>>>>>> b3703adf158970be9b21f99fa733e18d38b2f1e1
                        Phone
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="+91 XXXXXXXXXX"
                          className="pl-9 font-ui"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="font-ui text-sm font-medium mb-1.5 block">
                        Delivery Address
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Street, City, State, PIN"
                          className="pl-9 font-ui"
                          value={profileForm.address}
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              address: e.target.value,
                            }))
                          }
                        />
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
    </div>
  );
}
