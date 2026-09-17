import React from 'react';
import { JOURNAL_POSTS } from '../data/initialData';
import { BookOpen, Clock, Calendar } from 'lucide-react';

export const JournalSection: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
          From the journal
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Buying guides, care tips and store news
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {JOURNAL_POSTS.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
          >
            {/* Header Colored Block matching screenshot */}
            <div className={`p-6 bg-gradient-to-br ${post.coverColor} text-white min-h-[140px] flex flex-col justify-between`}>
              <span className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-xs text-[10px] font-bold tracking-wider rounded-md uppercase self-start">
                Blog
              </span>
              <h3 className="text-lg font-bold leading-snug line-clamp-2">
                {post.title}
              </h3>
            </div>

            {/* Bottom Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-orange-600 tracking-wider uppercase">
                  {post.category}
                </span>
                <h4 className="text-sm font-bold text-stone-900 mt-1 line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-xs text-stone-500 mt-2 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-stone-400 mt-4 pt-3 border-t border-stone-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
