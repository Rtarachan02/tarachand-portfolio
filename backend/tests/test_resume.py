import pathlib

import pytest

import app.api.v1.resume as resume_module


@pytest.fixture(autouse=True)
def _fake_resume_path(monkeypatch, tmp_path: pathlib.Path):
    # Point the router at a throwaway path instead of the real
    # backend/resources/resume/resume.pdf — tests must never touch real user data.
    fake_path = tmp_path / "resume.pdf"
    monkeypatch.setattr(resume_module, "RESUME_PATH", fake_path)
    return fake_path


def test_info_reports_unavailable_when_missing(client) -> None:
    response = client.get("/api/v1/resume/info")
    assert response.status_code == 200
    assert response.json() == {"available": False}


def test_download_404_when_missing(client) -> None:
    response = client.get("/api/v1/resume/download")
    assert response.status_code == 404


def test_download_serves_file_when_present(client, _fake_resume_path) -> None:
    _fake_resume_path.write_bytes(b"%PDF-1.4 fake content for test")

    info_response = client.get("/api/v1/resume/info")
    assert info_response.json() == {"available": True}

    download_response = client.get("/api/v1/resume/download")
    assert download_response.status_code == 200
    assert download_response.headers["content-type"] == "application/pdf"
    assert "Tarachand_Rana_Resume.pdf" in download_response.headers["content-disposition"]
