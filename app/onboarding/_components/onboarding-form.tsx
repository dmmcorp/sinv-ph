"use client";

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
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const onboardingFormSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  logoFile: z.instanceof(File).optional(),
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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const board = useMutation(api.onboarding.board);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      address: "",
      businessName: "",
      logoFile: undefined,
      tin: "",
    },
    mode: "onChange",
  });

  console.log(form.watch());

  const handleFileChange = (file: File | null) => {
    if (!file) {
      form.setValue("logoFile", undefined);
      setLogoPreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Max file size
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image size must be less than 4MB");
      return;
    }

    form.setValue("logoFile", file);

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
    form.setValue("logoFile", undefined);
  };

  async function onSubmit(values: z.infer<typeof onboardingFormSchema>) {
    if (step === 1) {
      const isValid = await form.trigger(["businessName", "tin"]);
      if (isValid) {
        setStep(2);
      }
      return;
    }

    try {
      let logoUrl = "";

      if (values.logoFile) {
        const uploadUrl = await generateUploadUrl();

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": values.logoFile.type },
          body: values.logoFile,
        });

        const { storageId } = await result.json();
        logoUrl = storageId;
      }

      await board({
        businessName: values.businessName,
        tin: values.tin,
        address: values.address,
        logoUrl,
      });

      // clean up preview url blob
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }

      toast.success("Business Profile has been created");
    } catch (error) {
      toast.error("Failed to create business profile");
      console.error(error);
    }
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
              name="logoFile"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-lg">
                    Business Logo
                  </FormLabel>
                  <p className="text-gray-600 text-sm max-w-md">
                    Upload your business logo. This will be displayed on your
                    invoices.
                  </p>
                  <FormControl>
                    <div className="space-y-4">
                      {!logoPreview ? (
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          className={`
                            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                            transition-colors
                            ${isDragging ? "border-sky-500 bg-sky-50" : "border-gray-300 hover:border-gray-400"}
                          `}
                          onClick={() =>
                            document.getElementById("logo-upload")?.click()
                          }
                        >
                          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">
                            Drag and drop your logo here, or click to browse
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG, GIF up to 4MB
                          </p>
                          <Input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileChange(file);
                            }}
                            {...field}
                          />
                        </div>
                      ) : (
                        <div className="relative inline-block">
                          <div className="relative w-48 h-48 border-2 border-gray-200 rounded-lg overflow-hidden">
                            <Image
                              src={logoPreview}
                              alt="Logo preview"
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
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
