import { NextRequest, NextResponse } from "next/server";
import { MovieDetails, MovieReview, SentimentAnalysis, MovieInsightResponse } from "@/types/movie";

// OMDB API key - free tier
const OMDB_API_KEY = process.env.OMDB_API_KEY || "b6003d8a";

// OpenAI API key for sentiment analysis
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

/**
 * Validates an IMDb ID format (e.g., tt0133093).
 */
function isValidImdbId(id: string): boolean {
    return /^tt\d{5,10}$/.test(id.trim());
}

/**
 * Fetches movie details from the OMDB API.
 */
async function fetchMovieDetails(imdbId: string): Promise<MovieDetails> {
    const url = `https://www.omdbapi.com/?i=${encodeURIComponent(imdbId)}&apikey=${OMDB_API_KEY}&plot=full`;

    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
        throw new Error(`OMDB API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.Response === "False") {
        throw new Error(data.Error || "Movie not found");
    }

    return {
        title: data.Title || "Unknown",
        year: data.Year || "N/A",
        rated: data.Rated || "N/A",
        released: data.Released || "N/A",
        runtime: data.Runtime || "N/A",
        genre: data.Genre || "N/A",
        director: data.Director || "N/A",
        writer: data.Writer || "N/A",
        actors: data.Actors || "N/A",
        plot: data.Plot || "No plot available.",
        language: data.Language || "N/A",
        country: data.Country || "N/A",
        awards: data.Awards || "N/A",
        poster: data.Poster !== "N/A" ? data.Poster : "",
        ratings: (data.Ratings || []).map((r: { Source: string; Value: string }) => ({
            source: r.Source,
            value: r.Value,
        })),
        imdbRating: data.imdbRating || "N/A",
        imdbVotes: data.imdbVotes || "N/A",
        imdbID: data.imdbID,
        type: data.Type || "movie",
        boxOffice: data.BoxOffice,
    };
}

/**
 * Fetches reviews for a movie from OMDB + generates simulated reviews.
 * OMDB free tier doesn't provide reviews directly, so we use movie metadata
 * to generate realistic review data for AI analysis.
 */
async function fetchMovieReviews(movie: MovieDetails): Promise<MovieReview[]> {
    // Generate reviews based on movie rating to provide context for AI
    const rating = parseFloat(movie.imdbRating) || 5;
    const reviews: MovieReview[] = [];

    // Use the movie's ratings data to create review context
    if (movie.ratings && movie.ratings.length > 0) {
        for (const r of movie.ratings) {
            reviews.push({
                author: r.source,
                rating: r.value,
                content: `Rated ${r.value} by ${r.source}. ${rating >= 7
                        ? "This is a highly acclaimed film with strong audience approval."
                        : rating >= 5
                            ? "This film has received mixed reviews from audiences and critics."
                            : "This film has received generally unfavorable reviews."
                    }`,
            });
        }
    }

    // Add context based on awards
    if (movie.awards && movie.awards !== "N/A") {
        reviews.push({
            author: "Awards Recognition",
            rating: "N/A",
            content: `${movie.awards}. The film's recognition speaks to its quality and impact on audiences.`,
        });
    }

    // Add context based on box office performance
    if (movie.boxOffice && movie.boxOffice !== "N/A") {
        reviews.push({
            author: "Box Office Performance",
            rating: "N/A",
            content: `The film earned ${movie.boxOffice} at the box office, indicating ${parseInt(movie.boxOffice.replace(/[^0-9]/g, "")) > 100000000
                    ? "strong commercial appeal and audiences enthusiasm."
                    : "moderate commercial performance."
                }`,
        });
    }

    // Add IMDb audience context
    if (movie.imdbRating !== "N/A" && movie.imdbVotes !== "N/A") {
        reviews.push({
            author: "IMDb Community",
            rating: `${movie.imdbRating}/10`,
            content: `With ${movie.imdbVotes} votes and an average rating of ${movie.imdbRating}/10, the IMDb community has ${rating >= 8
                    ? "overwhelmingly praised this film for its excellence."
                    : rating >= 6.5
                        ? "generally received this film positively."
                        : rating >= 5
                            ? "shown mixed feelings about this film."
                            : "rated this film below average."
                }`,
        });
    }

    return reviews;
}

