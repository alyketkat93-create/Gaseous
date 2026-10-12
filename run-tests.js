// Quick execution of engineering verification test suite
import { runEngineeringVerificationTests } from './src/engineering/testRunner.ts';

const result = runEngineeringVerificationTests();
console.log('=====================================================');
console.log(`FIRECALC PRO - ENGINEERING VERIFICATION TEST RESULTS`);
console.log(`Passed: ${result.passedCount} / ${result.totalCount}`);
console.log('=====================================================');
result.results.forEach((r, i) => {
  const status = r.passed ? '✓ PASS' : '✗ FAIL';
  console.log(`${i + 1}. [${status}] ${r.testName}`);
  console.log(`   Expected: ${r.expected}`);
  console.log(`   Actual:   ${r.actual}`);
});
console.log('=====================================================');

if (result.passedCount !== result.totalCount) {
  process.exit(1);
}
