export default function AboutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-2xl px-4 py-8 sm:px-8">
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900 sm:p-8">
          <h1 className="mb-8 text-4xl font-bold text-black dark:text-zinc-50" data-testid="about-title">
            About This App
          </h1>

          <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
            <section>
              <h2 className="mb-3 text-2xl font-semibold text-black dark:text-zinc-50">What is this?</h2>
              <p className="leading-relaxed" data-testid="about-description">
                This is a simple Todo application built with Next.js, React, and TypeScript. 
                It demonstrates modern web development practices and includes comprehensive 
                testing with Vitest and Playwright.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-black dark:text-zinc-50">Features</h2>
              <ul className="list-inside list-disc space-y-2" data-testid="about-features">
                <li>Create, edit, and delete todos</li>
                <li>Mark tasks as completed</li>
                <li>View statistics and progress</li>
                <li>Local storage persistence</li>
                <li>Dark mode support</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-black dark:text-zinc-50">Testing</h2>
              <p className="leading-relaxed" data-testid="about-testing">
                This app showcases both unit testing with Vitest and end-to-end testing 
                with Playwright, including navigation testing between pages.
              </p>
            </section>

            <section className="pt-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-200" data-testid="about-note">
                  <strong>Note:</strong> This is a demonstration app for testing purposes.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

