import React, { useState, useEffect } from 'react';
import {
  Database,
  Share2,
  CheckCircle2,
  Activity,
  ArrowRight,
  UploadCloud,
  Settings,
  RefreshCcw,
  Info,
  Layers,
  ChevronDown,
} from 'lucide-react';

// ─── Actor definitions ────────────────────────────────────────────────────────
const ACTORS = {
  DE: { name: 'Domain Expert',          color: '#ef9f27', bg: '#fef8ec', border: '#f7d38a', textColor: '#7a4f00' },
  ME: { name: 'Metadata Expert',         color: '#2a5d71', bg: '#e8f3f7', border: '#8ab8cc', textColor: '#1a3d4d' },
  SW: { name: 'Semantic Web Specialist', color: '#8791be', bg: '#eef0f7', border: '#c4c9e0', textColor: '#454e7a' },
  DH: { name: 'Digital Humanist',        color: '#543e4c', bg: '#f0eced', border: '#b09aa8', textColor: '#3a2a33' },
};

// ─── Case study data ──────────────────────────────────────────────────────────
const ALL_STEP_IDS = ['1.1','1.2','1.3','1.4','1.5','1.6','2.1','2.2','2.3','3.1','3.2','3.3','3.4','4.1','4.2','4.3'];

const CASE_STUDIES = {
  all: { name: 'Full Blueprint', implements: ALL_STEP_IDS, details: {} },
  aldrovandi: {
    name: 'Aldrovandi',
    implements: ALL_STEP_IDS,
    details: {
      '1.1': { how: 'Object metadata and digitisation paradata collected via CHANGES spreadsheet templates; semantic fields declared for both CHO description and process recording.', tools: 'CHANGES templates (ODS/CSV), CHAD-AP application profile', actors: ['DE','ME','DH'] },
      '1.2': { how: 'Date normalisation, deduplication, and ID syntax validation applied to both acquisition and object spreadsheets before conversion.', tools: 'OpenRefine, Python scripts, Morph-KGChad pre-processing', actors: ['ME','DH'] },
      '1.3': { how: 'VIAF and Wikidata identifiers inserted for agents and works; controlled vocabulary terms linked to AAT.', tools: 'OpenRefine reconciliation, VIAF API, Wikidata SPARQL', actors: ['ME','SW'] },
      '1.4': { how: 'Research questions formalised around the relation between digitisation events and exhibited objects; query desiderata defined before mapping design.', tools: 'Domain elicitation via CHAD-ASK questionnaire', actors: ['DE','DH'] },
      '1.5': { how: 'Two CSV datasets (object metadata + paradata) deposited on Zenodo with DOI, version tracking, and README documentation.', tools: 'Zenodo, CHAD-AP documentation', actors: ['DH','ME'] },
      '1.6': { how: 'YARRRML mapping files designed for object and paradata layers; INI configuration produced; CHAD-ASK used to semi-automatically derive rules.', tools: 'YARRRML, Morph-KGChad, CHAD-ASK', actors: ['SW','DH'] },
      '2.1': { how: 'Morph-KGChad executed YARRRML-to-RDF conversion producing CHAD-AP-compliant Turtle. Separate mapping files for CHO and process paradata merged.', tools: 'Morph-KGChad (Morph-KGC extension)', actors: ['SW','DH'] },
      '2.2': { how: 'Duplicate IRI checks, disjoint type conflict checks, and external link validation via Morph-KGChad quality module.', tools: 'Morph-KGChad quality checks, RDFLib', actors: ['SW'] },
      '2.3': { how: 'Code-level unit tests on mapping rules; human inspection on a 10% sample; iterative corrections applied.', tools: 'pytest, manual SPARQL queries on local endpoint', actors: ['SW','DE'] },
      '3.1': { how: 'CHAD-KG Turtle dump deposited on Zenodo with CC0 licence, DOI, and provenance metadata.', tools: 'Zenodo, CC0 licence', actors: ['DH','ME'] },
      '3.2': { how: 'RDF graph loaded into a public-facing SPARQL endpoint; endpoint URL and query examples documented.', tools: 'Virtuoso / GraphDB', actors: ['SW','DH'] },
      '3.3': { how: 'Static HTML layer and predefined SPARQL query templates published; website linked from the CHAD-KG Zenodo deposit.', tools: 'Custom HTML/JS data browser, SPARQL templates', actors: ['SW','DH'] },
      '3.4': { how: 'PROV-O-aligned provenance graph recording dataset versions, agent responsibilities, and derivation chains embedded in CHAD-KG.', tools: 'PROV-O, CHAD-AP provenance module', actors: ['SW','ME'] },
      '4.1': { how: 'Feedback collected from domain partners and CHANGES project members on template usability; issues tracked and triaged.', tools: 'GitHub Issues, structured feedback questionnaire', actors: ['DE','DH'] },
      '4.2': { how: 'FAIRness assessment matrix applied using the 3-level heritage-collection rubric; quantitative coverage metrics computed.', tools: 'FAIR rubric (Table 2 in Data Intelligence article)', actors: ['DH','ME'] },
      '4.3': { how: 'Iteration plan documented, identifying data-collection and mapping steps to re-execute when new objects are added.', tools: 'Protocols.io (TAB-SEB blueprint), lifecycle documentation', actors: ['DH','DE'] },
    }
  },
  capellini: {
    name: 'Capellini',
    implements: ['1.1','1.2','1.4','2.1','2.3','4.1'],
    details: {
      '1.1': { how: 'Subset of CHANGES templates adapted for palaeontological object records from the Capellini collection.', tools: 'CHANGES templates (adapted subset)', actors: ['DE','ME'] },
      '1.2': { how: 'Field normalisation and deduplication applied to raw Capellini records; schema aligned with the CHANGES data model.', tools: 'Python scripts', actors: ['ME','DH'] },
      '1.4': { how: 'Research questions formalised around taxon-level description and institutional provenance.', tools: 'Domain elicitation sessions', actors: ['DE','DH'] },
      '2.1': { how: 'Morph-KGChad used for a pilot RDF generation run against the harmonised Capellini tabular data.', tools: 'Morph-KGChad', actors: ['SW','DH'] },
      '2.3': { how: 'Qualitative inspection of a sample of generated triples; structural anomalies noted for a future full validation pass.', tools: 'Manual SPARQL queries', actors: ['SW','DE'] },
      '4.1': { how: 'Feedback from palaeontology domain experts on template coverage and field granularity collected to inform next iteration.', tools: 'Structured feedback sessions', actors: ['DE','DH'] },
    }
  },
  ddc: {
    name: 'Digital Damaged Ceramics',
    implements: ['1.1','1.2','1.3','1.4','1.5','1.6','2.1','2.2','3.1','3.2','3.3','4.1','4.3'],
    details: {
      '1.1': { how: 'Extended CHANGES templates translated into English; material and damage-state fields added for ceramics damaged by bombing.', tools: 'CHANGES extended templates (DDC fork, CSV)', actors: ['DE','ME','DH'] },
      '1.2': { how: 'Header-level harmonisation using JSON field-name mappings; structural drift from the base template documented and tolerated.', tools: 'Python scripts, CHANGES field-names mapping (JSON)', actors: ['ME','DH'] },
      '1.3': { how: 'PID insertion for museum objects; controlled vocabulary links for material and technique terms.', tools: 'Getty AAT lookups, VIAF for institutions', actors: ['ME','SW'] },
      '1.4': { how: 'Research questions around material characterisation of war-damaged ceramics formalised; crm:P45_consists_of extension planned.', tools: 'Domain elicitation with ceramics expert', actors: ['DE','DH'] },
      '1.5': { how: 'CSV datasets deposited on Zenodo with versioning; documentation article published.', tools: 'Zenodo, CC BY licence', actors: ['DH','ME'] },
      '1.6': { how: 'YARRRML mapping files extended to handle English-header templates and material representation; DDC fork of Morph-KGChad configured.', tools: 'YARRRML, Morph-KGChad DDC fork', actors: ['SW','DH'] },
      '2.1': { how: 'Morph-KGChad DDC extension executed conversion producing CHAD-AP-compliant Turtle with material extension triples.', tools: 'Morph-KGChad DDC fork', actors: ['SW','DH'] },
      '2.2': { how: 'Structural and semantic validation of generated RDF; duplicate checks; controlled-term link verification.', tools: 'Morph-KGChad quality module, RDFLib', actors: ['SW'] },
      '3.1': { how: 'RDF and CSV dataset deposited on Zenodo under CC BY licence with DOI and version tracking.', tools: 'Zenodo', actors: ['DH','ME'] },
      '3.2': { how: 'Public SPARQL endpoint provisioned; predefined query templates published on the project website.', tools: 'SPARQL endpoint, website SPARQL page', actors: ['SW','DH'] },
      '3.3': { how: 'Project website with data browser, 3D viewer, and dataset download page. Reproducibility package released.', tools: 'Custom HTML website, 3D viewer, data-analysis assets', actors: ['SW','DH'] },
      '4.1': { how: 'Feedback from ceramics domain expert on material and damage-state field coverage; template revisions planned.', tools: 'Issue tracking, collaborative review', actors: ['DE','DH'] },
      '4.3': { how: 'Iteration plan identifying steps to rerun when additional ceramics collections are ingested; deviations from base template documented.', tools: 'Protocols.io, change log', actors: ['DH','DE'] },
    }
  },
  bnf: {
    name: 'BnF Early Modern',
    implements: ['1.1','1.2','1.3','1.4','1.5','1.6','2.1','2.2','3.2','3.3'],
    details: {
      '1.1': { how: 'Early Modern bibliographic data retrieved from BnF via staged SPARQL queries; actors and editions identified as primary entities.', tools: 'BnF SPARQL endpoint, Python retrieval scripts', actors: ['DH','ME'] },
      '1.2': { how: 'Unification, duplicate analysis, and harmonisation of actor and edition records; diagnostics explicitly logged.', tools: 'Python harmonisation scripts, diagnostic reports', actors: ['ME','DH'] },
      '1.3': { how: 'BnF identifiers retained; VIAF links added for actors where available; controlled vocabulary terms aligned.', tools: 'VIAF API, BnF authority records', actors: ['ME','SW'] },
      '1.4': { how: 'Research questions formalised around the actor–edition relationship in the Early Modern bibliographic network.', tools: 'Domain scoping sessions', actors: ['DE','DH'] },
      '1.5': { how: 'Intermediate harmonised tabular datasets documented and preserved as reproducible intermediate outputs.', tools: 'Repository versioning, protocols.io documentation', actors: ['DH','ME'] },
      '1.6': { how: 'Mapping logic embedded in the RDF-generation scripts; alignment of BnF fields to the target bibliographic model specified.', tools: 'Python RDF generation scripts', actors: ['SW','DH'] },
      '2.1': { how: 'RDF graph generation executed by the data-collector-and-harmoniser scripts; actor and edition layers generated separately and merged.', tools: 'Early Modern BnF Data Collector and Harmoniser', actors: ['SW','DH'] },
      '2.2': { how: 'Structural consistency checks applied; duplicate actor IRIs and ambiguous edition merges reviewed.', tools: 'RDFLib, custom validation scripts', actors: ['SW'] },
      '3.2': { how: 'SPARQL endpoint provisioned for the generated bibliographic graph; access documented.', tools: 'SPARQL endpoint', actors: ['SW','DH'] },
      '3.3': { how: 'Query templates and a lightweight HTML access layer published for human-readable exploration.', tools: 'HTML access layer, SPARQL query templates', actors: ['SW','DH'] },
    }
  },
  oci: {
    name: 'OpenCitations Index',
    implements: ['1.1','1.2','1.3','1.5','1.6','2.1','3.1','3.2','3.3','3.4','4.2'],
    details: {
      '1.1': { how: 'Heterogeneous bibliographic and citation sources (Crossref, DataCite, PubMed, OpenAIRE, JaLC, mEDRA) identified and ingested via the OC-DS-Converter.', tools: 'oc-ds-converter Python package', actors: ['SW','DH'] },
      '1.2': { how: 'Crosswalk and normalisation of source-specific schemas into OCDM-aligned tabular outputs; modular converters per source.', tools: 'oc-ds-converter, shared validation and normalisation components', actors: ['SW','ME'] },
      '1.3': { how: 'DOIs, ORCID identifiers, ISSN, and other PIDs validated and normalised for all cited and citing entities.', tools: 'oc-ds-converter ID validation modules', actors: ['ME','SW'] },
      '1.5': { how: 'Citation CSV and provenance datasets published on Figshare with DOI and CC0 licence; multiple distribution formats provided.', tools: 'Figshare, CC0, multiple serialisation formats', actors: ['DH','ME'] },
      '1.6': { how: 'Mapping from OCDM-aligned tabular format to RDF specified; conversion pipeline configuration managed.', tools: 'OCDM specification, conversion configuration', actors: ['SW'] },
      '2.1': { how: 'Large-scale conversion from pre-processed CSV to RDF executed through the OpenCitations materialisation pipeline.', tools: 'OpenCitations materialisation pipeline', actors: ['SW'] },
      '3.1': { how: 'Citation dataset and provenance dataset released in multiple formats (CSV, N-Triples, Scholix) on Figshare with CC0 and DOI.', tools: 'Figshare, CC0', actors: ['DH','ME'] },
      '3.2': { how: 'SPARQL endpoint and REST API v2 provisioned; documented at w3id.org/oc/index.', tools: 'Virtuoso, w3id.org/oc/index/sparql, REST API v2', actors: ['SW'] },
      '3.3': { how: 'OpenCitations website with service entry point, LUCINDA data browser, and SPARQL interface for expert and non-expert access.', tools: 'opencitations.net, LUCINDA', actors: ['SW','DH'] },
      '3.4': { how: 'Provenance dataset explicitly maintained alongside citation data; change logs documenting source updates preserved.', tools: 'Provenance CSV, N-Triples, PROV-O alignment', actors: ['SW','ME'] },
      '4.2': { how: 'Quantitative metrics on citation coverage across sources computed; comparative analysis across release snapshots documented in the Scientometrics article.', tools: 'Custom analysis scripts, Scientometrics publication', actors: ['DH','ME'] },
    }
  },
};

