"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
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
import { Eye, EyeOff } from "lucide-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Loading from "@/components/loading";
import { toast } from "sonner";

const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignmermValues = z.infer<typeof signinSchema>;

const Signin = () => {
  const { data: _session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignmermValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
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

  const onSubmit: SubmitHandler<SignmermValues> = async (values) => {
    setLoading(true);
    const error = await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard/calendar?via=signin",
      },
      {
        onSuccess: () => {
          setLoading(false);
        },
        onError: () => {
          setLoading(false);
        },
      }
    );
    toast.error(error.error?.message || "Logged In Successfull");
  };

  if (isPending) {
    return <Loading />;
  }

  //   if (session) {
  //     redirect("/me");
  //   }

  return (
    <div className="min-h-screen flex items-center justify-center font-[var(--font-geist-sans)] px-4">
      <Card className="flex flex-col md:flex-row bg-white rounded-4xl shadow-xl overflow-hidden w-full max-w-4xl p-0">
        {/* Branding Top (on mobile) / Left (on md+) */}
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
            Continue to your account to access all features
          </p>
          <div className="flex flex-col gap-2 w-full mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-white text-black hover:text-emerald-600 border-0 shadow-none hover:bg-emerald-600/10 transition-colors duration-300 rounded-4xl"
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
              Continue with Google
            </Button>
          </div>
        </div>

        {/* Form Bottom (on mobile) / Right (on md+) */}
        <main className="flex flex-col justify-center items-center p-8 w-full md:w-1/2 bg-emerald-600 text-white">
          <CardContent className="w-full p-0">
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-sm flex flex-col gap-4"
                autoComplete="on"
                noValidate
              >
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label
                          htmlFor="login-email"
                          className="block text-sm font-medium text-white mb-1"
                        >
                          Email
                        </Label>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="login-email"
                          type="email"
                          {...field}
                          placeholder="you@example.com"
                          required
                          autoComplete="email"
                          className="w-full px-4 py-2 bg-white/20 text-white rounded-2xl focus-visible:outline-none focus-visible:ring-0 transition placeholder:text-gray-200 border-0"
                          aria-invalid={!!errors.email}
                        />
                      </FormControl>
                      <FormMessage className="text-amber-300">
                        {errors.email && (
                          <span className="text-red-400 text-xs">
                            {errors.email.message}
                          </span>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label
                          htmlFor="login-password"
                          className="block text-sm font-medium text-white mb-1"
                        >
                          Password
                        </Label>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                            className="w-full px-4 py-2 bg-white/20 text-white rounded-2xl focus-visible:outline-none focus-visible:ring-0 transition placeholder:text-gray-200 border-0"
                            aria-invalid={!!errors.password}
                          />
                          <Button
                            type="button"
                            tabIndex={-1}
                            className="absolute inset-y-0 right-2 flex items-center px-2 text-white hover:text-black cursor-pointer focus:outline-none hover:bg-transparent bg-transparent shadow-none"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-amber-300">
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
                    className="w-1/2 rounded-2xl bg-white hover:bg-white text-emerald-600 border-none"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-1/2 text-white bg-white/30 border-0 -ml-6 rounded-l-none rounded-r-3xl shadow-none hover:text-emerald-700 ${
                      loading
                        ? "bg-transparent"
                        : "hover:bg-white/65"
                    }`}
                    disabled={loading}
                    onClick={() => {
                      redirect("/signup");
                    }}
                  >
                    Sign Up
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

export default Signin;
