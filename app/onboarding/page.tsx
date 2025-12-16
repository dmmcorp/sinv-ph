"use client";

import { OnboardingCard } from "./_components/onboarding-card";
import { OnboardingForm } from "./_components/onboarding-form";

const OnboardingPage = () => {
  return (
    <div className="flex-1 flex justify-start w-full p-6 space-x-32">
      <OnboardingForm />
    </div>
  );
};

export default OnboardingPage;
