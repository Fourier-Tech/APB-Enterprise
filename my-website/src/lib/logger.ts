/**
 * APB Enterprise Production Logger
 * Provides a unified, consistent structured logging system across client and server environments.
 */
class Logger {
  private static formatMessage(level: "INFO" | "SUCCESS" | "WARN" | "ERROR" | "PERF", context: string, message: string) {
    // Keep timestamps clean and standard
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${context}] ${message}`;
  }

  static info(context: string, message: string) {
    console.log(this.formatMessage("INFO", context, message));
  }

  static success(context: string, message: string) {
    console.log(this.formatMessage("SUCCESS", context, message));
  }

  static warn(context: string, message: string) {
    console.warn(this.formatMessage("WARN", context, message));
  }

  static error(context: string, message: string, error?: any) {
    console.error(this.formatMessage("ERROR", context, message), error || "");
  }

  static perf(context: string, message: string, durationMs?: number) {
    const durStr = durationMs !== undefined ? ` in ${durationMs.toFixed(1)}ms` : "";
    console.log(this.formatMessage("PERF", context, `${message}${durStr}`));
  }
}

export default Logger;
export { Logger };
