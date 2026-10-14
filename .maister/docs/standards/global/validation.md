## Validation

### At the Public API Boundary
This is a client-side library with no server: validate options and time strings where they enter the public API and report problems through the `error` event.

### Validate Early
Check inputs as early as possible and reject invalid data before processing.

### Specific Errors
Provide clear, field-specific messages that help users correct their input.

### Allowlists Over Blocklists
Define what's allowed rather than trying to block everything else.

### Type and Format Checks
Validate data types, formats, ranges, and required fields systematically.

### Input Sanitization
Sanitize user input to prevent injection attacks (SQL, XSS, command injection).

### Business Rules
Validate business logic (sufficient balance, valid dates) at the appropriate layer.

### Consistent Enforcement
Apply validation uniformly across all entry points (forms, APIs, background jobs).
