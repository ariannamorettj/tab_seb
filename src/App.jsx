import React, { useState } from 'react';
import {
  Database,
  Share2,
  CheckCircle2,
  Activity,
  ArrowRight,
  UploadCloud,
  Settings,
  RefreshCcw,
  Info
} from 'lucide-react';

const workflowData = [
  {
    id: 1,
    title: '1. Tabular Data Preparation',
    icon: <Database className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: 'bg-blue-500',
    steps: [
      {
        sub: '1.a Data Identification',
        desc: 'Entry point: ex novo data collection or selection from existing datasets.',
        inputs: ['Tabular workspace', 'Identifier policy', 'Sampling strategy'],
        ops: ['Template design', 'Semantic declaration', 'Exploratory extraction'],
        outputs: ['Structured templates', 'Field documentation', 'Extraction plan']
      },
      {
        sub: '1.b Harmonisation & Cleaning',
        desc: 'Ensure that structure and values satisfy conversion requirements.',
        inputs: ['Raw tables', 'Schema mappings'],
        ops: ['Date normalisation', 'Deduplication', 'ID syntax validation'],
        outputs: ['Curated tables', 'Transformation log', 'Anomaly report']
      },
      {
        sub: '1.c Enrichment (PID)',
        desc: 'Increase linkability through persistent identifiers.',
        inputs: ['Curated tables', 'Authority records (VIAF, Wikidata)'],
        ops: ['PID insertion', 'Controlled vocabulary linking'],
        outputs: ['Tables enriched with external links']
      },
      {
        sub: '1.d Research Requirements',
        desc: 'Transform the dataset from inventory to research-oriented output.',
        ops: ['Formalisation of entities and relations', 'Definition of filters and aggregations'],
        outputs: ['Query desiderata', 'Optimised subsets']
      },
      {
        sub: '1.e Tabular Publication',
        desc: 'Make the tabular layer citable and reusable before RDF materialisation.',
        outputs: ['Deposited CSV datasets', 'DOI/versioning', 'Documentation']
      }
    ]
  },
  {
    id: 2,
    title: '2. RDF Graph Materialisation',
    icon: <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: 'bg-purple-500',
    steps: [
      {
        sub: '2.a RDF Generation',
        desc: 'Execute the conversion through mappings (e.g. YARRRML).',
        inputs: ['Curated tables', 'Target model', 'Mapping files'],
        ops: ['Table parsing', 'Subject/object generation', 'Fragment merge'],
        outputs: ['RDF serialisations (TTL)', 'Execution diagnostics']
      },
      {
        sub: '2.b Validation',
        desc: 'Verify semantic and structural consistency.',
        ops: ['Duplicate IRI checks', 'Disjoint type conflict checks', 'External link checks'],
        outputs: ['Machine-readable quality report']
      },
      {
        sub: '2.c Testing',
        desc: 'Qualitative and quantitative feedback cycles.',
        ops: ['Code-level checks', 'Human inspection on samples'],
        outputs: ['Performance report', 'Iterative refinement']
      }
    ]
  },
  {
    id: 3,
    title: '3. RDF Data Dissemination',
    icon: <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: 'bg-green-500',
    steps: [
      {
        sub: '3.a Release Publication',
        desc: 'Stabilise the RDF dump on FAIR-oriented platforms.',
        outputs: ['Citable RDF archive', 'Open licence', 'Metadata']
      },
      {
        sub: '3.b SPARQL Endpoint',
        desc: 'Provide stable programmatic access to the graph.',
        inputs: ['Validated RDF', 'Triplestore (e.g. Virtuoso/GraphDB)'],
        outputs: ['Public endpoint', 'Access documentation']
      },
      {
        sub: '3.c Semantic Access Layer',
        desc: 'Web portal for expert and non-expert users.',
        ops: ['Query templates', 'Visualisations', 'Data browser'],
        outputs: ['Web portal', 'Search interfaces']
      },
      {
        sub: '3.d Provenance Management',
        desc: 'Track changes to support auditability.',
        outputs: ['Provenance graph', 'Change logs']
      }
    ]
  },
  {
    id: 4,
    title: '4. Global Quality Control',
    icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: 'bg-orange-500',
    steps: [
      {
        sub: '4.a User Feedback',
        desc: 'Collect issues concerning templates and usability.',
        outputs: ['Harmonisation tasks', 'Mapping revisions']
      },
      {
        sub: '4.b Quali-Quantitative Evaluation',
        desc: 'Analyse the whole process and its performance.',
        inputs: ['Validation reports', 'Output statistics', 'Feedback'],
        outputs: ['Comparative assessment']
      },
      {
        sub: '4.c Reiteration Plan',
        desc: 'Formalise update and rerun cycles.',
        ops: ['Identification of phases to rerun', 'Documentation of deviations'],
        outputs: ['Iteration plan (lifecycle model)']
      }
    ]
  }
];

