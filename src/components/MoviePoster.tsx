"use client";

import React from "react";
import { MovieDetails } from "@/types/movie";

interface MoviePosterProps {
    movie: MovieDetails;
}

/**
 * Displays the movie poster with rating badge and quick info tags.
 */
export default function MoviePoster({ movie }: MoviePosterProps) {
    const quickInfoItems = [
        { icon: "📅", label: movie.year },
        { icon: "⏱️", label: movie.runtime },
        { icon: "🌐", label: movie.language?.split(",")[0]?.trim() },
        { icon: "🎭", label: movie.rated },
    ].filter((item) => item.label && item.label !== "N/A");

    return (
        <section className="poster-section" aria-label="Movie poster">
            <div className="poster-card">
                <div className="poster-card__image-wrapper">
                    {movie.poster ? (
                        <img
                            src={movie.poster}
                            alt={`${movie.title} poster`}
                            loading="eager"
                            id="movie-poster-image"
                        />
                    ) : (
                        <div className="poster-card__no-image" aria-label="No poster available">
                            🎬
                        </div>
                    )}
                    {movie.imdbRating && movie.imdbRating !== "N/A" && (
                        <div className="poster-card__rating-badge" id="imdb-rating-badge">
                            <span aria-hidden="true">⭐</span>
                            <span>{movie.imdbRating}</span>
                        </div>
                    )}
                </div>

                <div className="poster-card__quick-info stagger">
                    {quickInfoItems.map((item, idx) => (
                        <span key={idx} className="poster-card__tag animate-fade-in-up">
                            <span aria-hidden="true">{item.icon}</span>
                            {item.label}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
