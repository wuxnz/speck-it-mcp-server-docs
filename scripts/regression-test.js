/**
 * Regression Test and Metrics Collection Script
 *
 * This script runs a comprehensive regression test suite and collects performance metrics.
 * It validates that all requirements are still met and collects data for performance analysis.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const REPORT_DIR = path.join(process.cwd(), 'reports');
const REGRESSION_REPORT_PATH = path.join(REPORT_DIR, 'regression-report.json');
const METRICS_REPORT_PATH = path.join(REPORT_DIR, 'performance-metrics.json');

// Performance goals
const PERFORMANCE_GOALS = {
  // Test coverage goals
  totalCoverage: 80, // Minimum overall coverage percentage
  functionCoverage: 75, // Minimum function coverage percentage
  branchCoverage: 70, // Minimum branch coverage percentage
  lineCoverage: 80, // Minimum line coverage percentage

  // Build performance goals
  buildTime: 60000, // Maximum build time in milliseconds (60 seconds)
  bundleSize: 5242880, // Maximum bundle size in bytes (5MB)

  // Test performance goals
  testTime: 30000, // Maximum test time in milliseconds (30 seconds)
  testMemoryUsage: 512 * 1024 * 1024, // Maximum memory usage in bytes (512MB)

  // Lint performance goals
  lintTime: 30000, // Maximum lint time in milliseconds (30 seconds)
  maxWarnings: 10, // Maximum number of warnings
  maxErrors: 0, // Maximum number of errors

  // Type checking performance goals
  typeCheckTime: 30000, // Maximum type check time in milliseconds (30 seconds)
  maxTypeErrors: 0, // Maximum number of type errors
};

// Ensure reports directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

// Utility function to run a command and return timing information
function runCommand(command, options = {}) {
  const startTime = Date.now();
  const startMemory = process.memoryUsage();

  try {
    console.log(`Running: ${command}`);
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      ...options,
    });

    const endTime = Date.now();
    const endMemory = process.memoryUsage();

    return {
      success: true,
      output: result,
      duration: endTime - startTime,
      memoryUsage: {
        rss: endMemory.rss - startMemory.rss,
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      },
    };
  } catch (error) {
    const endTime = Date.now();
    const endMemory = process.memoryUsage();

    return {
      success: false,
      error: error.message,
      output: error.stdout,
      duration: endTime - startTime,
      memoryUsage: {
        rss: endMemory.rss - startMemory.rss,
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      },
    };
  }
}

// Function to run tests and collect coverage metrics
function runTests() {
  console.log('Running test suite with coverage...');

  const testResult = runCommand('pnpm test:coverage', {
    env: { ...process.env, CI: 'true' },
  });

  // Parse coverage from jest output
  let coverage = {
    total: 0,
    functions: 0,
    branches: 0,
    lines: 0,
    statements: 0,
  };

  if (testResult.success) {
    try {
      const coverageSummary = testResult.output.match(
        /All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/
      );
      if (coverageSummary) {
        coverage = {
          total: parseFloat(coverageSummary[1]),
          functions: parseFloat(coverageSummary[2]),
          branches: parseFloat(coverageSummary[3]),
          lines: parseFloat(coverageSummary[4]),
          statements: parseFloat(coverageSummary[5]),
        };
      }
    } catch (e) {
      console.warn('Could not parse coverage summary:', e.message);
    }
  }

  return {
    ...testResult,
    coverage,
  };
}

// Function to run build and collect performance metrics
function runBuild() {
  console.log('Running production build...');

  const buildResult = runCommand('pnpm build');

  // Check bundle size if build was successful
  let bundleSize = 0;
  if (buildResult.success) {
    try {
      const outDir = path.join(process.cwd(), '.next');
      if (fs.existsSync(outDir)) {
        const getDirectorySize = (dirPath) => {
          let totalSize = 0;
          const files = fs.readdirSync(dirPath);

          for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
              totalSize += getDirectorySize(filePath);
            } else {
              totalSize += stat.size;
            }
          }

          return totalSize;
        };

        bundleSize = getDirectorySize(outDir);
      }
    } catch (e) {
      console.warn('Could not calculate bundle size:', e.message);
    }
  }

  return {
    ...buildResult,
    bundleSize,
  };
}

// Function to run linting and collect metrics
function runLint() {
  console.log('Running ESLint...');

  const lintResult = runCommand('pnpm lint --format=json');

  let warnings = 0;
  let errors = 0;

  if (lintResult.success) {
    try {
      const lintReport = JSON.parse(lintResult.output);
      if (Array.isArray(lintReport)) {
        warnings = lintReport.filter((result) => result.severity === 1).length;
        errors = lintReport.filter((result) => result.severity === 2).length;
      }
    } catch (e) {
      console.warn('Could not parse lint report:', e.message);
    }
  }

  return {
    ...lintResult,
    warnings,
    errors,
  };
}

// Function to run type checking and collect metrics
function runTypeCheck() {
  console.log('Running TypeScript type checking...');

  const typeCheckResult = runCommand('pnpm type-check');

  let typeErrors = 0;

  if (!typeCheckResult.success) {
    try {
      // Count TypeScript errors
      const errorLines = typeCheckResult.output
        .split('\n')
        .filter((line) => line.includes('error TS'));
      typeErrors = errorLines.length;
    } catch (e) {
      console.warn('Could not parse type check output:', e.message);
    }
  }

  return {
    ...typeCheckResult,
    typeErrors,
  };
}

// Function to run contract tests and collect metrics
function runContractTests() {
  console.log('Running contract tests...');

  const contractTestResult = runCommand('pnpm test tests/contract');

  let passedTests = 0;
  let totalTests = 0;

  if (contractTestResult.success) {
    try {
      // Parse Jest output to count tests
      const testResults = contractTestResult.output.match(
        /Tests:\s+(\d+)\s+passed,\s+(\d+)\s+failed/
      );
      if (testResults) {
        passedTests = parseInt(testResults[1]);
        totalTests = parseInt(testResults[1]) + parseInt(testResults[2]);
      }
    } catch (e) {
      console.warn('Could not parse contract test results:', e.message);
    }
  }

  return {
    ...contractTestResult,
    passedTests,
    totalTests,
  };
}

// Function to run integration tests and collect metrics
function runIntegrationTests() {
  console.log('Running integration tests...');

  const integrationTestResult = runCommand('pnpm test tests/integration');

  let passedTests = 0;
  let totalTests = 0;

  if (integrationTestResult.success) {
    try {
      // Parse Jest output to count tests
      const testResults = integrationTestResult.output.match(
        /Tests:\s+(\d+)\s+passed,\s+(\d+)\s+failed/
      );
      if (testResults) {
        passedTests = parseInt(testResults[1]);
        totalTests = parseInt(testResults[1]) + parseInt(testResults[2]);
      }
    } catch (e) {
      console.warn('Could not parse integration test results:', e.message);
    }
  }

  return {
    ...integrationTestResult,
    passedTests,
    totalTests,
  };
}

// Function to run unit tests and collect metrics
function runUnitTests() {
  console.log('Running unit tests...');

  const unitTestResult = runCommand('pnpm test tests/unit');

  let passedTests = 0;
  let totalTests = 0;

  if (unitTestResult.success) {
    try {
      // Parse Jest output to count tests
      const testResults = unitTestResult.output.match(/Tests:\s+(\d+)\s+passed,\s+(\d+)\s+failed/);
      if (testResults) {
        passedTests = parseInt(testResults[1]);
        totalTests = parseInt(testResults[1]) + parseInt(testResults[2]);
      }
    } catch (e) {
      console.warn('Could not parse unit test results:', e.message);
    }
  }

  return {
    ...unitTestResult,
    passedTests,
    totalTests,
  };
}

// Function to check performance goals
function checkPerformanceGoals(metrics) {
  const goals = { ...PERFORMANCE_GOALS };
  const results = {
    passed: [],
    failed: [],
    warnings: [],
  };

  // Check test coverage goals
  if (metrics.tests.coverage.total < goals.totalCoverage) {
    results.failed.push({
      goal: `Total coverage ${goals.totalCoverage}%`,
      actual: `${metrics.tests.coverage.total}%`,
      status: 'failed',
    });
  } else {
    results.passed.push({
      goal: `Total coverage ${goals.totalCoverage}%`,
      actual: `${metrics.tests.coverage.total}%`,
      status: 'passed',
    });
  }

  if (metrics.tests.coverage.functions < goals.functionCoverage) {
    results.failed.push({
      goal: `Function coverage ${goals.functionCoverage}%`,
      actual: `${metrics.tests.coverage.functions}%`,
      status: 'failed',
    });
  } else {
    results.passed.push({
      goal: `Function coverage ${goals.functionCoverage}%`,
      actual: `${metrics.tests.coverage.functions}%`,
      status: 'passed',
    });
  }

  if (metrics.tests.coverage.branches < goals.branchCoverage) {
    results.failed.push({
      goal: `Branch coverage ${goals.branchCoverage}%`,
      actual: `${metrics.tests.coverage.branches}%`,
      status: 'failed',
    });
  } else {
    results.passed.push({
      goal: `Branch coverage ${goals.branchCoverage}%`,
      actual: `${metrics.tests.coverage.branches}%`,
      status: 'passed',
    });
  }

  if (metrics.tests.coverage.lines < goals.lineCoverage) {
    results.failed.push({
      goal: `Line coverage ${goals.lineCoverage}%`,
      actual: `${metrics.tests.coverage.lines}%`,
      status: 'failed',
    });
  } else {
    results.passed.push({
      goal: `Line coverage ${goals.lineCoverage}%`,
      actual: `${metrics.tests.coverage.lines}%`,
      status: 'passed',
    });
  }

  // Check build performance goals
  if (metrics.build.duration > goals.buildTime) {
    results.failed.push({
      goal: `Build time ${goals.buildTime}ms`,
      actual: `${metrics.build.duration}ms`,
      status: 'failed',
    });
  } else {
    results.passed.push({
      goal: `Build time ${goals.buildTime}ms`,
      actual: `${metrics.build.duration}ms`,
      status: 'passed',
    });
  }

  if (metrics.build.bundleSize > goals.bundleSize) {
    results.warnings.push({
      goal: `Bundle size ${goals.bundleSize} bytes`,
      actual: `${metrics.build.bundleSize} bytes`,
      status: 'warning',
    });
  } else {
    results.passed.push({
      goal: `Bundle size ${goals.bundleSize} bytes`,
      actual: `${metrics.build.bundleSize} bytes`,
      status: 'passed',
    });
  }

  // Check test performance goals
  if (metrics.tests.duration > goals.testTime) {
    results.warnings.push({
      goal: `Test time ${goals.testTime}ms`,
      actual: `${metrics.tests.duration}ms`,
      status: 'warning',
    });
  } else {
    results.passed.push({
      goal: `Test time ${goals.testTime}ms`,
      actual: `${metrics.tests.duration}ms`,
      status: 'passed',
    });
  }

  // Check lint performance goals
  if (metrics.lint.duration > goals.lintTime) {
    results.warnings.push({
      goal: `Lint time ${goals.lintTime}ms`,
      actual: `${metrics.lint.duration}ms`,
      status: 'warning',
    });
  } else {
    results.passed.push({
      goal: `Lint time ${goals.lintTime}ms`,
      actual: `${metrics.lint.duration}ms`,
      status: 'passed',
    });
  }

  if (metrics.lint.errors > goals.maxErrors) {
    results.failed.push({
      goal: `Max errors ${goals.maxErrors}`,
      actual: `${metrics.lint.errors}`,
      status: 'failed',
    });
  } else {
    results.passed.push({
      goal: `Max errors ${goals.maxErrors}`,
      actual: `${metrics.lint.errors}`,
      status: 'passed',
    });
  }

  if (metrics.lint.warnings > goals.maxWarnings) {
    results.warnings.push({
      goal: `Max warnings ${goals.maxWarnings}`,
      actual: `${metrics.lint.warnings}`,
      status: 'warning',
    });
  } else {
    results.passed.push({
      goal: `Max warnings ${goals.maxWarnings}`,
      actual: `${metrics.lint.warnings}`,
      status: 'passed',
    });
  }

  // Check type checking performance goals
  if (metrics.typeCheck.duration > goals.typeCheckTime) {
    results.warnings.push({
      goal: `Type check time ${goals.typeCheckTime}ms`,
      actual: `${metrics.typeCheck.duration}ms`,
      status: 'warning',
    });
  } else {
    results.passed.push({
      goal: `Type check time ${goals.typeCheckTime}ms`,
      actual: `${metrics.typeCheck.duration}ms`,
      status: 'passed',
    });
  }

  if (metrics.typeCheck.typeErrors > goals.maxTypeErrors) {
    results.failed.push({
      goal: `Max type errors ${goals.maxTypeErrors}`,
      actual: `${metrics.typeCheck.typeErrors}`,
      status: 'failed',
    });
  } else {
    results.passed.push({
      goal: `Max type errors ${goals.maxTypeErrors}`,
      actual: `${metrics.typeCheck.typeErrors}`,
      status: 'passed',
    });
  }

  return results;
}

// Main regression test function
function runRegressionTest() {
  console.log('Starting regression test and metrics collection...\n');

  const startTime = Date.now();

  // Collect metrics
  const metrics = {
    timestamp: new Date().toISOString(),
    tests: {},
    build: {},
    lint: {},
    typeCheck: {},
    contractTests: {},
    integrationTests: {},
    unitTests: {},
    performance: {
      totalDuration: 0,
      totalMemoryUsage: {
        rss: 0,
        heapUsed: 0,
        heapTotal: 0,
      },
    },
  };

  // Run tests and collect metrics
  metrics.tests = runTests();
  metrics.build = runBuild();
  metrics.lint = runLint();
  metrics.typeCheck = runTypeCheck();
  metrics.contractTests = runContractTests();
  metrics.integrationTests = runIntegrationTests();
  metrics.unitTests = runUnitTests();

  // Calculate total performance metrics
  metrics.performance.totalDuration = Date.now() - startTime;
  metrics.performance.totalMemoryUsage.rss =
    metrics.tests.memoryUsage.rss +
    metrics.build.memoryUsage.rss +
    metrics.lint.memoryUsage.rss +
    metrics.typeCheck.memoryUsage.rss +
    metrics.contractTests.memoryUsage.rss +
    metrics.integrationTests.memoryUsage.rss +
    metrics.unitTests.memoryUsage.rss;

  metrics.performance.totalMemoryUsage.heapUsed =
    metrics.tests.memoryUsage.heapUsed +
    metrics.build.memoryUsage.heapUsed +
    metrics.lint.memoryUsage.heapUsed +
    metrics.typeCheck.memoryUsage.heapUsed +
    metrics.contractTests.memoryUsage.heapUsed +
    metrics.integrationTests.memoryUsage.heapUsed +
    metrics.unitTests.memoryUsage.heapUsed;

  metrics.performance.totalMemoryUsage.heapTotal =
    metrics.tests.memoryUsage.heapTotal +
    metrics.build.memoryUsage.heapTotal +
    metrics.lint.memoryUsage.heapTotal +
    metrics.typeCheck.memoryUsage.heapTotal +
    metrics.contractTests.memoryUsage.heapTotal +
    metrics.integrationTests.memoryUsage.heapTotal +
    metrics.unitTests.memoryUsage.heapTotal;

  // Check performance goals
  const performanceGoals = checkPerformanceGoals(metrics);

  // Create regression report
  const regressionReport = {
    timestamp: metrics.timestamp,
    summary: {
      totalDuration: metrics.performance.totalDuration,
      totalMemoryUsage: metrics.performance.totalMemoryUsage,
      overallSuccess:
        metrics.tests.success &&
        metrics.build.success &&
        metrics.lint.success &&
        metrics.typeCheck.success &&
        metrics.contractTests.success &&
        metrics.integrationTests.success &&
        metrics.unitTests.success,
      passedGoals: performanceGoals.passed.length,
      failedGoals: performanceGoals.failed.length,
      warningGoals: performanceGoals.warnings.length,
    },
    metrics,
    performanceGoals,
  };

  // Save regression report
  fs.writeFileSync(REGRESSION_REPORT_PATH, JSON.stringify(regressionReport, null, 2));

  // Create performance metrics report
  const performanceMetrics = {
    timestamp: metrics.timestamp,
    performance: {
      totalDuration: metrics.performance.totalDuration,
      totalMemoryUsage: metrics.performance.totalMemoryUsage,
    },
    tests: {
      duration: metrics.tests.duration,
      memoryUsage: metrics.tests.memoryUsage,
      coverage: metrics.tests.coverage,
    },
    build: {
      duration: metrics.build.duration,
      memoryUsage: metrics.build.memoryUsage,
      bundleSize: metrics.build.bundleSize,
    },
    lint: {
      duration: metrics.lint.duration,
      memoryUsage: metrics.lint.memoryUsage,
      warnings: metrics.lint.warnings,
      errors: metrics.lint.errors,
    },
    typeCheck: {
      duration: metrics.typeCheck.duration,
      memoryUsage: metrics.typeCheck.memoryUsage,
      typeErrors: metrics.typeCheck.typeErrors,
    },
    testResults: {
      contract: {
        duration: metrics.contractTests.duration,
        memoryUsage: metrics.contractTests.memoryUsage,
        passedTests: metrics.contractTests.passedTests,
        totalTests: metrics.contractTests.totalTests,
      },
      integration: {
        duration: metrics.integrationTests.duration,
        memoryUsage: metrics.integrationTests.memoryUsage,
        passedTests: metrics.integrationTests.passedTests,
        totalTests: metrics.integrationTests.totalTests,
      },
      unit: {
        duration: metrics.unitTests.duration,
        memoryUsage: metrics.unitTests.memoryUsage,
        passedTests: metrics.unitTests.passedTests,
        totalTests: metrics.unitTests.totalTests,
      },
    },
    performanceGoals: {
      total:
        performanceGoals.passed.length +
        performanceGoals.failed.length +
        performanceGoals.warnings.length,
      passed: performanceGoals.passed.length,
      failed: performanceGoals.failed.length,
      warnings: performanceGoals.warnings.length,
      details: performanceGoals,
    },
  };

  fs.writeFileSync(METRICS_REPORT_PATH, JSON.stringify(performanceMetrics, null, 2));

  // Print summary
  console.log('\n=== REGRESSION TEST SUMMARY ===');
  console.log(`Total Duration: ${metrics.performance.totalDuration}ms`);
  console.log(
    `Total Memory Usage: ${(metrics.performance.totalMemoryUsage.rss / 1024 / 1024).toFixed(2)}MB`
  );
  console.log(`Overall Success: ${regressionReport.summary.overallSuccess ? 'PASSED' : 'FAILED'}`);
  console.log(
    `Performance Goals: ${performanceGoals.passed.length} passed, ${performanceGoals.failed.length} failed, ${performanceGoals.warnings.length} warnings`
  );

  if (performanceGoals.failed.length > 0) {
    console.log('\n=== FAILED GOALS ===');
    performanceGoals.failed.forEach((goal) => {
      console.log(`❌ ${goal.goal}: ${goal.actual} (${goal.status})`);
    });
  }

  if (performanceGoals.warnings.length > 0) {
    console.log('\n=== WARNING GOALS ===');
    performanceGoals.warnings.forEach((goal) => {
      console.log(`⚠️ ${goal.goal}: ${goal.actual} (${goal.status})`);
    });
  }

  console.log('\n=== TEST RESULTS ===');
  console.log(
    `Tests: ${metrics.tests.success ? 'PASSED' : 'FAILED'} (${metrics.tests.duration}ms)`
  );
  console.log(
    `Coverage: ${metrics.tests.coverage.total}% (functions: ${metrics.tests.coverage.functions}%, branches: ${metrics.tests.coverage.branches}%, lines: ${metrics.tests.coverage.lines}%)`
  );
  console.log(
    `Build: ${metrics.build.success ? 'PASSED' : 'FAILED'} (${metrics.build.duration}ms, ${metrics.build.bundleSize} bytes)`
  );
  console.log(
    `Lint: ${metrics.lint.success ? 'PASSED' : 'FAILED'} (${metrics.lint.duration}ms, ${metrics.lint.warnings} warnings, ${metrics.lint.errors} errors)`
  );
  console.log(
    `Type Check: ${metrics.typeCheck.success ? 'PASSED' : 'FAILED'} (${metrics.typeCheck.duration}ms, ${metrics.typeCheck.typeErrors} errors)`
  );
  console.log(
    `Contract Tests: ${metrics.contractTests.success ? 'PASSED' : 'FAILED'} (${metrics.contractTests.passedTests}/${metrics.contractTests.totalTests})`
  );
  console.log(
    `Integration Tests: ${metrics.integrationTests.success ? 'PASSED' : 'FAILED'} (${metrics.integrationTests.passedTests}/${metrics.integrationTests.totalTests})`
  );
  console.log(
    `Unit Tests: ${metrics.unitTests.success ? 'PASSED' : 'FAILED'} (${metrics.unitTests.passedTests}/${metrics.unitTests.totalTests})`
  );

  console.log('\n=== REPORTS ===');
  console.log(`Regression Report: ${REGRESSION_REPORT_PATH}`);
  console.log(`Performance Metrics: ${METRICS_REPORT_PATH}`);

  return regressionReport;
}

// Run the regression test if this script is executed directly
if (require.main === module) {
  runRegressionTest();
}

module.exports = {
  runRegressionTest,
  PERFORMANCE_GOALS,
};