export default function App() {
  const [activePhase, setActivePhase] = useState(0);
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 text-slate-900">
      <nav className="sticky top-0 z-50 mb-8 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`${baseUrl}`}
            className="text-lg font-bold text-slate-800 no-underline"
          >
            TAB-SEB
          </a>

          <div className="flex flex-wrap gap-2">
            <a
              href={`${baseUrl}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 no-underline hover:bg-slate-100"
            >
              Workflow
            </a>

            <a
              href={`${baseUrl}external-resources.html`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 no-underline hover:bg-slate-100"
            >
              External Resources
            </a>
          </div>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto mb-8 sm:mb-10 lg:mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 leading-tight">
          TABular Semantic Enhancement Blueprint (TAB-SEB)
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          Interactive overview of the technical workflow for tabular data preparation, RDF materialisation, and dissemination.
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="xl:col-span-4 space-y-4">
          <h2 className="text-sm sm:text-base font-semibold uppercase tracking-wider text-slate-400 px-1">
            Workflow Phases
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {workflowData.map((phase, index) => (
              <button
                key={phase.id}
                type="button"
                onClick={() => setActivePhase(index)}
                className={`w-full text-left transition-all duration-300 border-l-4 p-4 sm:p-5 rounded-r-xl shadow-sm hover:translate-x-1 ${
                  activePhase === index
                    ? `${phase.color.replace('bg-', 'border-')} bg-white shadow-md`
                    : 'border-transparent bg-slate-100 opacity-95 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`p-2 rounded-lg text-white ${phase.color} shrink-0`}>
                    {phase.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-bold text-base sm:text-lg leading-snug ${
                        activePhase === index ? 'text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      {phase.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 uppercase font-medium">
                      {phase.steps.length} subprocesses
                    </p>
                  </div>

                  {activePhase === index && (
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 p-4 border-2 border-dashed border-orange-200 rounded-xl bg-orange-50 flex items-start gap-3">
            <RefreshCcw className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 animate-spin-slow mt-0.5" />
            <p className="text-sm sm:text-base text-orange-800 italic leading-relaxed">
              Feedback from Phase 4 recursively informs the preceding phases for continuous refinement.
            </p>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-0 xl:min-h-[700px] flex flex-col">
            <div className={`p-5 sm:p-6 text-white flex items-center gap-3 ${workflowData[activePhase].color}`}>
              {workflowData[activePhase].icon}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                {workflowData[activePhase].title}
              </h2>
            </div>

            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                {workflowData[activePhase].steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2 text-base sm:text-lg leading-snug">
                        <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-blue-500 shrink-0"></div>
                        <span>{step.sub}</span>
                      </h4>
                    </div>

                    <p className="text-base sm:text-lg text-slate-600 mb-4 leading-relaxed">
                      {step.desc}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                      {step.inputs && (
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-bold uppercase text-blue-500 flex items-center gap-1 mb-2 tracking-wide">
                            <Settings className="w-4 h-4" /> Technical Inputs
                          </span>
                          <ul className="text-sm sm:text-base space-y-1.5">
                            {step.inputs.map((inp, i) => (
                              <li key={i} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                                <span className="text-blue-300 shrink-0 mt-0.5">•</span>
                                <span>{inp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.ops && (
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-bold uppercase text-purple-500 flex items-center gap-1 mb-2 tracking-wide">
                            <Activity className="w-4 h-4" /> Core Operations
                          </span>
                          <ul className="text-sm sm:text-base space-y-1.5">
                            {step.ops.map((op, i) => (
                              <li key={i} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                                <span className="text-purple-300 shrink-0 mt-0.5">•</span>
                                <span>{op}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className={!(step.inputs || step.ops) ? 'lg:col-span-2 min-w-0' : 'min-w-0'}>
                        <span className="text-xs sm:text-sm font-bold uppercase text-green-600 flex items-center gap-1 mb-2 tracking-wide">
                          <CheckCircle2 className="w-4 h-4" /> Expected Outputs
                        </span>
                        <ul className="text-sm sm:text-base space-y-1.5">
                          {step.outputs.map((out, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700 font-medium leading-relaxed">
                              <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                              <span>{out}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-start gap-2 text-xs sm:text-sm text-slate-400 italic">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Select a phase on the left to explore its technical details.</span>
            </div>
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-spin-slow {
              animation: spin-slow 8s linear infinite;
            }
          `
        }}
      />
    </div>
  );
}