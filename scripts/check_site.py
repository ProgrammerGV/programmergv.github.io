"""Check public asset integrity, project data and navigation without dependencies."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'docs'


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.anchors = []
        self.assets = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        attr = dict(attrs)
        if 'id' in attr:
            self.ids.append(attr['id'])
        if tag == 'a' and attr.get('href'):
            self.links.append(attr['href'])
        if tag == 'a' and attr.get('href', '').startswith('#'):
            self.anchors.append(attr['href'][1:])
        if tag in ('script', 'img') and attr.get('src'):
            self.assets.append(attr['src'])
        if tag == 'link' and attr.get('rel') in ('stylesheet', 'icon'):
            self.assets.append(attr['href'])
        if tag == 'a' and attr.get('target') == '_blank':
            assert 'noopener' in attr.get('rel', ''), 'Link externo sem noopener.'
        if tag == 'img':
            assert 'alt' in attr, 'Imagem sem alternativa textual.'


def check():
    page = SiteParser()
    page.feed((SITE / 'index.html').read_text(encoding='utf-8'))
    assert len(page.ids) == len(set(page.ids)), 'IDs duplicados.'
    assert all(anchor in page.ids for anchor in page.anchors), 'Âncora sem destino.'
    for asset in page.assets:
        assert not urlparse(asset).scheme, 'Dependência externa no carregamento inicial.'
        assert (SITE / urlparse(asset).path).is_file(), f'Asset ausente: {asset}'
    projects = json.loads((SITE / 'projects.json').read_text(encoding='utf-8'))
    assert projects and len({p['id'] for p in projects}) == len(projects), 'IDs de projeto duplicados.'
    for project in projects:
        for key in ('id', 'title', 'description', 'category', 'repository'):
            assert isinstance(project[key], str) and project[key].strip(), f'Campo inválido: {key}'
        assert re.fullmatch(r'[a-z0-9-]+', project['id']), 'ID deve formar uma âncora estável.'
        assert isinstance(project['tags'], list) and project['tags'], 'Informe tecnologias.'
        assert project['filters'] and set(project['filters']) <= {'ia', 'automacao', 'web'}
        assert urlparse(project['repository']).scheme == 'https'
        if project.get('demo_url'):
            assert urlparse(project['demo_url']).scheme == 'https'
            assert project['demo_url'] in page.links, 'Aplicação sem acesso direto no HTML.'
        for key in ('image', 'video'):
            if project.get(key):
                path = (SITE / project[key]).resolve()
                assert path.is_relative_to(SITE.resolve()) and path.is_file(), f'Asset inválido: {key}'
        if project.get('image'):
            assert project.get('image_alt'), 'Captura sem descrição.'
    print(f'OK: {len(projects)} projetos, âncoras válidas, assets locais e nenhuma dependência externa inicial.')


if __name__ == '__main__':
    check()
