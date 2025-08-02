"use client"
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import type React from "react";
import { toast } from "sonner";

const Pricing = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Loading />;
  }
  if (!session) {
    redirect("/signin");
  }

  return (
    <section className="relative min-h-full bg-white flex items-center justify-center py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mt-10 sm:mt-0 mb-8 sm:mb-12 lg:mb-16">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
            Our Pricing Plan
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan for your needs. All plans include our core
            features with varying levels of support and usage.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          <PricingCard
            type="Personal"
            price="$59"
            subscription="year"
            description="Perfect for individuals and small personal projects."
            buttonText="Choose Personal"
          >
            <List>1 User</List>
            <List>All UI components</List>
            <List>Lifetime access</List>
            <List>Free updates</List>
            <List>Use on 1 project</List>
            <List>3 Months support</List>
          </PricingCard>

          <PricingCard
            type="Business"
            price="$199"
            subscription="year"
            description="Perfect for growing teams and multiple projects."
            buttonText="Choose Business"
            active
          >
            <List>5 Users</List>
            <List>All UI components</List>
            <List>Lifetime access</List>
            <List>Free updates</List>
            <List>Use on 3 projects</List>
            <List>6 Months support</List>
          </PricingCard>

          <PricingCard
            type="Professional"
            price="$399"
            subscription="year"
            description="Perfect for large teams and unlimited usage."
            buttonText="Choose Professional"
          >
            <List>Unlimited Users</List>
            <List>All UI components</List>
            <List>Lifetime access</List>
            <List>Free updates</List>
            <List>Unlimited projects</List>
            <List>12 Months support</List>
          </PricingCard>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

interface PricingCardProps {
  children: React.ReactNode;
  description: string;
  price: string;
  type: string;
  subscription: string;
  buttonText: string;
  active?: boolean;
}

const PricingCard = ({
  children,
  description,
  price,
  type,
  subscription,
  buttonText,
  active,
}: PricingCardProps) => {
  return (
    <div className="relative group">
      <div
        className={`
          relative h-full overflow-hidden rounded-2xl border-0 transition-all duration-300
          ${
            active
              ? "bg-emerald-50 shadow-xl scale-105"
              : "bg-white hover:shadow-lg"
          }
          p-4 sm:p-6 lg:p-8
        `}
      >
        {/* Plan Type */}
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
            {type}
          </h3>
          <div className="flex items-baseline justify-center">
            <span
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${
                active ? "text-emerald-600" : "text-gray-900"
              }`}
            >
              {price}
            </span>
            <span className="text-sm sm:text-base text-gray-500 ml-1">
              /{subscription}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
          {description}
        </p>

        {/* Features List */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
          {children}
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => {
            toast.info("Plans will be available soon");
          }}
          className={`
            w-full py-3 sm:py-4 px-6 rounded-xl font-medium text-sm sm:text-base transition-all duration-300
            ${
              active
                ? "bg-gradient-to-r from-transparent via-emerald-500 to-transparent hover:bg-emerald-600 text-white shadow-none hover:shadow-xl transform hover:-translate-y-0.5"
                : "bg-transparent shadow-none hover:bg-emerald-500 text-gray-900 hover:text-white border-0 hover:border-emerald-500"
            }
          `}
        >
          {buttonText}
        </Button>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-100 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-emerald-200 rounded-full opacity-30 blur-lg"></div>
      </div>
    </div>
  );
};

const List: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Checkmark Icon */}
      <div className="flex-shrink-0">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
        {children}
      </span>
    </div>
  );
};
