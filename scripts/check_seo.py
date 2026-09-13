"""Validate generated SEO metadata and sitemap consistency."""
from html.parser import HTMLParser
from pathlib import Path
import xml.etree.ElementTree as ET


class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = {}
        self.canonical = []
        self.titles = []
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta":
            name = attrs.get("name", attrs.get("property"))
            if name:
                self.meta.setdefault(name, []).append(attrs.get("content", ""))
        elif tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(attrs.get("href"))
        elif tag == "title":
            self.titles.append("")
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, text):
        if self.in_title:
            self.titles[-1] += text


root = Path(__file__).resolve().parent.parent / "docs"
indexable = set()
titles = set()
count = 0
for page in root.rglob("*.html"):
    relative = page.relative_to(root).as_posix()
    if relative in {"cardoftheday.html", "articles/article.html"}:
        continue  # Historical redirect stubs, not sitemap destinations.
    if relative == "yandex_8174516e8ad894de.html":
        continue  # Ownership verification document, not a content page.
    head = Head()
    head.feed(page.read_text().split("</head>")[0])
    assert len(head.titles) == 1 and head.titles[0], relative
    assert head.titles[0] not in titles, f"Duplicate title: {relative}"
    titles.add(head.titles[0])
    expected = "https://raskladik.com/" + ("" if relative == "index.html" else relative)
    assert head.canonical == [expected], relative
    for name in ["description", "og:title", "og:description", "og:url", "og:image", "twitter:title"]:
        assert len(head.meta.get(name, [])) == 1 and head.meta[name][0], (relative, name)
    assert head.meta["og:url"] == [expected], relative
    assert head.meta["og:title"] == head.titles, relative
    assert head.meta["og:description"] == head.meta["description"], relative
    if "noindex" not in ",".join(head.meta.get("robots", [])):
        indexable.add(expected)
    count += 1
sitemap = ET.parse(root / "sitemap.xml")
locations = [node.text for node in sitemap.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
assert len(locations) == len(set(locations))
assert set(locations) == indexable
assert "Sitemap: https://raskladik.com/sitemap.xml" in (root / "robots.txt").read_text()
assert (root / "share/metatags.jpg").is_file()
print(f"SEO verified: {count} pages, {len(indexable)} sitemap URLs.")