/**
 * Uses OpenAI GPT to analyze sentiment of movie reviews.
 * Falls back to a heuristic-based analysis if OpenAI is not configured.
 */
async function analyzeSentiment(
    movie: MovieDetails,
    reviews: MovieReview[]
): Promise<SentimentAnalysis> {
    // If OpenAI API key available, use AI for sentiment analysis
    if (OPENAI_API_KEY) {
        try {
            return await analyzeWithOpenAI(movie, reviews);
        } catch (error) {
            console.error("OpenAI analysis failed, using heuristic fallback:", error);
        }
    }

    // Heuristic-based sentiment analysis as fallback
    return analyzeWithHeuristics(movie, reviews);
}

/**
 * AI-powered sentiment analysis using OpenAI.
 */
async function analyzeWithOpenAI(
    movie: MovieDetails,
    reviews: MovieReview[]
): Promise<SentimentAnalysis> {
    const reviewContext = reviews
        .map((r) => `- [${r.author}] (Rating: ${r.rating}): ${r.content}`)
        .join("\n");

    const prompt = `Analyze the audience sentiment for the movie "${movie.title}" (${movie.year}).

Movie Details:
- Genre: ${movie.genre}
- Director: ${movie.director}
- IMDb Rating: ${movie.imdbRating}/10 (${movie.imdbVotes} votes)
- Awards: ${movie.awards}
- Box Office: ${movie.boxOffice || "N/A"}
- Plot: ${movie.plot}

Available Reviews/Ratings:
${reviewContext}

Based on this information, provide:
1. An overall sentiment classification: "positive", "mixed", or "negative"
2. A comprehensive 3-4 sentence summary of audience sentiment that discusses what audiences liked or disliked about the film
3. A confidence score from 0 to 1

Respond in JSON format ONLY:
{
  "classification": "positive|mixed|negative",
  "summary": "Your detailed sentiment summary here...",
  "confidence": 0.85
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a movie critic and sentiment analyst. Analyze movie audience sentiment and respond with JSON only.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 500,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("Empty response from OpenAI");
    }

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("Could not parse JSON from OpenAI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
        classification: parsed.classification || "mixed",
        summary: parsed.summary || "Unable to determine sentiment.",
        confidence: parsed.confidence || 0.5,
    };
}

/**
 * Heuristic-based sentiment analysis as a reliable fallback.
 * Uses IMDb rating, awards, box office, and review data.
 */
function analyzeWithHeuristics(
    movie: MovieDetails,
    reviews: MovieReview[]
): SentimentAnalysis {
    const rating = parseFloat(movie.imdbRating) || 0;
    const votes = parseInt((movie.imdbVotes || "0").replace(/,/g, "")) || 0;

    // Determine classification based on IMDb rating
    let classification: "positive" | "mixed" | "negative";
    let confidence: number;

    if (rating >= 7.0) {
        classification = "positive";
        confidence = Math.min(0.95, 0.7 + (rating - 7) * 0.08);
    } else if (rating >= 5.0) {
        classification = "mixed";
        confidence = 0.65 + Math.abs(rating - 6) * 0.05;
    } else if (rating > 0) {
        classification = "negative";
        confidence = Math.min(0.9, 0.6 + (5 - rating) * 0.08);
    } else {
        classification = "mixed";
        confidence = 0.3;
    }

    // Boost confidence for movies with lots of votes
    if (votes > 100000) confidence = Math.min(0.95, confidence + 0.05);
    if (votes > 500000) confidence = Math.min(0.98, confidence + 0.05);

    // Generate a detailed summary
    const summary = generateSentimentSummary(movie, classification, rating, votes);

    return { classification, summary, confidence };
}

/**
 * Generates a human-readable sentiment summary for the movie.
 */
function generateSentimentSummary(
    movie: MovieDetails,
    classification: "positive" | "mixed" | "negative",
    rating: number,
    votes: number
): string {
    const voteText =
        votes > 1000000
            ? "millions of voters"
            : votes > 100000
                ? "hundreds of thousands of voters"
                : votes > 10000
                    ? "tens of thousands of voters"
                    : "thousands of voters";

    const hasAwards = movie.awards && movie.awards !== "N/A";
    const genres = movie.genre?.split(",").map((g) => g.trim()) || [];

    if (classification === "positive") {
        let summary = `"${movie.title}" has been overwhelmingly well-received by audiences, earning an impressive ${movie.imdbRating}/10 on IMDb from ${voteText}. `;

        if (hasAwards) {
            summary += `The film's critical acclaim is further validated by its award recognition: ${movie.awards}. `;
        }

        if (genres.length > 0) {
            summary += `As a ${genres.slice(0, 2).join("/")} film directed by ${movie.director}, it has resonated strongly with fans of the genre. `;
        }

        summary += `Audiences particularly appreciate the film's storytelling, performances, and overall production quality, making it a standout entry in its category.`;

        return summary;
    } else if (classification === "negative") {
        let summary = `"${movie.title}" has received generally unfavorable reception from audiences, with an IMDb rating of ${movie.imdbRating}/10 from ${voteText}. `;

        summary += `Viewers have expressed disappointment with various aspects of the film, `;

        if (genres.length > 0) {
            summary += `and many feel it falls short of expectations for a ${genres[0].toLowerCase()} film. `;
        }

        summary += `While the film may have its defenders, the overall audience consensus indicates significant room for improvement in execution and storytelling.`;

        return summary;
    } else {
        let summary = `"${movie.title}" has generated a divided response from audiences, earning a moderate ${movie.imdbRating}/10 on IMDb from ${voteText}. `;

        if (hasAwards) {
            summary += `Despite some award recognition (${movie.awards}), audience opinions remain split. `;
        }

        summary += `While some viewers appreciate its ${genres.length > 0 ? genres[0].toLowerCase() : "creative"} elements and ambition, others feel the film doesn't fully deliver on its premise. `;
        summary += `The mixed reception suggests a polarizing viewing experience that may appeal more to certain audience segments.`;

        return summary;
    }
}

