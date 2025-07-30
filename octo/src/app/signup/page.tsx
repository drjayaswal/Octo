"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import Loading from "@/components/loading";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<SignupFormValues> = async (values) => {
    setLoading(true);
    console.log({
      email: values.email,
      password: values.password,
      name: values.name,
      callbackURL: "/dashboard?via=signup",
    });
    const error = await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: "/dashboard?via=signup",
      },
      {
        onSuccess: () => {
          setLoading(false);
        },
        onError: ({ error }) => {
          setLoading(false);
        },
      }
    );
    toast.error(error.error?.message || "Account Created");
  };

  if (isPending) {
    return <Loading />;
  }

  if (session) {
    redirect("/me");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 font-[var(--font-geist-sans)]">
      <Card className="flex flex-col md:flex-row-reverse rounded-3xl shadow-xl overflow-hidden w-full max-w-5xl p-0">
        {/* Branding Top (on mobile) / Right (on md+) */}
        <div className="flex flex-col justify-center items-center p-6 md:p-10 w-full md:w-1/2 text-center bg-white">
          <img
            src="/logo.png"
            alt="Octo Logo"
            className="w-16 h-16 md:w-20 md:h-20 object-contain mb-4 invert rounded-full"
          />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Welcome to Octo
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-sm">
            Create your account to access all features
          </p>
          <div className="flex flex-col gap-2 w-full mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-transparent via-black/50 hover:via-black to-transparent text-white border-0 rounded-none shadow-none hover:text-white transition-colors duration-300"
              disabled={loading}
              onClick={async () => {
                toast.info("Feature Coming Soon");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.853 0 1.337-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Sign up with GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-white text-black border-0 shadow-none hover:bg-black/5 transition-colors duration-300 rounded-4xl"
              disabled={loading}
              onClick={async () => {
                toast.info("Feature Coming Soon");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <g>
                  <path
                    fill="#4285F4"
                    d="M43.611 20.083H42V20H24v8h11.303C33.973 32.084 29.373 35 24 35c-6.065 0-11-4.935-11-11s4.935-11 11-11c2.507 0 4.81.86 6.646 2.285l6.366-6.366C33.527 6.163 28.973 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.045 0 19.799-8.955 19.799-20 0-1.341-.138-2.651-.388-3.917z"
                  />
                  <path
                    fill="#34A853"
                    d="M6.306 14.691l6.571 4.819C14.655 16.104 19.001 13 24 13c2.507 0 4.81.86 6.646 2.285l6.366-6.366C33.527 6.163 28.973 4 24 4c-7.732 0-14.41 4.388-17.694 10.691z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M24 44c5.311 0 10.13-1.822 13.857-4.949l-6.418-5.263C29.373 35 24 35 18.697 32.084l-6.571 5.081C9.59 39.612 16.268 44 24 44z"
                  />
                  <path
                    fill="#EA4335"
                    d="M43.611 20.083H42V20H24v8h11.303c-1.94 4.084-6.54 7-11.303 7-2.507 0-4.81-.86-6.646-2.285l-6.366 6.366C14.473 41.837 19.027 44 24 44c7.732 0 14.41-4.388 17.694-10.691z"
                  />
                </g>
              </svg>
              Sign up with Google
            </Button>
          </div>
        </div>

        {/* Form Bottom (on mobile) / Left (on md+) */}
        <main className="flex flex-col justify-center items-center p-6 md:p-10 w-full md:w-1/2 bg-black text-white">
          <CardContent className="w-full p-0">
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md flex flex-col gap-4"
                autoComplete="on"
                noValidate
              >
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>
                          <Label
                            htmlFor="signup-name"
                            className="block text-sm md:text-base font-medium mb-1 text-white"
                          >
                            Name
                          </Label>
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="signup-name"
                            type="text"
                            {...field}
                            placeholder="Your Name"
                            required
                            autoComplete="name"
                            className={cn(
                              "w-full px-4 py-2 border-black bg-black text-white rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition placeholder-gray-400 border-0"
                            )}
                            aria-invalid={!!errors.name}
                          />
                        </FormControl>
                        <FormMessage>
                          {errors.name && (
                            <span className="text-red-400 text-xs">
                              {errors.name.message}
                            </span>
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>
                          <Label
                            htmlFor="signup-email"
                            className="block text-sm md:text-base font-medium mb-1 text-white"
                          >
                            Email
                          </Label>
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="signup-email"
                            type="email"
                            {...field}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                            className={cn(
                              "w-full px-4 py-2 border-black bg-black text-white rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition placeholder-gray-400 border-0"
                            )}
                            aria-invalid={!!errors.email}
                          />
                        </FormControl>
                        <FormMessage>
                          {errors.email && (
                            <span className="text-red-400 text-xs">
                              {errors.email.message}
                            </span>
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label
                          htmlFor="signup-password"
                          className="block text-sm md:text-base font-medium mb-1 text-white"
                        >
                          Password
                        </Label>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            placeholder="••••••••"
                            required
                            autoComplete="new-password"
                            className={cn(
                              "w-full px-4 py-2 border border-black bg-black text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition placeholder-gray-400 text-sm md:text-base",
                              errors.password && "border-red-500"
                            )}
                            aria-invalid={!!errors.password}
                          />
                          <Button
                            type="button"
                            tabIndex={-1}
                            className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-400 hover:text-emerald-500 cursor-pointer focus:outline-none hover:bg-transparent bg-transparent"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage>
                        {errors.password && (
                          <span className="text-red-400 text-xs">
                            {errors.password.message}
                          </span>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 mt-2">
                  <Button
                    type="submit"
                    className="w-1/2 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 border-none text-sm md:text-base"
                    disabled={loading}
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-1/2 text-emerald-400 bg-transparent border-0 hover:bg-emerald-500/40 hover:text-white -ml-6 rounded-l-none rounded-r-3xl text-sm md:text-base"
                    disabled={loading}
                    onClick={() => redirect("/signin")}
                  >
                    Login
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </main>
      </Card>
    </div>
  );
};

export default Signup;