// ─── Per-step resource links (→ external-resources.html) ─────────────────────
const STEP_LINKS = {
  aldrovandi: {
    '1.1': [{ label: 'CHANGES Templates',         section: 'data-preparation' }],
    '1.2': [{ label: 'Data Preparation',           section: 'data-preparation' }],
    '1.3': [{ label: 'Data Preparation',           section: 'data-preparation' }],
    '1.4': [{ label: 'CHAD-ASK',                   section: 'rdf-materialisation' }],
    '1.5': [{ label: 'Aldrovandi CSV Datasets',    section: 'publication' }],
    '1.6': [{ label: 'Morph-KGChad',               section: 'rdf-materialisation' }, { label: 'CHAD-ASK', section: 'rdf-materialisation' }, { label: 'INI & YARRRML Config', section: 'rdf-materialisation' }],
    '2.1': [{ label: 'Morph-KGChad',               section: 'rdf-materialisation' }],
    '2.2': [{ label: 'Morph-KGChad',               section: 'rdf-materialisation' }],
    '2.3': [{ label: 'Morph-KGChad',               section: 'rdf-materialisation' }],
    '3.1': [{ label: 'CHAD-KG',                    section: 'publication' }],
    '3.2': [{ label: 'CHAD-KG',                    section: 'publication' }],
    '3.3': [{ label: 'CHAD-KG',                    section: 'publication' }],
    '3.4': [{ label: 'CHAD-KG',                    section: 'publication' }],
    '4.1': [{ label: 'TAB-SEB Blueprint',          section: 'blueprint' }],
    '4.2': [{ label: 'FAIRness Assessment Matrix', section: 'quality' }],
    '4.3': [{ label: 'TAB-SEB Blueprint',          section: 'blueprint' }],
  },
  capellini: {
    '1.1': [{ label: 'CHANGES Templates',  section: 'data-preparation' }],
    '1.2': [{ label: 'Data Preparation',   section: 'data-preparation' }],
    '1.4': [{ label: 'Data Preparation',   section: 'data-preparation' }],
    '2.1': [{ label: 'Morph-KGChad',       section: 'rdf-materialisation' }],
    '2.3': [{ label: 'RDF Materialisation', section: 'rdf-materialisation' }],
    '4.1': [{ label: 'TAB-SEB Blueprint',  section: 'blueprint' }],
  },
  ddc: {
    '1.1': [{ label: 'DDC Extended Templates',       section: 'data-preparation' }],
    '1.2': [{ label: 'DDC Extended Templates',       section: 'data-preparation' }],
    '1.3': [{ label: 'Data Preparation',              section: 'data-preparation' }],
    '1.4': [{ label: 'Data Preparation',              section: 'data-preparation' }],
    '1.5': [{ label: 'DDC Dataset',                   section: 'publication' }],
    '1.6': [{ label: 'Morph-KGChad DDC Extension',   section: 'rdf-materialisation' }],
    '2.1': [{ label: 'Morph-KGChad DDC Extension',   section: 'rdf-materialisation' }],
    '2.2': [{ label: 'Morph-KGChad DDC Extension',   section: 'rdf-materialisation' }],
    '3.1': [{ label: 'DDC Dataset',                   section: 'publication' }],
    '3.2': [{ label: 'DDC Dataset',                   section: 'publication' }],
    '3.3': [{ label: 'DDC Website & Reproducibility', section: 'publication' }],
    '4.1': [{ label: 'TAB-SEB Blueprint',             section: 'blueprint' }],
    '4.3': [{ label: 'TAB-SEB Blueprint',             section: 'blueprint' }],
  },
  bnf: {
    '1.1': [{ label: 'BnF Data Collector',  section: 'data-preparation' }],
    '1.2': [{ label: 'BnF Data Collector',  section: 'data-preparation' }],
    '1.3': [{ label: 'Data Preparation',    section: 'data-preparation' }],
    '1.4': [{ label: 'Data Preparation',    section: 'data-preparation' }],
    '1.5': [{ label: 'Data Preparation',    section: 'data-preparation' }],
    '1.6': [{ label: 'BnF Data Collector',  section: 'data-preparation' }],
    '2.1': [{ label: 'BnF Data Collector',  section: 'data-preparation' }],
    '2.2': [{ label: 'RDF Materialisation', section: 'rdf-materialisation' }],
    '3.2': [{ label: 'Data Publication',    section: 'publication' }],
    '3.3': [{ label: 'Data Publication',    section: 'publication' }],
  },
  oci: {
    '1.1': [{ label: 'OC-DS-Converter',      section: 'data-preparation' }],
    '1.2': [{ label: 'OC-DS-Converter',      section: 'data-preparation' }],
    '1.3': [{ label: 'OC-DS-Converter',      section: 'data-preparation' }],
    '1.5': [{ label: 'OCI Citation Dataset', section: 'publication' }],
    '1.6': [{ label: 'RDF Materialisation',  section: 'rdf-materialisation' }],
    '2.1': [{ label: 'RDF Materialisation',  section: 'rdf-materialisation' }],
    '3.1': [{ label: 'OCI Citation Dataset', section: 'publication' }],
    '3.2': [{ label: 'OCI Citation Dataset', section: 'publication' }],
    '3.3': [{ label: 'OCI Citation Dataset', section: 'publication' }],
    '3.4': [{ label: 'OCI Citation Dataset', section: 'publication' }],
    '4.2': [{ label: 'FAIRness Assessment',  section: 'quality' }],
  },
};

