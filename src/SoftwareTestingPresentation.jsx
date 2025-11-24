import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import algeriaLogo from './assets/algeria20_logo-blanc.webp';
import authorPhoto from './assets/mahfoudh-arous.jpg';

const SoftwareTestingPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Software Testing",
      subtitle: "Workshop - Algerie 2.0 2025",
      author: "Mahfoudh Arous",
      links: [
        { url: "https://aladin002dz.github.io/", text: "Portfolio" },
        { url: "https://www.linkedin.com/in/mahfoudh-arous/", text: "LinkedIn" }
      ],
      type: "title"
    },
    {
      title: "Why Testing Matters",
      points: [
        "Increase quality",
        "Reduces risk",
        "Reduces long-term cost"
      ],
      type: "bullet"
    },
    {
      title: "As Career Path",
      sections: [
        {
          heading: "Certifications",
          text: "ISTQB provides structure and career growth"
        },
        {
          heading: "Roles",
          items: [
            "QA (Quality Assurance) Analyst, Engineer,...",
            "SDET (Software Development Engineer in Test)"
          ]
        }
      ],
      type: "section"
    },
    {
      title: "The Testing Pyramid",
      image: true,
      description: "Visual representation of the testing pyramid hierarchy",
      type: "image"
    },
    {
      title: "Test Tooling: Jest vs Vitest",
      subtitle: "Popularity comparison",
      links: [
        { url: "https://npmtrends.com/jest-vs-vitest", text: "View NPM Trends", external: true }
      ],
      sections: [
        {
          heading: "Support",
          items: [
            "Jest: Facebook (Meta) → OpenJs Foundation",
            "Vite Ecosystem, Stackblitz"
          ]
        },
        {
          heading: "Documentation",
          items: [
            "https://vitest.dev/guide/",
            "https://jestjs.io/"
          ]
        }
      ],
      type: "comparison"
    },
    {
      title: "Testing with Vitest",
      points: [
        "Unit testing basics from official docs"
      ],
      sections: [
        {
          heading: "Examples",
          items: [
            "Testing validation functions",
            "Testing React components with RTL",
            "Testing a simple Next.js form",
            "Fast feedback loops with Vitest + RTL"
          ]
        }
      ],
      type: "section"
    },
    {
      title: "Playwright vs Cypress vs Selenium",
      subtitle: "Popularity comparison",
      links: [
        { url: "https://npmtrends.com/cypress-vs-playwright-vs-selenium-webdriver", text: "View NPM Trends", external: true }
      ],
      type: "comparison"
    },
    {
      title: "E2E Testing with Playwright",
      subtitle: "Next.js Multipage",
      points: [
        "Real-browser testing across multiple pages",
        "Test navigation flows in Next.js",
        "Auto-waits for more stable tests",
        "Clean locators & assertions",
        "Trace viewer, screenshots, videos for debugging"
      ],
      type: "bullet"
    },
    {
      title: "Inserting in the Workflow",
      sections: [
        {
          heading: "Testing in Git Hooks",
          items: [
            "Husky pre commit: .husky/pre-commit",
            "Husky pre push hook: .husky/pre-push"
          ]
        },
        {
          heading: "Testing in CI/CD",
          items: [
            "GitHub Actions on PR (Pull Request)"
          ]
        }
      ],
      type: "section"
    },
    {
      title: "Thank you 👋",
      author: "Mahfoudh Arous",
      links: [
        { url: "https://aladin002dz.github.io/", text: "Portfolio" },
        { url: "https://www.linkedin.com/in/mahfoudh-arous/", text: "LinkedIn" }
      ],
      subtitle: "AI for Modern Web Applications Development: React and Next.js",
      type: "closing"
    }
  ];

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const renderSlideContent = (slide) => {
    switch (slide.type) {
      case "title":
        return (
          <div className="flex flex-col h-full px-8 py-12">
            {/* Logo at top center */}
            <div className="flex justify-center mb-8">
              <img
                src={algeriaLogo}
                alt="Algerie 2.0 Logo"
                className="max-w-32 md:max-w-40 h-auto"
              />
            </div>

            {/* Main content centered */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-purple-500 bg-clip-text text-transparent">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light">
                {slide.subtitle}
              </p>
            </div>

            {/* Signature section at bottom */}
            <div className="flex flex-col items-center gap-4 mt-auto">
              {/* Round author photo */}
              <img
                src={authorPhoto}
                alt={slide.author}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-blue-400 shadow-xl shadow-blue-500/50"
              />

              {/* Author name */}
              <p className="text-lg md:text-xl text-gray-400 font-medium">
                {slide.author}
              </p>

              {/* Links */}
              <div className="flex flex-wrap gap-3 justify-center">
                {slide.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
                  >
                    {link.text}
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        );

      case "bullet":
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-blue-400">{slide.title}</h2>
            {slide.subtitle && <p className="text-xl text-gray-400 mb-8">{slide.subtitle}</p>}
            <ul className="space-y-6">
              {slide.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="text-2xl text-blue-400 mt-1">●</span>
                  <span className="text-2xl md:text-3xl text-gray-200">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "section":
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-blue-400">{slide.title}</h2>
            {slide.sections.map((section, idx) => (
              <div key={idx} className="mb-8">
                <h3 className="text-2xl md:text-3xl font-semibold text-purple-400 mb-4">{section.heading}</h3>
                {section.text && <p className="text-xl md:text-2xl text-gray-300 mb-4">{section.text}</p>}
                {section.items && (
                  <ul className="space-y-3 ml-6">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-3">
                        <span className="text-lg text-purple-400 mt-1">○</span>
                        <span className="text-lg md:text-xl text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case "comparison":
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">{slide.title}</h2>
            {slide.subtitle && <p className="text-xl text-gray-400 mb-8">{slide.subtitle}</p>}
            {slide.links && (
              <div className="mb-8">
                {slide.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-lg"
                  >
                    {link.text}
                    <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            )}
            {slide.sections && slide.sections.map((section, idx) => (
              <div key={idx} className="mb-8">
                <h3 className="text-2xl md:text-3xl font-semibold text-purple-400 mb-4">{section.heading}</h3>
                {section.items && (
                  <ul className="space-y-3 ml-6">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-3">
                        <span className="text-lg text-purple-400 mt-1">●</span>
                        <span className="text-lg md:text-xl text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case "image":
        return (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-blue-400">{slide.title}</h2>
            <div className="w-full max-w-2xl h-64 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center border-2 border-blue-400">
              <div className="text-center">
                <div className="text-6xl mb-4">🔺</div>
                <p className="text-xl text-gray-300">{slide.description}</p>
              </div>
            </div>
          </div>
        );

      case "closing":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-blue-400">{slide.title}</h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8">{slide.author}</p>
            {slide.subtitle && (
              <p className="text-xl md:text-2xl text-purple-400 mb-12 max-w-3xl">{slide.subtitle}</p>
            )}
            <div className="flex flex-wrap gap-4 justify-center">
              {slide.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {link.text}
                  <ExternalLink size={16} />
                </a>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="h-screen flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0">
            {renderSlideContent(slides[currentSlide])}
          </div>
        </div>

        <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={prevSlide}
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex-shrink-0"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex gap-2 overflow-x-auto flex-1 justify-center px-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-3 rounded-full transition-all ${index === currentSlide
                    ? 'w-12 bg-blue-400'
                    : 'w-3 bg-gray-600 hover:bg-gray-500'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex-shrink-0"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="text-center mt-2 text-gray-400 text-sm">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 right-4 bg-black bg-opacity-70 px-4 py-2 rounded-lg text-xs text-gray-400 hidden md:block">
        Use ← → arrow keys to navigate
      </div>
    </div>
  );
};

export default SoftwareTestingPresentation;