import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex justify-end mb-8">
          <div className="flex gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="px-6 py-2 bg-slate-900 dark:bg-slate-50 text-slate-50 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
        
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6 font-[family-name:var(--font-geist-sans)]">
            Welcome
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-[family-name:var(--font-geist-sans)]">
            Discover powerful tools and features designed to enhance your productivity and streamline your workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Kanban Board
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Organize your tasks with an intuitive drag-and-drop Kanban board. Track progress, manage workflows, and boost team collaboration.
            </p>
            <Link 
              href="/kanban" 
              className="inline-flex items-center px-6 py-3 bg-slate-900 dark:bg-slate-50 text-slate-50 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-medium"
            >
              Get Started
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
              More Features
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Additional powerful tools and features are coming soon. Stay tuned for updates and new capabilities.
            </p>
            <button 
              disabled
              className="inline-flex items-center px-6 py-3 bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 rounded-lg cursor-not-allowed font-medium"
            >
              Coming Soon
            </button>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Get Started Today
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Ready to transform your productivity? Explore our features and see how they can help you work more effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/kanban" 
                className="px-8 py-3 bg-slate-900 dark:bg-slate-50 text-slate-50 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-medium"
              >
                Try Kanban Board
              </Link>
              <button className="px-8 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-500/10 via-green-400/5 to-transparent pointer-events-none" />
    </div>
  );
}