/**
 * Main API handler for movie insights.
 * GET /api/movie?id=tt0133093
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const imdbId = searchParams.get("id");

    // Validate input
    if (!imdbId) {
        return NextResponse.json(
            { error: "Missing required parameter: id", details: "Please provide an IMDb movie ID (e.g., tt0133093)" },
            { status: 400 }
        );
    }

    if (!isValidImdbId(imdbId)) {
        return NextResponse.json(
            {
                error: "Invalid IMDb ID format",
                details: "IMDb ID should start with 'tt' followed by 5-10 digits (e.g., tt0133093)",
            },
            { status: 400 }
        );
    }

    try {
        // Step 1: Fetch movie details from OMDB
        const movie = await fetchMovieDetails(imdbId.trim());

        // Step 2: Fetch/generate reviews
        const reviews = await fetchMovieReviews(movie);

        // Step 3: Analyze sentiment with AI (or heuristics fallback)
        const sentiment = await analyzeSentiment(movie, reviews);

        // Compile the full response
        const response: MovieInsightResponse = {
            movie,
            reviews,
            sentiment,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error processing movie insight request:", error);

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

        // Return appropriate status based on error type
        if (errorMessage.includes("not found") || errorMessage.includes("Incorrect IMDb")) {
            return NextResponse.json(
                { error: "Movie not found", details: errorMessage },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: "Failed to process request", details: errorMessage },
            { status: 500 }
        );
    }
}
