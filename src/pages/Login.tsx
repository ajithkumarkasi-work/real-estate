import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function Login() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const submitLogin = (values: LoginValues) => {
    const success = login(values.email, values.password);
    if (!success) {
      toast.error("Invalid credentials");
      return;
    }
    toast.success("Logged in");
    navigate(-1);
  };

  const submitRegister = (values: RegisterValues) => {
    useAuthStore.setState({
      user: {
        id: crypto.randomUUID(),
        name: values.name,
        email: values.email,
        password: values.password,
        role: "user",
        visitRequests: [],
      },
      isAuthenticated: true,
    });
    toast.success("Account created");
    navigate("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center px-4 py-10 lg:px-6">
      <div className="w-full rounded-[2rem] border bg-white p-6 shadow-xl dark:bg-slate-900 md:p-10">
        <div className="mb-6 flex rounded-full border p-1">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${tab === "login" ? "bg-brand text-white" : ""}`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${tab === "register" ? "bg-brand text-white" : ""}`}
          >
            Register
          </button>
        </div>

        {tab === "login" ? (
          <form
            onSubmit={loginForm.handleSubmit(submitLogin)}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                {...loginForm.register("email")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-700 dark:text-slate-200">
                Password
              </label>
              <input
                type="password"
                {...loginForm.register("password")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
            <button
              className="w-full rounded-full bg-brand px-4 py-3 font-semibold text-white"
              type="submit"
            >
              Login
            </button>
            <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4 text-sm">
              <p className="font-semibold">Demo accounts available</p>
              <p className="mt-1 text-slate-600">user@demo.com / demo123</p>
              <p className="text-slate-600">admin@demo.com / demo123</p>
            </div>
          </form>
        ) : (
          <form
            onSubmit={registerForm.handleSubmit(submitRegister)}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm text-slate-700 dark:text-slate-200">
                Name
              </label>
              <input
                {...registerForm.register("name")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                {...registerForm.register("email")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-700 dark:text-slate-200">
                Password
              </label>
              <input
                type="password"
                {...registerForm.register("password")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-700 dark:text-slate-200">
                Confirm Password
              </label>
              <input
                type="password"
                {...registerForm.register("confirmPassword")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
            <button
              className="w-full rounded-full bg-brand px-4 py-3 font-semibold text-white"
              type="submit"
            >
              Create Account
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Join 10,000+ happy home seekers
        </p>
      </div>
    </div>
  );
}
