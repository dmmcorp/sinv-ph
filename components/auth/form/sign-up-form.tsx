"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuthActions } from "@convex-dev/auth/react";

const signInFormSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      }),
    confirmPassword: z.string().min(1, {
      message: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function SignUpForm() {
  const [hidden, setIsHidden] = useState<boolean>(true);

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { signIn } = useAuthActions();

  function onSubmit(values: z.infer<typeof signInFormSchema>) {
    signIn("password", {
      flow: "signUp",
      role: "subscriber",
      email: values.email,
      password: values.password,
      onboarding: false,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="px-5 py-5 pr-10"
                  placeholder="Email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl className="relative">
                <div className="relative">
                  <Input
                    className="px-5 py-5 pr-10"
                    type={hidden ? "password" : "text"}
                    placeholder="Password"
                    {...field}
                  />
                  <button
                    onClick={() => setIsHidden(!hidden)}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {hidden ? <Eye size={20} /> : <EyeClosed />}
                  </button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl className="relative">
                <div className="relative">
                  <Input
                    className="px-5 py-5 pr-10"
                    type={hidden ? "password" : "text"}
                    placeholder="Confirm Password"
                    {...field}
                  />
                  <button
                    onClick={() => setIsHidden(!hidden)}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {hidden ? <Eye size={20} /> : <EyeClosed />}
                  </button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className=" flex items-center justify-start">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400">
              By signing up, you confirm to have read and agree to our{" "}
              <span>Terms of Use</span> and <span>Privacy Policy</span>
            </p>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <Button
            type="submit"
            className="mx-auto rounded-full px-10 py-3 font-normal"
          >
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SignUpForm;
