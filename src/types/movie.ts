/**
 * Represents the movie details fetched from OMDB API.
 */
export interface MovieDetails {
    title: string;
    year: string;
    rated: string;
    released: string;
    runtime: string;
    genre: string;
    director: string;
    writer: string;
    actors: string;
    plot: string;
    language: string;
    country: string;
    awards: string;
    poster: string;
    ratings: Array<{
        source: string;
        value: string;
    }>;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    type: string;
    boxOffice?: string;
}

/**
 * Represents a single user review for the movie.
 */
export interface MovieReview {
    author: string;
    rating: string;
    content: string;
    date?: string;
}

/**
 * Represents the AI-generated sentiment analysis.
 */
export interface SentimentAnalysis {
    classification: "positive" | "mixed" | "negative";
    summary: string;
    confidence: number;
}

/**
 * Combined response from the API containing all movie data.
 */
export interface MovieInsightResponse {
    movie: MovieDetails;
    reviews: MovieReview[];
    sentiment: SentimentAnalysis;
}

/**
 * API error response structure.
 */
export interface ApiError {
    error: string;
    details?: string;
}
