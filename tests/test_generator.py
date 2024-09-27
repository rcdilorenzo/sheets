from pathlib import Path
from src.generator import generate_html, generate_pdf
from bs4 import BeautifulSoup

TEST_DATA_PATH = Path(__file__).parent / "data"

def test_generate_html():
    with open(TEST_DATA_PATH / "we-three-kings.chordpro", "r") as f:
        chord_pro_content = f.read()

    result = generate_html(chord_pro_content, 0)
    
    # Ensure result is html-parseable
    soup = BeautifulSoup(result["html"], "html.parser")
    assert soup is not None

    # Ensure custom css is included
    assert "Verdana" in result["html"]

    # Example still has errors so that's okay
    assert "Unknown chord" in result["error"]

def test_generate_pdf():
    with open(TEST_DATA_PATH / "we-three-kings.chordpro", "r") as f:
        chord_pro_content = f.read()

    with generate_pdf("test.pdf", chord_pro_content, 0) as result:
        assert "pdf" in result
        assert "error" in result