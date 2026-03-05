"use client";

import React from "react";
import { MovieDetails } from "@/types/movie";

interface MovieInfoProps {
    movie: MovieDetails;
}

/**
 * Displays detailed movie information: title, metadata, genres, plot, cast, and credits.
 */
export default function MovieInfo({ movie }: MovieInfoProps) {
    const genres = movie.genre?.split(",").map((g) => g.trim()).filter(Boolean) || [];
    const castList = movie.actors?.split(",").map((a) => a.trim()).filter(Boolean) || [];

    return (
        <div className="details-section">
            {/* Movie Header - Title & Meta */}
            <header className="movie-header" id="movie-header">
                <h1 className="movie-header__title">{movie.title}</h1>

                <div className="movie-header__meta">
                    {movie.year && movie.year !== "N/A" && (
                        <span className="movie-header__meta-item">
                            <span aria-hidden="true">📅</span> {movie.year}
                        </span>
                    )}
                    {movie.runtime && movie.runtime !== "N/A" && (
                        <span className="movie-header__meta-item">
                            <span aria-hidden="true">⏱️</span> {movie.runtime}
                        </span>
                    )}
                    {movie.rated && movie.rated !== "N/A" && (
                        <span className="movie-header__meta-item">
                            <span aria-hidden="true">🎭</span> {movie.rated}
                        </span>
                    )}
                    {movie.imdbRating && movie.imdbRating !== "N/A" && (
                        <span className="movie-header__meta-item">
                            <span aria-hidden="true">⭐</span> {movie.imdbRating}/10
                            {movie.imdbVotes && movie.imdbVotes !== "N/A" && (
                                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                                    ({movie.imdbVotes} votes)
                                </span>
                            )}
                        </span>
                    )}
                </div>

                {genres.length > 0 && (
                    <div className="movie-header__genre-tags" id="genre-tags">
                        {genres.map((genre, idx) => (
                            <span key={idx} className="genre-tag">
                                {genre}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            {/* Plot Summary */}
            <article className="info-card animate-fade-in-up" id="plot-section">
                <div className="info-card__header">
                    <div className="info-card__icon info-card__icon--purple" aria-hidden="true">📖</div>
                    <h2 className="info-card__title">Plot Summary</h2>
                </div>
                <p className="info-card__content">{movie.plot}</p>
            </article>

            {/* Cast */}
            {castList.length > 0 && (
                <article className="info-card animate-fade-in-up" id="cast-section">
                    <div className="info-card__header">
                        <div className="info-card__icon info-card__icon--cyan" aria-hidden="true">👥</div>
                        <h2 className="info-card__title">Cast</h2>
                    </div>
                    <div className="cast-grid stagger">
                        {castList.map((actor, idx) => (
                            <div key={idx} className="cast-member animate-fade-in-up">
                                <div className="cast-member__avatar" aria-hidden="true">
                                    {actor.charAt(0).toUpperCase()}
                                </div>
                                <span className="cast-member__name">{actor}</span>
                            </div>
                        ))}
                    </div>
                </article>
            )}

            {/* Director & Writer */}
            <article className="info-card animate-fade-in-up" id="credits-section">
                <div className="info-card__header">
                    <div className="info-card__icon info-card__icon--amber" aria-hidden="true">🎬</div>
                    <h2 className="info-card__title">Credits</h2>
                </div>
                <div className="info-card__content">
                    {movie.director && movie.director !== "N/A" && (
                        <p style={{ marginBottom: 8 }}>
                            <strong style={{ color: "var(--text-secondary)" }}>Director:</strong>{" "}
                            {movie.director}
                        </p>
                    )}
                    {movie.writer && movie.writer !== "N/A" && (
                        <p style={{ marginBottom: 8 }}>
                            <strong style={{ color: "var(--text-secondary)" }}>Writer:</strong>{" "}
                            {movie.writer}
                        </p>
                    )}
                    {movie.country && movie.country !== "N/A" && (
                        <p style={{ marginBottom: 8 }}>
                            <strong style={{ color: "var(--text-secondary)" }}>Country:</strong>{" "}
                            {movie.country}
                        </p>
                    )}
                    {movie.awards && movie.awards !== "N/A" && (
                        <p>
                            <strong style={{ color: "var(--text-secondary)" }}>Awards:</strong>{" "}
                            <span style={{ color: "var(--accent-amber)" }}>{movie.awards}</span>
                        </p>
                    )}
                </div>
            </article>

            {/* Box Office */}
            {movie.boxOffice && movie.boxOffice !== "N/A" && (
                <article className="info-card animate-fade-in-up" id="box-office-section">
                    <div className="info-card__header">
                        <div className="info-card__icon info-card__icon--emerald" aria-hidden="true">💰</div>
                        <h2 className="info-card__title">Box Office</h2>
                    </div>
                    <p className="info-card__content" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                        {movie.boxOffice}
                    </p>
                </article>
            )}
        </div>
    );
}
