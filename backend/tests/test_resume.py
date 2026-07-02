import pytest

from app.api.v1.resume import RESUME_PATH


@pytest.fixture(autouse=True)
def _ensure_missing():
    RESUME_PATH.unlink(missing_ok=True)
    yield
    RESUME_PATH.unlink(missing_ok=True)


def test_info_reports_unavailable_when_missing(client) -> None:
    response = client.get("/api/v1/resume/info")
    assert response.status_code == 200
    assert response.json() == {"available": False}


def test_download_404_when_missing(client) -> None:
    response = client.get("/api/v1/resume/download")
    assert response.status_code == 404


def test_download_serves_file_when_present(client) -> None:
    RESUME_PATH.parent.mkdir(parents=True, exist_ok=True)
    RESUME_PATH.write_bytes(b"%PDF-1.4 fake content for test")

    info_response = client.get("/api/v1/resume/info")
    assert info_response.json() == {"available": True}

    download_response = client.get("/api/v1/resume/download")
    assert download_response.status_code == 200
    assert download_response.headers["content-type"] == "application/pdf"
    assert "Tarachand_Rana_Resume.pdf" in download_response.headers["content-disposition"]
