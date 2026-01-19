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
import { Eye, EyeClosed, Loader } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signIn } = useAuthActions();

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    setIsLoading(true);
    setError("");
    try {
      await signIn("password", {
        ...values,
        flow: "signIn",
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          setError(
            "Connection error. Please check your internet connection and try again.",
          );
        } else {
          setError("Invalid email or password");
        }
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
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
                  className="px-5 py-5 pr-10 "
                  placeholder="juandelacruz@gmail.com"
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
                    placeholder="Enter your password"
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
        {error !== "" && <div className="text-red-600 text-sm">{error}</div>}

        <div className=" flex items-center justify-end">
          <Link href={"/auth/forgot-password"} className="">
            <p className="text-primary text-sm">Forgot Password?</p>
          </Link>
        </div>
        <div className="w-full flex items-center justify-center">
          <Button
            type="submit"
            variant={"default"}
            disabled={isLoading}
            className="mx-auto rounded-full w-full px-10 py-3 font-normal"
          >
            {isLoading ? (
              <Loader className="animate-spin size-6" />
            ) : (
              <> Sign In</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SignInForm;
