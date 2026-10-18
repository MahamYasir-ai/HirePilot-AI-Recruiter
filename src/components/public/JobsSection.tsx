import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowRight, Briefcase, MapPin, Sparkles, Building, Layers, Eye } from 'lucide-react';
import { Job } from '../../types';

interface Props {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  onAskAi: (job: Job) => void;
}

export const JobsSection: React.FC<Props> = ({ jobs, onSelectJob, onApplyJob, onAskAi }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState<'title' | 'level' | 'department'>('title');

  const departments = useMemo(() => {
    const deps = Array.from(new Set(jobs.map(j => j.department)));
    return ['All', ...deps];
  }, [jobs]);

  const levels = useMemo(() => {
    const lvls = Array.from(new Set(jobs.map(j => j.level)));
    return ['All', ...lvls];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter(job => {
        const matchesSearch =
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = selectedDepartment === 'All' || job.department === selectedDepartment;
        const matchesLevel = selectedLevel === 'All' || job.level === selectedLevel;

        return matchesSearch && matchesDept && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'department') return a.department.localeCompare(b.department);
        if (sortBy === 'level') return a.level.localeCompare(b.level);
        return 0;
      });
  }, [jobs, searchQuery, selectedDepartment, selectedLevel, sortBy]);

  return (
    <section id="jobs" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-teal-700 tracking-wider uppercase mb-1">
              Demonstration Vacancies
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Open Positions at Nexora Technologies
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Explore entry-level, internship, and engineering demonstration roles.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-900 tabular-nums">{filteredJobs.length}</span> of <span className="tabular-nums">{jobs.length}</span> demonstration vacancies
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by role title, Python, React, APIs..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50/50"
              />
            </div>

            {/* Department Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
              >
                {departments.map(d => (
                  <option key={d} value={d}>
                    Department: {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
              >
                {levels.map(l => (
                  <option key={l} value={l}>
                    Level: {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
              >
                <option value="title">Sort: Title (A-Z)</option>
                <option value="department">Sort: Department</option>
                <option value="level">Sort: Experience Level</option>
              </select>
            </div>
          </div>

          {/* Quick Active Filters Clear */}
          {(searchQuery || selectedDepartment !== 'All' || selectedLevel !== 'All') && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Filtered view active</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('All');
                  setSelectedLevel('All');
                }}
                className="text-teal-700 hover:text-teal-900 font-medium cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Jobs List Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-semibold text-slate-900">No demonstration vacancies found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We couldn't find any roles matching your current search criteria. Try clearing filters or searching for keywords like "Python" or "React".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDepartment('All');
                setSelectedLevel('All');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Show All 5 Demonstration Vacancies
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all p-6 relative group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Job Primary Details */}
                  <div className="space-y-3 flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{job.department}</span>
                        <span aria-hidden="true">·</span>
                        <span>{job.level}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200/60">
                          Work Arrangement: {job.workArrangement}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {job.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Key Skills - Clean unboxed text with bullets per anti-slop guidelines */}
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Required Skills:</span>
                      {job.requiredSkills.slice(0, 5).map((skill, idx) => (
                        <React.Fragment key={skill}>
                          <span className="text-slate-700">{skill}</span>
                          {idx < Math.min(job.requiredSkills.length, 5) - 1 && (
                            <span className="text-slate-300" aria-hidden="true">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Actions (Single row with clean buttons) */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <button
                      onClick={() => onAskAi(job)}
                      className="px-3 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      title="Ask HirePilot AI Recruiter questions specifically about this position"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>Ask AI</span>
                    </button>
                    <button
                      onClick={() => onSelectJob(job)}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => onApplyJob(job)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      <span>Start Demo Application</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
