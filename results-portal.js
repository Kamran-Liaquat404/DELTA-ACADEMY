/**
 * DELTA English Language & Computer Academy
 * Online Examination Result Portal & Marksheet Generator
 * 
 * Supports directly embedded data in results.html (window.STUDENT_RESULTS_DATA)
 * as well as results.json or offline fallback data.
 */

(function () {
  'use strict';

  // Fallback data in case of offline/network issues
  const FALLBACK_RESULTS = [
    {
      rollNo: "1257310",
      name: "Ayesha",
      fatherName: "Mohd Ayoub",
      class: "Class 6th Cadet",
      mcqsMarks: 40,
      diagramMarks: 4,
      shortQuestionsMarks: 28.8,
      totalMarks: 100,
      obtainedMarks: 64.8,
      percentage: 64.8,
      grade: "B+",
      status: "PASS",
      mathMarks: 34,
      mathTotal: 50,
      mathPercentage: 68.0,
      mathStatus: "PASS",
      date: "Tue, Sep 15, 2026",
      remarks: "Qualified in Entry Test & Mathematics"
    },
    {
      rollNo: "1257320",
      name: "Adeel",
      fatherName: "Ihtram ul Haq",
      class: "Class 6th Cadet",
      mcqsMarks: 37,
      diagramMarks: 4,
      shortQuestionsMarks: 16.5,
      totalMarks: 100,
      obtainedMarks: 57.5,
      percentage: 57.5,
      grade: "B",
      status: "PASS",
      mathMarks: 32,
      mathTotal: 50,
      mathPercentage: 64.0,
      mathStatus: "PASS",
      date: "Tue, Sep 15, 2026",
      remarks: "Qualified in Entry Test & Mathematics"
    },
    {
      rollNo: "1257330",
      name: "Mahaz",
      fatherName: "Javed Ahmed",
      class: "Class 6th Cadet",
      mcqsMarks: 17,
      diagramMarks: 6,
      shortQuestionsMarks: 1,
      totalMarks: 100,
      obtainedMarks: 24,
      percentage: 24,
      grade: "D",
      status: "NEEDS IMPROVEMENT",
      mathMarks: 37,
      mathTotal: 50,
      mathPercentage: 74.0,
      mathStatus: "PASS",
      date: "Tue, Sep 15, 2026",
      remarks: "1st in Mathematics. Needs improvement in general paper."
    },
    {
      rollNo: "1002231",
      name: "Iqra",
      fatherName: "Dr. Hidayat Ullah",
      class: "Class 7th Cadet",
      mcqsMarks: 11,
      diagramMarks: 10,
      shortQuestionsMarks: 8.5,
      totalMarks: 100,
      obtainedMarks: 29.5,
      percentage: 29.5,
      grade: "D",
      status: "NEEDS IMPROVEMENT",
      mathMarks: 10,
      mathTotal: 40,
      mathPercentage: 25.0,
      mathStatus: "NEEDS IMPROVEMENT",
      date: "Tue, Sep 15, 2026",
      remarks: "Needs dedicated improvement across subjects."
    },
    {
      rollNo: "1002232",
      name: "Sidra",
      fatherName: "Dr. Hidayat Ullah",
      class: "Class 7th Cadet",
      mcqsMarks: 9,
      diagramMarks: 14,
      shortQuestionsMarks: 6.5,
      totalMarks: 100,
      obtainedMarks: 29.5,
      percentage: 29.5,
      grade: "D",
      status: "NEEDS IMPROVEMENT",
      mathMarks: 15,
      mathTotal: 40,
      mathPercentage: 37.5,
      mathStatus: "NEEDS IMPROVEMENT",
      date: "Tue, Sep 15, 2026",
      remarks: "Needs improvement across subjects."
    },
    {
      rollNo: "1002233",
      name: "Bibi Maryam",
      fatherName: "Mohd Ayoub",
      class: "Class 7th Cadet",
      mcqsMarks: 23,
      diagramMarks: 13,
      shortQuestionsMarks: 19,
      totalMarks: 100,
      obtainedMarks: 55,
      percentage: 55,
      grade: "B",
      status: "PASS",
      mathMarks: 36,
      mathTotal: 40,
      mathPercentage: 90.0,
      mathStatus: "PASS",
      date: "Tue, Sep 15, 2026",
      remarks: "1st in Mathematics (90%) and Passed Entry Test."
    }
  ];

  let cachedResults = null;

  async function fetchResultsData() {
    // 1. First priority: Check if data is defined directly inside results.html
    if (window.STUDENT_RESULTS_DATA && Array.isArray(window.STUDENT_RESULTS_DATA) && window.STUDENT_RESULTS_DATA.length > 0) {
      cachedResults = window.STUDENT_RESULTS_DATA;
      return cachedResults;
    }

    // 2. Second priority: Cached data in memory
    if (cachedResults) return cachedResults;

    // 3. Third priority: Fetch from results.json
    try {
      const res = await fetch('results.json');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          cachedResults = data;
          return cachedResults;
        }
      }
    } catch (err) {
      console.warn('Could not fetch results.json, using fallback data:', err);
    }

    cachedResults = FALLBACK_RESULTS;
    return cachedResults;
  }

  // Render or sync the Mathematics Result rankings from the active data
  function syncMathBoards(resultsList) {
    const container7th = document.getElementById('math-rank-list-7th');
    const container6th = document.getElementById('math-rank-list-6th');

    if (container7th) {
      const students7th = resultsList
        .filter((s) => String(s.class).includes('7th') && s.mathMarks !== undefined)
        .sort((a, b) => Number(b.mathMarks) - Number(a.mathMarks));

      if (students7th.length > 0) {
        container7th.innerHTML = students7th.map((s, index) => {
          const rank = index + 1;
          const posClass = rank === 1 ? 'math-pos-1' : rank === 2 ? 'math-pos-2' : rank === 3 ? 'math-pos-3' : 'math-pos-other';
          const total = s.mathTotal || 40;
          const pct = Number(s.mathPercentage || ((s.mathMarks / total) * 100)).toFixed(1);
          return `
            <div class="math-rank-item">
              <div class="math-rank-left">
                <span class="math-pos-badge ${posClass}">${rank}</span>
                <span class="math-student-name">${escapeHtml(s.name)}</span>
              </div>
              <div class="math-score-right">
                <span class="math-obtained-val">${s.mathMarks}</span>
                <span class="math-total-val">/ ${total}</span>
                <span class="math-pct-badge">${pct}%</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    if (container6th) {
      const students6th = resultsList
        .filter((s) => String(s.class).includes('6th') && s.mathMarks !== undefined)
        .sort((a, b) => Number(b.mathMarks) - Number(a.mathMarks));

      if (students6th.length > 0) {
        container6th.innerHTML = students6th.map((s, index) => {
          const rank = index + 1;
          const posClass = rank === 1 ? 'math-pos-1' : rank === 2 ? 'math-pos-2' : rank === 3 ? 'math-pos-3' : 'math-pos-other';
          const total = s.mathTotal || 50;
          const pct = Number(s.mathPercentage || ((s.mathMarks / total) * 100)).toFixed(1);
          return `
            <div class="math-rank-item">
              <div class="math-rank-left">
                <span class="math-pos-badge ${posClass}">${rank}</span>
                <span class="math-student-name">${escapeHtml(s.name)}</span>
              </div>
              <div class="math-score-right">
                <span class="math-obtained-val">${s.mathMarks}</span>
                <span class="math-total-val">/ ${total}</span>
                <span class="math-pct-badge">${pct}%</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  async function initPortal() {
    // Sync math boards on initial load
    const initialData = await fetchResultsData();
    syncMathBoards(initialData);

    const form = document.getElementById('result-search-form');
    const input = document.getElementById('roll-input');
    const cardContainer = document.getElementById('result-card-container');

    if (!form || !input || !cardContainer) return;

    // Search handler
    async function handleSearch(queryRoll) {
      const roll = (queryRoll || input.value || '').trim();
      if (!roll) {
        showStatus('Please enter your Roll Number to view result.', 'warning');
        input.focus();
        return;
      }

      showStatus('Searching result...', 'info');
      cardContainer.style.display = 'none';

      const resultsList = await fetchResultsData();
      const student = resultsList.find(
        (s) => String(s.rollNo).trim().toLowerCase() === roll.toLowerCase()
      );

      if (!student) {
        showStatus(
          `No result found for Roll Number <strong>${escapeHtml(roll)}</strong>. Please check your roll number and try again.`,
          'error'
        );
        return;
      }

      // Found student! Render clean result card
      hideStatus();
      renderResultCard(student, cardContainer);
      cardContainer.style.display = 'block';

      // Update URL query param smoothly
      try {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('roll', roll);
        window.history.replaceState({ roll }, '', newUrl.toString());
      } catch (e) {
        // Safe fail
      }

      // Scroll smoothly to the result card
      setTimeout(() => {
        cardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

    // Form submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSearch();
    });

    // Handle initial URL param ?roll=1257310 if present
    const urlParams = new URLSearchParams(window.location.search);
    const initialRoll = urlParams.get('roll');
    if (initialRoll) {
      input.value = initialRoll;
      handleSearch(initialRoll);
    }
  }

  function showStatus(message, type) {
    const statusMsg = document.getElementById('portal-status-message');
    if (!statusMsg) return;
    statusMsg.className = `portal-status portal-status-${type}`;
    statusMsg.innerHTML = message;
    statusMsg.style.display = 'block';
  }

  function hideStatus() {
    const statusMsg = document.getElementById('portal-status-message');
    if (!statusMsg) return;
    statusMsg.style.display = 'none';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderResultCard(s, container) {
    const isPass = (s.status || '').toUpperCase() === 'PASS';
    const statusLabel = isPass ? 'PASS' : 'NEEDS IMPROVEMENT';
    const statusClass = isPass ? 'clean-status-pass' : 'clean-status-fail';
    const percentage = Number(s.percentage || ((s.obtainedMarks / s.totalMarks) * 100)).toFixed(1);
    const resultDate = s.date || 'Tue, Sep 15, 2026';

    // Math treated as a separate subject
    const mathTotal = s.mathTotal || (String(s.class).includes('6th') ? 50 : 40);
    const mathPct = Number(s.mathPercentage || ((s.mathMarks / mathTotal) * 100)).toFixed(1);
    const isMathPass = s.mathMarks >= (mathTotal * 0.4);

    container.innerHTML = `
      <div class="clean-result-card" id="printable-result-sheet">
        <!-- Header -->
        <div class="clean-result-header">
          <div class="clean-result-brand">
            <img src="assets/images/delta-logo.png" alt="DELTA Logo" class="clean-result-logo" />
            <div>
              <h3 class="clean-academy-name">DELTA English Language &amp; Computer Academy</h3>
              <p class="clean-academy-sub">Kharan, Balochistan</p>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem;">
            <div class="clean-result-tag">
              <span>Cadet College Entry Test &bull; ${escapeHtml(s.class)}</span>
            </div>
            <div class="clean-date-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>Date: ${escapeHtml(resultDate)}</span>
            </div>
          </div>
        </div>

        <div class="clean-result-divider"></div>

        <!-- Student Info Grid -->
        <div class="clean-student-grid">
          <div class="clean-info-col">
            <span class="clean-info-label">Student Name</span>
            <span class="clean-info-value name-bold">${escapeHtml(s.name)}</span>
          </div>
          <div class="clean-info-col">
            <span class="clean-info-label">Father's Name</span>
            <span class="clean-info-value">${escapeHtml(s.fatherName)}</span>
          </div>
          <div class="clean-info-col">
            <span class="clean-info-label">Roll Number</span>
            <span class="clean-info-value roll-bold">${escapeHtml(s.rollNo)}</span>
          </div>
          <div class="clean-info-col">
            <span class="clean-info-label">Class</span>
            <span class="clean-info-value">${escapeHtml(s.class)}</span>
          </div>
          <div class="clean-info-col">
            <span class="clean-info-label">Result Date</span>
            <span class="clean-info-value date-bold">${escapeHtml(resultDate)}</span>
          </div>
        </div>

        <!-- Entry Test Marks Breakdown Table (Total 100) -->
        <div class="clean-table-wrap">
          <table class="clean-marks-table">
            <thead>
              <tr>
                <th style="text-align: left;">Entry Test Paper Components</th>
                <th style="text-align: center; width: 25%;">Total Marks</th>
                <th style="text-align: center; width: 25%;">Obtained Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: left;">Multiple Choice Questions (MCQs)</td>
                <td style="text-align: center;">40</td>
                <td style="text-align: center;" class="score-highlight">${s.mcqsMarks}</td>
              </tr>
              <tr>
                <td style="text-align: left;">Diagram Questions</td>
                <td style="text-align: center;">10</td>
                <td style="text-align: center;" class="score-highlight">${s.diagramMarks}</td>
              </tr>
              <tr>
                <td style="text-align: left;">Short Questions</td>
                <td style="text-align: center;">50</td>
                <td style="text-align: center;" class="score-highlight">${s.shortQuestionsMarks}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="clean-total-row">
                <td style="text-align: left; font-weight: 700;">Entry Test Total</td>
                <td style="text-align: center; font-weight: 700;">${s.totalMarks}</td>
                <td style="text-align: center; font-weight: 800;" class="total-score-highlight">${s.obtainedMarks}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Dedicated Subject Evaluation: Mathematics (Treated as a Separate Subject) -->
        <div class="clean-math-subject-card">
          <div class="clean-math-subject-header">
            <div class="math-subject-title-wrap">
              <span class="math-subject-badge">Subject Evaluation</span>
              <h4 class="math-subject-name">Mathematics (Subject Paper)</h4>
            </div>
            <span class="math-subject-status-pill ${isMathPass ? 'clean-status-pass' : 'clean-status-fail'}">
              ${isMathPass ? 'PASS' : 'NEEDS IMPROVEMENT'}
            </span>
          </div>
          <div class="clean-math-subject-grid">
            <div class="math-sub-col">
              <span class="sub-col-label">Subject Total</span>
              <span class="sub-col-value">${mathTotal} Marks</span>
            </div>
            <div class="math-sub-col highlight">
              <span class="sub-col-label">Obtained in Math</span>
              <span class="sub-col-value math-color">${s.mathMarks}</span>
            </div>
            <div class="math-sub-col">
              <span class="sub-col-label">Subject %</span>
              <span class="sub-col-value">${mathPct}%</span>
            </div>
            <div class="math-sub-col">
              <span class="sub-col-label">Performance</span>
              <span class="sub-col-value" style="font-size: 0.95rem; font-weight: 700; color: ${isMathPass ? '#047857' : '#B91C1C'};">
                ${isMathPass ? 'Qualified' : 'Needs Practice'}
              </span>
            </div>
          </div>
        </div>

        <!-- Bottom Total Score Area (Entry Test Total: 100 Marks, Math not merged here) -->
        <div class="clean-summary-strip">
          <div class="clean-summary-item">
            <span class="summary-lbl">Total Marks</span>
            <span class="summary-val">${s.totalMarks}</span>
          </div>
          <div class="clean-summary-item highlight">
            <span class="summary-lbl">Obtained Marks</span>
            <span class="summary-val">${s.obtainedMarks}</span>
          </div>
          <div class="clean-summary-item">
            <span class="summary-lbl">Percentage</span>
            <span class="summary-val">${percentage}%</span>
          </div>
          <div class="clean-summary-item">
            <span class="summary-lbl">Grade</span>
            <span class="summary-val">${escapeHtml(s.grade)}</span>
          </div>
          <div class="clean-summary-item">
            <span class="summary-lbl">Entry Test Status</span>
            <span class="clean-status-pill ${statusClass}">${statusLabel}</span>
          </div>
        </div>

        <!-- Simple Verification Footer with Date -->
        <div class="clean-result-footer">
          <span>Official computerized result issued by DELTA English Language &amp; Computer Academy, Kharan &bull; Date: <strong>${escapeHtml(resultDate)}</strong></span>
        </div>

        <!-- Clean Action Buttons -->
        <div class="clean-result-actions no-print">
          <button type="button" class="btn btn-clean-print" onclick="window.print()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span>Print Result</span>
          </button>
          <button type="button" class="btn btn-clean-reset" id="btn-clean-reset">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search Another</span>
          </button>
        </div>
      </div>
    `;

    // Attach "Search Another" reset button
    const btnReset = document.getElementById('btn-clean-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        const input = document.getElementById('roll-input');
        if (input) {
          input.value = '';
          input.focus();
        }
        const searchPortal = document.getElementById('search-portal');
        if (searchPortal) {
          searchPortal.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortal);
  } else {
    initPortal();
  }
})();
