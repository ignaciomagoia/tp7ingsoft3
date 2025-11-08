# tp7ingsoft3

## Backend test coverage

Run the coverage workflow locally from the project root:

```bash
cd backend
go test ./... -coverprofile=coverage.out
go tool cover -func=coverage.out
go tool cover -html=coverage.out -o coverage.html
```

- `coverage.out` contains the raw profile that the CI workflow uploads as an artifact.
- `go tool cover -func` prints the same summary that the pipeline logs.
- `coverage.html` is a navigable report you can open in a browser.
- The GitHub Actions job (`.github/workflows/go.yml`) fails if the total coverage reported by `go tool cover -func=coverage.out` drops below 70%.
