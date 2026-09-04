import test from 'node:test';
import assert from 'node:assert/strict';
import { BUILD_TIMEOUT_EXIT_CODE, runBuildWithRetry } from './retry.js';

test('retries once for non-timeout failure', async () => {
    const retCodes = [1, 0];
    let calls = 0;
    const warnings = [];
    const result = await runBuildWithRetry(async () => retCodes[calls++], msg => warnings.push(msg));

    assert.equal(result, 0);
    assert.equal(calls, 2);
    assert.equal(warnings.length, 1);
});

test('does not retry timeout exit code', async () => {
    let calls = 0;
    const warnings = [];
    const result = await runBuildWithRetry(async () => {
        calls += 1;
        return BUILD_TIMEOUT_EXIT_CODE;
    }, msg => warnings.push(msg));

    assert.equal(result, BUILD_TIMEOUT_EXIT_CODE);
    assert.equal(calls, 1);
    assert.equal(warnings.length, 0);
});
