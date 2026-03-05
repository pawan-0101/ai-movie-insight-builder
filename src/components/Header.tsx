"use client";

import React from "react";

/**
 * Header component with sticky nav, logo, and branding.
 */
export default function Header() {
    return (
        <header className="header" role="banner">
            <div className="header__inner">
                <div className="header__logo">
                    <span className="header__logo-icon" aria-hidden="true">🎬</span>
                    AI Movie Insight Builder
                </div>
                <span className="header__badge">AI Powered</span>
            </div>
        </header>
    );
}
