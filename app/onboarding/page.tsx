"use client";

import { OnboardingCard } from "./_components/onboarding-card";
import { OnboardingForm } from "./_components/onboarding-form";

const OnboardingPage = () => {
  return (
    <div className="flex flex-row w-full p-6 space-x-32">
      {/* Onboarding Info, why they need to do this and things they should know before they start */}
      <OnboardingCard />

      {/* Onboarding Form, business profile */}
      <OnboardingForm />
    </div>
  );
};

export default OnboardingPage;
