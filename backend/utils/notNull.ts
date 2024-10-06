class NotNullError extends Error {
    constructor(message?: string) {
       super(message)
       this.name = 'NotNullError'
       if (this.stack) {
          const stackLines = this.stack.split('\n');
          // Remove the first line (error message) and the current function's stack frame
          this.stack = [stackLines[0], ...stackLines.slice(2)].join('\n');
       }
    }
 }
 
export default function notNull<T>(
    x: T | undefined | null,
    message = 'Variable should not be undefined or null. Please check the stack to see where the error comes from.'
 ): T {
    if (typeof x === 'undefined' || x === null) {
       throw new NotNullError(message);
    }
    return x as T
 }