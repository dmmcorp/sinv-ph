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
import { formatTIN } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Check, UploadIcon, User, XIcon } from "lucide-react";
import Image from "next/image";
import { Activity, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const BUSINESSTYPE = [
  {
    type: "Freelancer/Individual",
    icon: <User />,
    description:
      "Best for solo workers who don’t charge VAT and issue simple invoices for personal or freelance services.",
  },
  {
    type: "Small Business",
    icon: <User />,
    description:
      "For registered businesses that don’t charge VAT but need more structured invoices, records, and basic reporting.",
  },
  {
    type: "VAT-Registered Business",
    icon: <User />,
    description:
      "For BIR-registered businesses VAT-registered with the BIR, required to charge 12% VAT, issue VAT-compliant ORs, and file VAT returns.",
  },
];
type BusinessType =
  | "Freelancer/Individual"
  | "Small Business"
  | "VAT-Registered Business";

const onboardingFormSchema = z.object({
  //step 1
  businessType: z.enum(
    ["Freelancer/Individual", "Small Business", "VAT-Registered Business"],
    {
      error: "Please select your business type.",
    }
  ),

  //step 2
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
  tin: z.string().optional(), // start optional, then enforce conditionally
});

// 2️⃣ Use superRefine for conditional validation
const schemaWithConditionalTIN = onboardingFormSchema.superRefine(
  (data, ctx) => {
    if (data.businessType === "VAT-Registered Business") {
      if (!data.tin || data.tin.length < 9 || data.tin.length > 15) {
        ctx.addIssue({
          code: "custom",
          message:
            "TIN must be between 9 and 15 characters for VAT-Registered Business",
          path: ["tin"], // points the error to the TIN field
        });
      }
    }
  }
);

// 3️⃣ TypeScript type
export type BusinessFormValues = z.infer<typeof schemaWithConditionalTIN>;

export const OnboardingForm = () => {
  const [step, setStep] = useState(1); // 1 and 2 step
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBType, setSelectedBType] = useState<BusinessType | null>();

  const board = useMutation(api.onboarding.board);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      address: "",
      businessName: "",
      logoFile: undefined,
      tin: "",
      businessType: selectedBType ?? "Freelancer/Individual",
    },
    mode: "onChange",
  });

  // console.log(form.watch());

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
    console.log(step);
    console.log(values);

    if (step === 1) {
      if (selectedBType && selectedBType !== null) {
        form.setValue("businessType", selectedBType);
        setStep(2);
      }
      return;
    }
    console.log(values);
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
        tin: values.tin, // dapat sa schema optional na si tin
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
    <div className="container mx-auto w-full  py-12 flex flex-col items-center gap-y-5 lg:gap-y-6   ">
      <h3 className="uppercase font-semibold text-lg text-sky-600">
        Step {step} of 2
      </h3>
      <h1 className="text-lg  sm:text-2xl lg:text-4xl">
        {step === 1 && "How do you issue invoices?"}
      </h1>
      {/* <p className="text-gray-600 mt-2 mb-7">
        {step === 1
          ? "Set up your business profile to start managing invoices, tracking payments, and growing your business. This will help you create professional invoices, monitor your cash flow, and maintain detailed records of all your transactions."
          : "Add your business address and logo to complete your profile setup."}
      </p> */}
      <Activity mode={step > 1 ? "hidden" : "visible"}>
        <div className="space-y-8">
          <div
            className={
              step === 1
                ? "grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-8 min-h-[30vh]"
                : "hidden"
            }
          >
            {BUSINESSTYPE.map((bt) => (
              <button
                key={bt.type}
                type="button"
                onClick={() => setSelectedBType(bt.type as BusinessType)}
                className={`w-full bg-white text-left p-5 lg:p-5 rounded-lg border transition-all flex flex-col ${
                  selectedBType === bt.type
                    ? "border-primary bg-primary/5 ring-2 ring-primary"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2 ">
                  <div className="space-y-1 min-w-0">
                    <h2 className="text-xl lg:text-2xl font-semibold truncate">
                      {bt.icon} {bt.type}
                    </h2>
                    <p className="text-[0.6rem] sm:text-xs lg:text-sm leading-loose">
                      {bt.description}
                    </p>
                  </div>
                  {selectedBType === bt.type && (
                    <div className="shrink-0 size-8 rounded-full bg-primary flex items-center justify-center">
                      <Check className="size-5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-4 justify-end w-full">
            <Button
              onClick={() => setStep(2)}
              type={"button"}
              disabled={form.formState.isSubmitting}
            >
              Next Step
            </Button>
          </div>
        </div>
      </Activity>
      <Activity mode={step < 2 ? "hidden" : "visible"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className="flex flex-col lg:flex-row gap-10 bg-white p-10">
              <div className="">
                <FormField
                  control={form.control}
                  name="logoFile"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-lg">
                        Business Logo
                      </FormLabel>
                      <p className="text-gray-600 text-sm max-w-md">
                        Upload your business logo. This will be displayed on
                        your invoices.
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
              <div
                className={
                  step === 2
                    ? "grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5 lg:gap-10"
                    : "hidden"
                }
              >
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm md:text-lg">
                          Your Business Name
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="e.g. SINVPH"
                            {...field}
                            className="bg-white h-11"
                          />
                        </FormControl>
                        <p className="text-gray-600 text-[0.6rem] md:text-sm ">
                          The official name that will appear on all invoices and
                          client documents.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {selectedBType !== "Freelancer/Individual" && (
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="tin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-sm md:text-lg">
                            TIN{" "}
                            {selectedBType === "Small Business" && (
                              <span className="text-xs text-muted-foreground">
                                (optional)
                              </span>
                            )}
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="e.g. XXX-XXX-XXX-XXX"
                              {...field}
                              className="bg-white h-11"
                              onChange={(e) => {
                                const formatted = formatTIN(e.target.value);
                                field.onChange(formatted);
                              }}
                            />
                          </FormControl>
                          <p className="text-gray-600 text-[0.6rem] md:text-sm max-w-md">
                            The complete address that will be shown on your
                            invoices.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm md:text-lg">
                          Business Address
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="e.g. 123 Main St, Manila, Philippines"
                            {...field}
                            className="bg-white h-11"
                          />
                        </FormControl>
                        <p className="text-gray-600 text-[0.6rem] md:text-sm max-w-md">
                          The complete address that will be shown on your
                          invoices.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            {/* <div className="border-b border-gray-400" /> */}

            <div className="flex gap-4 flex-row items-end justify-end">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
              )}
              <Button type={"submit"} disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Processing..."
                  : step < 2
                    ? "Next Step"
                    : "Complete Setup"}
              </Button>
            </div>
          </form>
        </Form>
      </Activity>
    </div>
  );
};
