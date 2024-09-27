## Running the Docker Image

To run the application using Docker, follow these steps:

1. Build the Docker image:
   ```
   docker build -t sheets .
   ```

2. Run the Docker container:
   ```
   docker run -p 8081:8081 --rm sheets
   ```

   This will start the service and make it available on `http://localhost:8081`.

## Using the API

You can use curl to send requests to the API for both HTML and PDF generation.

### Generate HTML

To generate HTML from ChordPro content:

```bash
CONTENT=$(cat -A tests/data/we-three-kings.chordpro | sed 's/\$/\\n/g') \
curl -X POST http://localhost:8081/generate_html \
-H "Content-Type: application/json" \
-d @- << EOF
{
"content": "${CONTENT}",
"transpose": 0
}
EOF
```

### Generate PDF

To generate PDF from ChordPro content:

```bash
CONTENT=$(cat -A tests/data/we-three-kings.chordpro | sed 's/\$/\\n/g') \
curl -X POST http://localhost:8081/generate_pdf \
--output output.pdf \
-H "Content-Type: application/json" \
-d @- << EOF
{
"content": "${CONTENT}",
"transpose": 0
}
EOF
```

This will save the generated PDF as `output.pdf` in your current directory.

Note: Replace the example ChordPro content with your actual content. The `transpose` parameter is optional and defaults to 0 if not provided.