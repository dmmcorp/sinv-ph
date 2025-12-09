"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";

const signInFormSchema = z.object({
  email: z
    .email({
      error: "Please enter a valid email.",
    })
    .min(1, {
      message: "Please enter a valid email.",
    }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

function SignInForm() {
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [hidden, setIsHidden] = useState<boolean>(true);
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signIn } = useAuthActions();

  function onSubmit(values: z.infer<typeof signInFormSchema>) {
    signIn("password", {
      flow: "signIn",
      ...values,
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
        <div className=" flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="rememberMe" />
            <Label htmlFor="rememberMe" className="font-normal">
              Remember me
            </Label>
          </div>
          <Link href={"/auth/forgot-password"} className="">
            <h5 className="text-blue-500">Forgot Password?</h5>
          </Link>
        </div>
        <div className="w-full flex items-center justify-center">
          <Button
            type="submit"
            className="mx-auto rounded-full px-10 py-3 font-normal"
          >
            Sign In
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SignInForm;
