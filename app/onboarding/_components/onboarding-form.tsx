"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const onboardingFormSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  logoUrl: z.union([
    z.literal(""),
    z.string().url({
      message: "Please enter a valid URL.",
    }),
  ]),
  address: z.union([
    z.literal(""),
    z.string().min(5, {
      message: "Address must be at least 5 characters.",
    }),
  ]),
  tin: z
    .string()
    .min(9, {
      message: "TIN must be at least 9 characters.",
    })
    .max(15, {
      message: "TIN must not exceed 15 characters.",
    }),
});

export const OnboardingForm = () => {
  const [step, setStep] = useState(1); // 1 and 2 step
  const board = useMutation(api.onboarding.board);

  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      address: "",
      businessName: "",
      logoUrl: "",
      tin: "",
    },
    mode: "onChange",
  });

  console.log(form.watch());

  async function onSubmit(values: z.infer<typeof onboardingFormSchema>) {
    if (step === 1) {
      const isValid = await form.trigger(["businessName", "tin"]);

      console.log("isValid:", isValid);
      console.log("Form errors:", form.formState.errors);
      console.log("Business Name:", form.getValues("businessName"));
      console.log("TIN:", form.getValues("tin"));

      if (isValid) {
        setStep(2);
      }
      return;
    }

    toast("Business Profile has been created", {
      description: new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      // action: {
      //   label: "Undo",
      //   onClick: () => console.log("Undo"),
      // },
    });

    await board(values);
  }

  return (
    <div className="w-[50%] h-[800px] py-12 flex flex-col">
      <p className="uppercase font-semibold text-sm text-sky-600">
        Step {step} of 2
      </p>
      <h1 className="">
        {step === 1 ? "Create your business profile" : "Complete your profile"}
      </h1>
      <p className="text-gray-600 mt-2 mb-7">
        {step === 1
          ? "Set up your business profile to start managing invoices, tracking payments, and growing your business. This will help you create professional invoices, monitor your cash flow, and maintain detailed records of all your transactions."
          : "Add your business address and logo to complete your profile setup."}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className={step === 1 ? "space-y-8" : "hidden"}>
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-lg">
                    Your Business Name
                  </FormLabel>
                  <p className="text-gray-600 text-sm max-w-md">
                    This is the official name of your business that will appear
                    on all invoices and documents sent to your clients.
                  </p>
                  <FormControl>
                    <Input
                      placeholder="e.g. SINVPH"
                      {...field}
                      className="bg-white h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-lg">
                    Your TIN
                  </FormLabel>
                  <p className="text-gray-600 text-sm max-w-md">
                    Enter your Tax Identification Number (TIN) for tax
                    compliance and official documentation.
                  </p>
                  <FormControl>
                    <Input
                      placeholder="e.g. 123456789"
                      {...field}
                      className="bg-white h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={step === 2 ? "space-y-8" : "hidden"}>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-lg">
                    Business Address
                  </FormLabel>
                  <p className="text-gray-600 text-sm max-w-md">
                    Enter your complete business address that will appear on
                    your invoices.
                  </p>
                  <FormControl>
                    <Input
                      placeholder="e.g. 123 Main St, Manila, Philippines"
                      {...field}
                      className="bg-white h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-lg">
                    Logo URL
                  </FormLabel>
                  <p className="text-gray-600 text-sm max-w-md">
                    Provide a URL to your business logo. This will be displayed
                    on your invoices.
                  </p>
                  <FormControl>
                    <Input
                      placeholder="e.g. https://example.com/logo.png"
                      {...field}
                      className="bg-white h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border-b border-gray-400" />
          <div className="flex gap-4">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            )}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Processing..."
                : step === 1
                  ? "Next Step"
                  : "Complete Setup"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
