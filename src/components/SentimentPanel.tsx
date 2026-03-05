"use client";

import React from "react";
import { SentimentAnalysis, MovieReview } from "@/types/movie";

interface SentimentPanelProps {
    sentiment: SentimentAnalysis;
    reviews: MovieReview[];
}

/**
 * Displays AI-powered sentiment analysis results with visual classification
 * and a list of reviews/ratings used for the analysis.
 */
export default function SentimentPanel({ sentiment, reviews }: SentimentPanelProps) {
    const classType = sentiment.classification;

    // Emoji and label mapping for sentiment types
    const sentimentConfig = {
        positive: { emoji: "😊", label: "Positive", badgeText: "Audience Loves It" },
        negative: { emoji: "😞", label: "Negative", badgeText: "Below Expectations" },
        mixed: { emoji: "🤔", label: "Mixed", badgeText: "Divided Opinions" },
    };

    const config = sentimentConfig[classType] || sentimentConfig.mixed;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Sentiment Analysis Card */}
            <article className="sentiment-panel animate-fade-in-up" id="sentiment-panel" aria-label="AI Sentiment Analysis">
                <div className={`sentiment-panel__banner sentiment-panel__banner--${classType}`}>
                    <div className="sentiment-panel__banner-left">
                        <span className="sentiment-panel__emoji" aria-hidden="true">{config.emoji}</span>
                        <div className="sentiment-panel__label-group">
                            <span className="sentiment-panel__label">AI Sentiment Analysis</span>
                            <span className={`sentiment-panel__classification sentiment-panel__classification--${classType}`}>
                                {config.label}
                            </span>
                        </div>
                    </div>
                    <span className={`sentiment-panel__badge sentiment-panel__badge--${classType}`}>
                        {config.badgeText}
                    </span>
                </div>

                <div className="sentiment-panel__body">
                    <p className="sentiment-panel__summary" id="sentiment-summary">
                        {sentiment.summary}
                    </p>

                    <div className="sentiment-panel__ai-note">
                        <span aria-hidden="true">🤖</span>
                        <span>
                            AI-generated analysis • Confidence: {Math.round(sentiment.confidence * 100)}%
                        </span>
                    </div>
                </div>
            </article>

            {/* Reviews List */}
            {reviews.length > 0 && (
                <article className="info-card animate-fade-in-up" id="reviews-section">
                    <div className="info-card__header">
                        <div className="info-card__icon info-card__icon--rose" aria-hidden="true">💬</div>
                        <h2 className="info-card__title">Ratings & Reviews</h2>
                    </div>
                    <div className="reviews-list">
                        {reviews.map((review, idx) => (
                            <div key={idx} className="review-item">
                                <div className="review-item__header">
                                    <span className="review-item__author">{review.author}</span>
                                    {review.rating !== "N/A" && (
                                        <span className="review-item__rating">⭐ {review.rating}</span>
                                    )}
                                </div>
                                <p className="review-item__text">{review.content}</p>
                            </div>
                        ))}
                    </div>
                </article>
            )}
        </div>
    );
}
