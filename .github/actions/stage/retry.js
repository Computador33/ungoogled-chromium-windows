export const BUILD_TIMEOUT_EXIT_CODE = 124;
const BUILD_FAILED_EXIT_CODE = 1;

export async function runBuildWithRetry(runBuild, warn) {
    let retCode;
    try {
        retCode = await runBuild();
    } catch (err) {
        const errorText = err instanceof Error ? err.message : String(err);
        warn(`Build execution threw an error (${errorText}). Retrying once to recover from transient failures.`);
        try {
            return await runBuild();
        } catch (retryErr) {
            const retryErrorText = retryErr instanceof Error ? retryErr.message : String(retryErr);
            warn(`Build retry threw an error (${retryErrorText}). Treating this as a build failure.`);
            return BUILD_FAILED_EXIT_CODE;
        }
    }
    if (retCode !== 0 && retCode !== BUILD_TIMEOUT_EXIT_CODE) {
        warn(`Build failed with exit code ${retCode}. Retrying once to recover from transient failures.`);
        try {
            retCode = await runBuild();
        } catch (retryErr) {
            const retryErrorText = retryErr instanceof Error ? retryErr.message : String(retryErr);
            warn(`Build retry threw an error (${retryErrorText}). Treating this as a build failure.`);
            return BUILD_FAILED_EXIT_CODE;
        }
    }
    return retCode;
}
