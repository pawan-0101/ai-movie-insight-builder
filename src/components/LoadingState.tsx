"use client";

import React from "react";

interface LoadingStep {
    label: string;
    status: "pending" | "active" | "done";
}

interface LoadingStateProps {
    currentStep: number;
}

/**
 * Animated loading indicator that shows the progress of data fetching.
 */
export default function LoadingState({ currentStep }: LoadingStateProps) {
    const steps: LoadingStep[] = [
        { label: "Fetching movie details from OMDB...", status: currentStep > 0 ? "done" : currentStep === 0 ? "active" : "pending" },
        { label: "Gathering audience reviews...", status: currentStep > 1 ? "done" : currentStep === 1 ? "active" : "pending" },
        { label: "Running AI sentiment analysis...", status: currentStep > 2 ? "done" : currentStep === 2 ? "active" : "pending" },
        { label: "Preparing your insights...", status: currentStep > 3 ? "done" : currentStep === 3 ? "active" : "pending" },
    ];

    return (
        <div className="loader" role="status" aria-live="polite">
            <div className="loader__spinner" aria-hidden="true" />
            <p className="loader__text">Analyzing movie data with AI...</p>
            <div className="loader__steps stagger">
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className={`loader__step ${step.status === "active"
                                ? "loader__step--active"
                                : step.status === "done"
                                    ? "loader__step--done"
                                    : ""
                            }`}
                    >
                        <span className="loader__step-icon" aria-hidden="true">
                            {step.status === "done" ? "✅" : step.status === "active" ? "⏳" : "⬜"}
                        </span>
                        <span>{step.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
