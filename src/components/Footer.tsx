"use client";

import React from "react";

/**
 * Footer with attribution and credits.
 */
export default function Footer() {
    return (
        <footer className="footer" role="contentinfo">
            <p>
                Built with{" "}
                <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
                    Next.js
                </a>{" "}
                &bull; Movie data from{" "}
                <a href="https://www.omdbapi.com" target="_blank" rel="noopener noreferrer">
                    OMDB API
                </a>{" "}
                &bull; AI-powered sentiment analysis
            </p>
        </footer>
    );
}
