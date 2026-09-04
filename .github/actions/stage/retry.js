export const BUILD_TIMEOUT_EXIT_CODE = 124;

export async function runBuildWithRetry(runBuild, warn) {
    let retCode;
    try {
        retCode = await runBuild();
    } catch (err) {
        const errorText = err instanceof Error ? err.message : String(err);
        warn(`Build execution threw an error (${errorText}). Retrying once to recover from transient failures.`);
        return await runBuild();
    }
    if (retCode !== 0 && retCode !== BUILD_TIMEOUT_EXIT_CODE) {
        warn(`Build failed with exit code ${retCode}. Retrying once to recover from transient failures.`);
        retCode = await runBuild();
    }
    return retCode;
}
