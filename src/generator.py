import json
import subprocess
from contextlib import contextmanager
from pathlib import Path
from tempfile import NamedTemporaryFile, TemporaryDirectory

from bs4 import BeautifulSoup

DATA_PATH = Path(__file__).parent.parent / "data"


@contextmanager
def build_config(css_path: Path, custom_config: dict = None):
    with NamedTemporaryFile(mode="w", suffix=".json") as output_file:
        config_path = DATA_PATH / "chordpro.json"
        with open(config_path, "r") as config_file:
            config = json.load(config_file)

        if custom_config:
            config.update(custom_config)

        if "html" not in config:
            config["html"] = {}
        if "styles" not in config["html"]:
            config["html"]["styles"] = {}
        config["html"]["styles"]["print"] = f"file://{css_path.absolute()}"

        json.dump(config, output_file)
        output_file.flush()

        yield output_file.name


@contextmanager
def build_paths(chord_pro_content, css_path, custom_config=None):
    with TemporaryDirectory() as temp_dir:
        chord_pro_path = Path(temp_dir) / "song.chordpro"
        with open(chord_pro_path, "w") as f:
            f.write(chord_pro_content)

        with build_config(css_path, custom_config) as config_path:
            yield chord_pro_path, config_path


def generate_html(
    chord_pro_content: str, transpose: int, custom_config: dict = None, css_path: Path = DATA_PATH / "default.css"
) -> dict:
    with build_paths(chord_pro_content, css_path, custom_config) as (chord_pro_path, config_path):
        command = [
            "chordpro",
            chord_pro_path,
            f"--transpose={str(transpose)}",
            f"--config={config_path}",
            "--generate=HTML",
        ]

        result = subprocess.run(command, capture_output=True)

        soup = BeautifulSoup(result.stdout, "html.parser")
        with open(css_path, "r") as css_file:
            css_content = css_file.read()

            # add style tag just inside body
            body = soup.find("body")
            style_tag = soup.new_tag("style")
            style_tag.string = css_content
            body.insert_after(style_tag)

        return {
            "html": soup.prettify(),
            "error": result.stderr.decode("utf-8"),
        }


@contextmanager
def generate_pdf(
    chord_pro_content: str, transpose: int, custom_config: dict = None, css_path: Path = DATA_PATH / "default.css"
):
    result = generate_html(chord_pro_content, transpose, custom_config, css_path)

    with NamedTemporaryFile(mode="w+", suffix=".html") as html_file:
        html_file.write(result["html"])
        html_file.flush()

        with NamedTemporaryFile(mode="w+", suffix=".pdf") as pdf_file:
            # use google-chrome to generate pdf
            command = [
                "google-chrome",
                "--no-sandbox",
                "--headless",
                "--disable-gpu",
                "--print-to-pdf-no-header",
                f"--print-to-pdf={pdf_file.name}",
                html_file.name,
            ]

            subprocess.run(command)

            pdf_file.seek(0)

            yield {
                "pdf": pdf_file.name,
                "error": result["error"],
            }
