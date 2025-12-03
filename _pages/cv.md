---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======
- **HKUST**, BEng in Computer Science, Sep 2022–Jun 2026 (expected)  
  CGA: **4.126/4.30** (rank **2/145**); Dean’s List every term. TOEFL iBT: **108**.  
  Selected coursework: AI, ML, Large-Scale ML for Foundation Models, Big Data Mining/Management, Data Visualization, OOP & Data Structures, Algorithms, OS, Software Engineering, Computer Organization, Linear Algebra, Probability and Statistics.
- **Cornell University**, Visiting Research Student, Database Systems Lab, Jun–Aug 2025.

Research Experience
======
- **HKUST LONG Group** — Final Year Thesis (advisor: Prof. Long Chen), Sep 2025–Present  
  Inference-time classifier-free guidance for autoregressive LMs; decoding/steering to reduce hallucinations; long-context evaluation harnesses and ablations.
- **Cornell University — Database Systems Lab** — Research Intern (advisor: Prof. Sainyam Galhotra), Jun–Nov 2025  
  Auto Pruned Retriever (VLDB submission, under review); token/latency-efficient RAG via reasoning subgraphs; edge-space retrieval with top-k frontier sentence encodings and top-m rerank; scalable causal discovery for SEEKER.
- **HKUST Accounting Department** — Undergraduate Research Assistant (advisor: Prof. Yue Zheng), Aug–Oct 2024  
  OCR→DB pipeline for 657 noisy scans; integrated Tesseract with heuristic post-processing; extracted file–keyword–text triplets; complexity cut from O(n^4) to O(n^2) with ~20× speedup.
- **HKUST NLP Group** — Undergraduate Research Assistant (advisor: Prof. Junxian He), Jan–May 2024  
  “Long as a Tale” long-video pipeline: taxonomy → retrieval → three-stage filtering; curated ~4.5K hour-long videos; subtitle-to-description generation; long-context training/eval up to 224K context with RoPE θ=10^9; automated V-NIAH, Video-MME, MLVU, LVBench; reported +6.0 (Video-MME long), +5.8 (medium), +0.7 (short), +3.4 (MLVU), +4.6 (LVBench).

Teaching Experience
======
- **COMP2211 Exploring Artificial Intelligence (HKUST)** — Undergraduate TA, Jul–Aug 2024 & Jul–Aug 2025  
  Designed labs with notes, instructions, solutions, and autograders; ran office hours (~200 students).
- **COMP1023 Introduction to Python (HKUST)** — Undergraduate TA, Sep–Dec 2024  
  Built beginner-friendly labs with interactive UIs and autograders; converted coding tasks into small projects (~800 students/term).
- **COMP2012 OOP & Data Structures (HKUST)** — Undergraduate TA, Jan–May 2024  
  Led lab sections (~90 students/session), demoed data-structure implementations, live Q&A.

Projects & Training
======
- **Independent Quantitative Research** — Jul 2024–Sep 2025  
  Built equity data stack (yfinance → SQLite → ClickHouse); factor mining/backtesting in Python + PyO3/Rust; tested equal-weight, market-neutral portfolios with standardized cleaning/universe rules.
- **LSE Summer School** — Fixed Income Securities & Debt Markets, Jul–Aug 2023.
- **Fudan University Winter School** — Probability, Statistics & Risk Management, Dec 2022–Jan 2023.

Honors & Awards
======
- HKSAR Government Scholarship (2024–2026)
- Asia-Pacific Economic Cooperation Scholarship (2024–2026)
- Cornell IRIS Summer Scholarship (2025)
- HKUST SENG International Summer Research Sponsorship (2025)
- HKUST UROP Support Grant (2024)
- Extra Mile Charity Foundation Scholarship (2023–2024)
- University Scholarship Scheme for Continuing UG Students (2023–2024)
- HKUST Study Abroad Grant (2023)
- HKSAR Government Scholarship Fund — Talent Development Scholarship (2023–2024)
- Dean’s List (every semester, 2022–2025)

Skills & Interests
======
- **Programming:** Python, Java, C/C++, SQL, Bash, HTML, LaTeX  
- **Libraries/Tools:** PyTorch, Hugging Face, Pandas, OpenCV, Docker, Git, Linux  
- **Research interests:** Inference-time control of LMs; efficient & multimodal AI; long-context modeling; data mining  
- **Interests:** Piano (Level 10), music, hiking/outdoors, cooking

Publications
======
<ul>{% for post in site.publications reversed %}
  {% include archive-single-cv.html %}
{% endfor %}</ul>

Talks
======
<ul>{% for post in site.talks reversed %}
  {% include archive-single-talk-cv.html  %}
{% endfor %}</ul>

Teaching (detailed)
======
<ul>{% for post in site.teaching reversed %}
  {% include archive-single-cv.html %}
{% endfor %}</ul>
