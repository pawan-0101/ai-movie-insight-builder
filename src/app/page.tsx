"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import LoadingState from "@/components/LoadingState";
import MoviePoster from "@/components/MoviePoster";
import MovieInfo from "@/components/MovieInfo";
import SentimentPanel from "@/components/SentimentPanel";
import Footer from "@/components/Footer";
import { MovieInsightResponse } from "@/types/movie";

/**
 * Main page component for the AI Movie Insight Builder.
 * Orchestrates the search, loading, and results display flow.
 */
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MovieInsightResponse | null>(null);

  /**
   * Simulates step progression during loading for visual feedback.
   */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= 3) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  /**
   * Handles the movie search request.
   * Calls the API route and updates state accordingly.
   */
  const handleSearch = useCallback(async (imdbId: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/movie?id=${encodeURIComponent(imdbId)}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || "Failed to fetch movie data");
      }

      // Small delay to let loading animation complete
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(result as MovieInsightResponse);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <Header />

      <main id="main-content">
        {/* Hero Section - Search */}
        <section className="hero" aria-label="Search for movies">
          <h1 className="hero__title">
            Discover Movie <span>Insights</span>
          </h1>
          <p className="hero__subtitle">
            Enter any IMDb movie ID to get detailed information, cast details, and
            AI-powered audience sentiment analysis.
          </p>

          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Error Display */}
        {error && (
          <div className="error-banner" style={{ maxWidth: 560, margin: "0 auto 24px" }} role="alert">
            <span className="error-banner__icon" aria-hidden="true">❌</span>
            <span className="error-banner__text">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingState currentStep={loadingStep} />}

        {/* Results */}
        {data && !isLoading && (
          <section className="result-section" aria-label="Movie results">
            <div className="movie-layout">
              {/* Left Column - Poster */}
              <MoviePoster movie={data.movie} />

              {/* Right Column - Details + Sentiment */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <MovieInfo movie={data.movie} />
                <SentimentPanel
                  sentiment={data.sentiment}
                  reviews={data.reviews}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