// ─── Workflow skeleton ────────────────────────────────────────────────────────
const workflowData = [
  {
    id: 1,
    title: '1. Tabular Data Preparation',
    icon: <Database className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: 'bg-[#2a5d71]',
    steps: [
      {
        id: '1.1', sub: '1.a Data Identification', actors: ['DE','ME','DH'],
        desc: 'Entry point: ex novo data collection or selection from existing datasets.',
        inputs: ['Tabular workspace', 'Identifier policy', 'Sampling strategy'],
        ops: ['Template design', 'Semantic declaration', 'Exploratory extraction'],
        outputs: ['Structured templates', 'Field documentation', 'Extraction plan']
      },
      {
        id: '1.2', sub: '1.b Harmonisation & Cleaning', actors: ['ME','DH'],
        desc: 'Ensure that structure and values satisfy conversion requirements.',
        inputs: ['Raw tables', 'Schema mappings'],
        ops: ['Date normalisation', 'Deduplication', 'ID syntax validation'],
        outputs: ['Curated tables', 'Transformation log', 'Anomaly report']
      },
      {
        id: '1.3', sub: '1.c Enrichment (PID)', actors: ['ME','SW'],
        desc: 'Increase linkability through persistent identifiers.',
        inputs: ['Curated tables', 'Authority records (VIAF, Wikidata)'],
        ops: ['PID insertion', 'Controlled vocabulary linking'],
        outputs: ['Tables enriched with external links']
      },
      {
        id: '1.4', sub: '1.d Research Requirements', actors: ['DE','DH'],
        desc: 'Transform the dataset from inventory to research-oriented output.',
        ops: ['Formalisation of entities and relations', 'Definition of filters and aggregations'],
        outputs: ['Query desiderata', 'Optimised subsets']
      },
      {
        id: '1.5', sub: '1.e Tabular Publication', actors: ['DH','ME'],
        desc: 'Make the tabular layer citable and reusable before RDF materialisation.',
        outputs: ['Deposited CSV datasets', 'DOI/versioning', 'Documentation']
      },
      {
        id: '1.6', sub: '1.f Mapping Specification', actors: ['SW','DH'],
        desc: 'Design the semantic mapping specifications aligning table columns to the target RDF model.',
        inputs: ['Curated tables', 'Target ontology/model'],
        ops: ['YARRRML/RML rule authoring', 'Configuration design', 'Semi-automatic rule generation'],
        outputs: ['Mapping files (YARRRML/RML)', 'Runtime configuration', 'Mapping documentation']
      },
    ]
  },
  {
    id: 2,
    title: '2. RDF Graph Materialisation',
    icon: <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: 'bg-[#8791be]',
    steps: [
      {
        id: '2.1', sub: '2.a RDF Generation', actors: ['SW','DH'],
        desc: 'Execute the conversion through mappings (e.g. YARRRML).',
        inputs: ['Curated tables', 'Target model', 'Mapping files'],
        ops: ['Table parsing', 'Subject/object generation', 'Fragment merge'],
        outputs: ['RDF serialisations (TTL)', 'Execution diagnostics']
      },
      {
        id: '2.2', sub: '2.b Validation', actors: ['SW'],
        desc: 'Verify semantic and structural consistency.',
        ops: ['Duplicate IRI checks', 'Disjoint type conflict checks', 'External link checks'],
        outputs: ['Machine-readable quality report']
      },
      {
        id: '2.3', sub: '2.c Testing', actors: ['SW','DE'],
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
    color: 'bg-[#ff8541]',
    steps: [
      {
        id: '3.1', sub: '3.a Release Publication', actors: ['DH','ME'],
        desc: 'Stabilise the RDF dump on FAIR-oriented platforms.',
        outputs: ['Citable RDF archive', 'Open licence', 'Metadata']
      },
      {
        id: '3.2', sub: '3.b SPARQL Endpoint', actors: ['SW','DH'],
        desc: 'Provide stable programmatic access to the graph.',
        inputs: ['Validated RDF', 'Triplestore (e.g. Virtuoso/GraphDB)'],
        outputs: ['Public endpoint', 'Access documentation']
      },
      {
        id: '3.3', sub: '3.c Semantic Access Layer', actors: ['SW','DH'],
        desc: 'Web portal for expert and non-expert users.',
        ops: ['Query templates', 'Visualisations', 'Data browser'],
        outputs: ['Web portal', 'Search interfaces']
      },
      {
        id: '3.4', sub: '3.d Provenance Management', actors: ['SW','ME'],
        desc: 'Track changes to support auditability.',
        outputs: ['Provenance graph', 'Change logs']
      }
    ]
  },
  {
    id: 4,
    title: '4. Global Quality Control',
    icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: 'bg-[#f33f50]',
    steps: [
      {
        id: '4.1', sub: '4.a User Feedback', actors: ['DE','DH'],
        desc: 'Collect issues concerning templates and usability.',
        outputs: ['Harmonisation tasks', 'Mapping revisions']
      },
      {
        id: '4.2', sub: '4.b Quali-Quantitative Evaluation', actors: ['DH','ME'],
        desc: 'Analyse the whole process and its performance.',
        inputs: ['Validation reports', 'Output statistics', 'Feedback'],
        outputs: ['Comparative assessment']
      },
      {
        id: '4.3', sub: '4.c Reiteration Plan', actors: ['DH','DE'],
        desc: 'Formalise update and rerun cycles.',
        ops: ['Identification of phases to rerun', 'Documentation of deviations'],
        outputs: ['Iteration plan (lifecycle model)']
      }
    ]
  }
];

// ─── Logo animation ───────────────────────────────────────────────────────────
const SLOT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function SlotChar({ target, startDelay = 0, spinDuration = 700 }) {
  const [char, setChar] = useState(() => SLOT_CHARS[Math.floor(Math.random() * SLOT_CHARS.length)]);

  useEffect(() => {
    let spinInterval;
    let stopTimeout;
    const startTimeout = setTimeout(() => {
      spinInterval = setInterval(() => {
        setChar(SLOT_CHARS[Math.floor(Math.random() * SLOT_CHARS.length)]);
      }, 55);
      stopTimeout = setTimeout(() => {
        clearInterval(spinInterval);
        setChar(target);
      }, spinDuration);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(stopTimeout);
      clearInterval(spinInterval);
    };
  }, []);

  return <span>{char}</span>;
}

function LogoMark() {
  const cellStyle = (bg) => ({
    background: bg,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Bebas Neue', 'Extenda', sans-serif",
    fontSize: '2.5rem',
    color: 'white',
    letterSpacing: '-0.01em',
    lineHeight: 1,
    userSelect: 'none',
  });

  return (
    <div style={{
      display: 'inline-grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 7,
      padding: 10,
      background: '#3e2e38',
      borderRadius: 20,
      width: 160,
      height: 160,
    }}>
      <div style={cellStyle('#2a5d71')}>
        <SlotChar target="T" startDelay={0} />
        <SlotChar target="A" startDelay={150} />
      </div>
      <div style={cellStyle('#f33f50')}>B</div>
      <div style={cellStyle('#8791be')}>
        <SlotChar target="S" startDelay={300} />
        <SlotChar target="E" startDelay={450} />
      </div>
      <div style={cellStyle('#f33f50')}>B</div>
    </div>
  );
}

export default function App() {
  const [activePhase, setActivePhase] = useState(0);
  const [showImpl, setShowImpl] = useState(false);
  const [activeCS, setActiveCS] = useState('all');
  const [activeActors, setActiveActors] = useState(new Set());
  const [expandedStep, setExpandedStep] = useState(null);
  const baseUrl = import.meta.env.BASE_URL;

  function toggleActor(code) {
    setActiveActors(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
      return next;
    });
  }

  function handleImplToggle() {
    if (showImpl) {
      setActiveCS('all');
      setActiveActors(new Set());
      setExpandedStep(null);
    }
    setShowImpl(v => !v);
  }

  function handleCSChange(key) {
    setActiveCS(key);
    setExpandedStep(null);
  }

  function handlePhaseChange(index) {
    setActivePhase(index);
    setExpandedStep(null);
  }

  const cs = CASE_STUDIES[activeCS];
  const implSet = new Set(cs.implements);

  function phaseCoverage(phaseIndex) {
    const steps = workflowData[phaseIndex].steps;
    return { impl: steps.filter(s => implSet.has(s.id)).length, total: steps.length };
  }

  return (
    <div className="min-h-screen bg-[#F2EDE6] text-slate-900">

      {/* ── Navbar — identical structure to HTML pages (shared.css) ── */}
      <nav className="navbar">
        <div className="nav-inner">
          <a className="brand" href={baseUrl}>TAB-SEB</a>
          <div className="nav-links">
            <a href={baseUrl} className="current">Workflow</a>
            <div className="nav-doc">
              <button className="nav-doc-trigger">External Resources <span className="arrow">▾</span></button>
              <div className="nav-doc-menu">
                <a href={`${baseUrl}external-resources.html#data-preparation`}>Data Preparation</a>
                <a href={`${baseUrl}external-resources.html#rdf-materialisation`}>RDF Materialisation</a>
                <a href={`${baseUrl}external-resources.html#publication`}>Data Publication</a>
                <a href={`${baseUrl}external-resources.html#quality`}>Quality &amp; Assessment</a>
                <a href={`${baseUrl}external-resources.html#blueprint`}>Workflow Blueprint</a>
                <a href={`${baseUrl}external-resources.html#publications`}>Publications</a>
                <a href={`${baseUrl}external-resources.html#vademecum`}>Vademecum</a>
                <a href={`${baseUrl}external-resources.html#thesis`}>Doctoral Thesis</a>
              </div>
            </div>
            <div className="nav-doc">
              <button className="nav-doc-trigger">Documentation <span className="arrow">▾</span></button>
              <div className="nav-doc-menu">
                <a href={`${baseUrl}future-development.html`}>Future Development</a>
                <a href={`${baseUrl}related-work.html`}>Related Work</a>
                <a href={`${baseUrl}implementations.html`}>Use Cases &amp; Implementations</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Page content ── */}
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

      {/* ── Header ── */}
      <header className="max-w-7xl mx-auto mb-6 sm:mb-8 text-center">
        <div className="flex justify-center mb-6">
          <LogoMark />
        </div>
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-normal uppercase tracking-[0.04em] leading-none text-[#543e4c] mb-4"
          style={{ fontFamily: "'Bebas Neue', 'Extenda', sans-serif", fontWeight: 100 }}
        >
          TABular Semantic Enhancement Blueprint
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-[#7d6a73] max-w-4xl mx-auto leading-relaxed">
          Interactive overview of the technical workflow for tabular data preparation, RDF materialisation, and dissemination.
        </p>
      </header>

      {/* ── Case Study toggle bar ── */}
      <div className="max-w-7xl mx-auto mb-5 sm:mb-6">
        <div className="bg-white border border-[rgba(26,26,26,0.1)] rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-[#ef9f27] shrink-0" />
              <span className="font-semibold text-[#543e4c] text-sm sm:text-base">Case Study View</span>
              <span className="text-xs text-[#7d6a73] hidden sm:inline">— overlay implementation data on the workflow</span>
            </div>
            <button
              onClick={handleImplToggle}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ef9f27] ${showImpl ? 'bg-[#ef9f27]' : 'bg-[#c4c9e0]'}`}
              role="switch"
              aria-checked={showImpl}
              aria-label="Toggle case study view"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${showImpl ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {showImpl && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              {/* Case study tabs */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#7d6a73] mb-2">Case Study</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CASE_STUDIES).map(([key, study]) => (
                    <button
                      key={key}
                      onClick={() => handleCSChange(key)}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                        activeCS === key
                          ? 'border-[#ef9f27] bg-[#fef8ec] text-[#7a4f00]'
                          : 'border-[rgba(84,62,76,0.2)] bg-white text-[#7d6a73] hover:border-[#b09aa8] hover:bg-[#f7f0f3]'
                      }`}
                    >
                      {study.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actor filters */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#7d6a73] mb-2">Filter by Actor Role</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(ACTORS).map(([code, actor]) => {
                    const on = activeActors.has(code);
                    return (
                      <button
                        key={code}
                        onClick={() => toggleActor(code)}
                        style={on ? { borderColor: actor.border, background: actor.bg, color: actor.textColor } : {}}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                          on ? '' : 'border-[rgba(84,62,76,0.2)] bg-[#f7f0f3] text-[#7d6a73] opacity-55 hover:opacity-80'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: actor.color }} />
                        {actor.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phase coverage */}
              {activeCS !== 'all' && (
                <div className="flex flex-wrap gap-2 items-center pt-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d6a73]">Coverage:</span>
                  {workflowData.map((_, i) => {
                    const { impl, total } = phaseCoverage(i);
                    return (
                      <span key={i} className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        impl === total ? 'bg-[#e8f3f7] text-[#1a3d4d] border-[#8ab8cc]' :
                        impl > 0      ? 'bg-[#fef8ec] text-[#7a4f00] border-[#f7d38a]' :
                                        'bg-[#f0eced] text-[#7d6a73] border-[#c9b8c0]'
                      }`}>
                        Ph.{i + 1}: {impl}/{total}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Main grid ── */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* Left: phase selector */}
        <div className="xl:col-span-4 space-y-4">
          <h2 className="text-sm sm:text-base font-semibold uppercase tracking-wider text-[#7d6a73] px-1">
            Workflow Phases
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {workflowData.map((phase, index) => {
              const { impl, total } = phaseCoverage(index);
              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => handlePhaseChange(index)}
                  className={`w-full text-left transition-all duration-300 border-l-4 p-4 sm:p-5 rounded-r-xl shadow-sm hover:translate-x-1 ${
                    activePhase === index
                      ? `${phase.color.replace('bg-', 'border-')} bg-white shadow-md`
                      : 'border-transparent bg-white/80 opacity-95 hover:opacity-100 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`p-2 rounded-lg text-white ${phase.color} shrink-0`}>
                      {phase.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-base sm:text-lg leading-snug ${activePhase === index ? 'text-[#543e4c]' : 'text-[#7d6a73]'}`}>
                        {phase.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#7d6a73] mt-1 uppercase font-medium">
                        {showImpl && activeCS !== 'all'
                          ? `${impl}/${total} steps implemented`
                          : `${total} subprocesses`}
                      </p>
                    </div>
                    {activePhase === index && (
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 sm:mt-6 p-4 border-2 border-dashed border-[#f7d38a] rounded-xl bg-[#fef8ec] flex items-start gap-3">
            <RefreshCcw className="text-[#ef9f27] w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 animate-spin-slow mt-0.5" />
            <p className="text-sm sm:text-base text-[#7a4f00] italic leading-relaxed">
              Feedback from Phase 4 recursively informs the preceding phases for continuous refinement.
            </p>
          </div>
        </div>

        {/* Right: step detail panel */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-2xl shadow-xl border border-[rgba(84,62,76,0.12)] overflow-hidden min-h-0 xl:min-h-[700px] flex flex-col">
            <div className={`p-5 sm:p-6 text-white flex items-center gap-3 ${workflowData[activePhase].color}`}>
              {workflowData[activePhase].icon}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                {workflowData[activePhase].title}
              </h2>
            </div>

            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                {workflowData[activePhase].steps.map((step, idx) => {
                  const stepImpl      = !showImpl || implSet.has(step.id);
                  const stepDetail    = showImpl && activeCS !== 'all' ? cs.details?.[step.id] : null;
                  const stepActors    = stepDetail?.actors || step.actors;
                  const actorMatch    = !showImpl || activeActors.size === 0 || stepActors.some(a => activeActors.has(a));
                  const isDimmed      = showImpl && (!stepImpl || !actorMatch);
                  const isExpanded    = expandedStep === step.id;
                  // When a specific CS is active and this step has details, impl info becomes primary
                  const implIsPrimary = showImpl && stepImpl && activeCS !== 'all' && !!stepDetail;

                  return (
                    <div
                      key={idx}
                      className={`p-4 sm:p-5 rounded-xl border transition-all group ${
                        isDimmed
                          ? 'border-[rgba(84,62,76,0.08)] bg-[#f7f0f3] opacity-35 pointer-events-none'
                          : implIsPrimary
                            ? 'border-[#f7d38a] bg-[#fef8ec]/40'
                            : 'border-[rgba(84,62,76,0.1)] bg-[#f7f0f3] hover:bg-white hover:border-[#8ab8cc] hover:shadow-md'
                      }`}
                    >
                      {/* Step heading row */}
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <h4 className={`font-bold flex items-center gap-2 text-base sm:text-lg leading-snug ${implIsPrimary ? 'text-[#7a4f00]' : 'text-[#543e4c]'}`}>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${implIsPrimary ? 'bg-[#ef9f27]' : 'bg-[#b09aa8] group-hover:bg-[#2a5d71]'}`} />
                          <span>{step.sub}</span>
                        </h4>
                        {showImpl && (
                          <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
                            stepImpl
                              ? 'bg-[#e8f3f7] text-[#1a3d4d] border-[#8ab8cc]'
                              : 'bg-[#f0eced] text-[#7d6a73] border-[#c9b8c0]'
                          }`}>
                            {stepImpl ? '✓ Applied' : '✕ Not applied'}
                          </span>
                        )}
                      </div>

                      {implIsPrimary ? (
                        /* ── IMPL-PRIMARY MODE: implementation info is the main body ── */
                        <div className="space-y-3">

                          {/* Actors row */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ef9f27] mr-1">Actors:</span>
                            {stepActors.map(a => (
                              <span
                                key={a}
                                className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border"
                                style={{ background: ACTORS[a].bg, borderColor: ACTORS[a].border, color: ACTORS[a].textColor }}
                              >
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ACTORS[a].color }} />
                                {ACTORS[a].name}
                              </span>
                            ))}
                          </div>

                          {/* How it was addressed */}
                          <div className="bg-white rounded-xl border border-[#f0dda0] p-3 sm:p-4">
                            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#ef9f27] mb-1.5">How it was addressed</p>
                            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{stepDetail.how}</p>
                          </div>

                          {/* Tools & artefacts */}
                          <div className="bg-white rounded-xl border border-[#f0dda0] p-3 sm:p-4">
                            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#ef9f27] mb-1.5">Tools &amp; artefacts</p>
                            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{stepDetail.tools}</p>
                          </div>

                          {/* Resource breadcrumbs */}
                          {STEP_LINKS[activeCS]?.[step.id] && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ef9f27] shrink-0">Resources:</span>
                              {STEP_LINKS[activeCS][step.id].map((link, i) => (
                                <a
                                  key={i}
                                  href={`${baseUrl}external-resources.html#${link.section}`}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7a4f00] bg-white border border-[#f7d38a] rounded-full px-2.5 py-0.5 hover:bg-[#fef8ec] hover:border-[#ef9f27] no-underline transition-colors"
                                >
                                  <span className="text-[#ef9f27] text-[9px]">↗</span>
                                  {link.label}
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Collapsible blueprint details */}
                          <button
                            onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-[#7d6a73] hover:text-[#543e4c] transition-colors pt-1"
                          >
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            {isExpanded ? 'Hide' : 'View'} blueprint details
                          </button>

                          {isExpanded && (
                            <div className="rounded-xl border border-[rgba(84,62,76,0.12)] bg-[#f7f0f3] p-3 sm:p-4 space-y-3">
                              <p className="text-sm text-[#7d6a73] leading-relaxed italic">{step.desc}</p>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                                {step.inputs && (
                                  <div>
                                    <span className="text-xs font-bold uppercase text-[#2a5d71] flex items-center gap-1 mb-2 tracking-wide">
                                      <Settings className="w-3.5 h-3.5" /> Technical Inputs
                                    </span>
                                    <ul className="text-sm space-y-1.5">
                                      {step.inputs.map((inp, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[#543e4c] leading-relaxed">
                                          <span className="text-[#8ab8cc] shrink-0 mt-0.5">•</span>
                                          <span>{inp}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {step.ops && (
                                  <div>
                                    <span className="text-xs font-bold uppercase text-[#8791be] flex items-center gap-1 mb-2 tracking-wide">
                                      <Activity className="w-3.5 h-3.5" /> Core Operations
                                    </span>
                                    <ul className="text-sm space-y-1.5">
                                      {step.ops.map((op, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[#543e4c] leading-relaxed">
                                          <span className="text-[#c4c9e0] shrink-0 mt-0.5">•</span>
                                          <span>{op}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                <div className={!(step.inputs || step.ops) ? 'lg:col-span-2' : ''}>
                                  <span className="text-xs font-bold uppercase text-[#ff8541] flex items-center gap-1 mb-2 tracking-wide">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Expected Outputs
                                  </span>
                                  <ul className="text-sm space-y-1.5">
                                    {step.outputs.map((out, i) => (
                                      <li key={i} className="flex items-start gap-2 text-[#543e4c] font-medium leading-relaxed">
                                        <span className="text-[#ff8541] shrink-0 mt-0.5">✓</span>
                                        <span>{out}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* ── NORMAL / FULL-BLUEPRINT MODE: skeleton is the main body ── */
                        <div>
                          <p className="text-base sm:text-lg text-[#7d6a73] mb-4 leading-relaxed">
                            {step.desc}
                          </p>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                            {step.inputs && (
                              <div className="min-w-0">
                                <span className="text-xs sm:text-sm font-bold uppercase text-[#2a5d71] flex items-center gap-1 mb-2 tracking-wide">
                                  <Settings className="w-4 h-4" /> Technical Inputs
                                </span>
                                <ul className="text-sm sm:text-base space-y-1.5">
                                  {step.inputs.map((inp, i) => (
                                    <li key={i} className="flex items-start gap-2 text-[#543e4c] leading-relaxed">
                                      <span className="text-[#8ab8cc] shrink-0 mt-0.5">•</span>
                                      <span>{inp}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {step.ops && (
                              <div className="min-w-0">
                                <span className="text-xs sm:text-sm font-bold uppercase text-[#8791be] flex items-center gap-1 mb-2 tracking-wide">
                                  <Activity className="w-4 h-4" /> Core Operations
                                </span>
                                <ul className="text-sm sm:text-base space-y-1.5">
                                  {step.ops.map((op, i) => (
                                    <li key={i} className="flex items-start gap-2 text-[#543e4c] leading-relaxed">
                                      <span className="text-[#c4c9e0] shrink-0 mt-0.5">•</span>
                                      <span>{op}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className={!(step.inputs || step.ops) ? 'lg:col-span-2 min-w-0' : 'min-w-0'}>
                              <span className="text-xs sm:text-sm font-bold uppercase text-[#ff8541] flex items-center gap-1 mb-2 tracking-wide">
                                <CheckCircle2 className="w-4 h-4" /> Expected Outputs
                              </span>
                              <ul className="text-sm sm:text-base space-y-1.5">
                                {step.outputs.map((out, i) => (
                                  <li key={i} className="flex items-start gap-2 text-[#543e4c] font-medium leading-relaxed">
                                    <span className="text-[#ff8541] shrink-0 mt-0.5">✓</span>
                                    <span>{out}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Actor pills when impl mode is on (full blueprint or no per-step details) */}
                          {showImpl && stepImpl && (
                            <div className="mt-4 pt-4 border-t border-[rgba(84,62,76,0.1)] flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d6a73]">Actors:</span>
                              {stepActors.map(a => (
                                <span
                                  key={a}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full border"
                                  style={{ background: ACTORS[a].bg, borderColor: ACTORS[a].border, color: ACTORS[a].textColor }}
                                >
                                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ACTORS[a].color }} />
                                  {ACTORS[a].name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-[#f7f0f3] border-t border-[rgba(84,62,76,0.1)] flex items-start gap-2 text-xs sm:text-sm text-[#7d6a73] italic">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {showImpl && activeCS !== 'all'
                  ? `Showing ${CASE_STUDIES[activeCS].name} implementation. Applied steps display how each sub-process was addressed; use "View blueprint details" to see the abstract specification.`
                  : 'Select a phase on the left to explore its technical details.'}
              </span>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      ` }} />
      </div>
    </div>
  );
}
