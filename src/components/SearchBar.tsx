"use client";

import React, { useState, FormEvent } from "react";

interface SearchBarProps {
    onSearch: (imdbId: string) => void;
    isLoading: boolean;
}

/**
 * Search bar component for entering IMDb movie IDs.
 * Includes validation, example hints, and loading state.
 */
export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [inputValue, setInputValue] = useState("");
    const [validationError, setValidationError] = useState("");

    const exampleIds = [
        { id: "tt0133093", label: "The Matrix" },
        { id: "tt0111161", label: "Shawshank" },
        { id: "tt1375666", label: "Inception" },
    ];

    /**
     * Validates and submits the IMDb ID.
     */
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = inputValue.trim();

        if (!trimmed) {
            setValidationError("Please enter an IMDb movie ID");
            return;
        }

        if (!/^tt\d{5,10}$/.test(trimmed)) {
            setValidationError("Invalid format. Use format: tt followed by 5-10 digits (e.g., tt0133093)");
            return;
        }

        setValidationError("");
        onSearch(trimmed);
    };

    /**
     * Fills in an example IMDb ID.
     */
    const fillExample = (id: string) => {
        setInputValue(id);
        setValidationError("");
        onSearch(id);
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} role="search" aria-label="Search movies by IMDb ID">
                <div className="search-box" id="search-box">
                    <span className="search-box__icon" aria-hidden="true">🔍</span>
                    <input
                        id="imdb-search-input"
                        type="text"
                        className="search-box__input"
                        placeholder="Enter IMDb ID (e.g., tt0133093)"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            if (validationError) setValidationError("");
                        }}
                        disabled={isLoading}
                        aria-label="IMDb movie ID"
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <button
                        id="search-submit-btn"
                        type="submit"
                        className={`search-box__btn ${isLoading ? "search-box__btn--loading" : ""}`}
                        disabled={isLoading}
                        aria-label={isLoading ? "Searching..." : "Search movie"}
                    >
                        {isLoading ? (
                            <>
                                <span className="loader__spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                ✨ Get Insights
                            </>
                        )}
                    </button>
                </div>
            </form>

            {validationError && (
                <div className="error-banner" style={{ marginTop: 12 }} role="alert">
                    <span className="error-banner__icon">⚠️</span>
                    <span className="error-banner__text">{validationError}</span>
                </div>
            )}

            <div className="search-hint">
                <span>Try:</span>
                {exampleIds.map((example) => (
                    <button
                        key={example.id}
                        className="search-hint__example"
                        onClick={() => fillExample(example.id)}
                        disabled={isLoading}
                        aria-label={`Search for ${example.label}`}
                        type="button"
                    >
                        {example.id}
                    </button>
                ))}
            </div>
        </div>
    );
}
