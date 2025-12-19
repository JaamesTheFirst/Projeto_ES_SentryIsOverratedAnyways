# 🔄 SDK Migration Guide

## Moving the JavaScript SDK

You need to move the existing `sdk/` directory to `sdks/js/`:

```bash
# From project root
mv sdk sdks/js
```

This reorganizes the SDK structure to support multiple language SDKs.

## New Structure

After migration:

```
sdks/
├── js/              # JavaScript/TypeScript SDK (moved from sdk/)
│   ├── src/
│   ├── package.json
│   └── README.md
├── python/          # Python SDK (new)
│   ├── error_tracker/
│   ├── setup.py
│   └── README.md
└── README.md        # Overview
```

## Next Steps

1. **Move the JavaScript SDK**:
   ```bash
   mv sdk sdks/js
   ```

2. **Update package.json** (in `sdks/js/package.json`):
   Change the package name to `@error-tracker/js`:
   ```json
   {
     "name": "@error-tracker/js",
     ...
   }
   ```

3. **Test the JavaScript SDK**:
   ```bash
   cd sdks/js
   npm install
   npm run build
   ```

4. **Test the Python SDK**:
   ```bash
   cd sdks/python
   pip install -e .
   python -c "from error_tracker import ErrorTracker; print('OK')"
   ```

## Creating Additional SDKs

To add more SDKs (e.g., NestJS, Go, Ruby):

1. Create a new directory: `sdks/nestjs/`, `sdks/go/`, etc.
2. Follow the same pattern:
   - Own package structure
   - Own build system
   - Own documentation
   - Same API contract (sends to `/api/errors/report`)

