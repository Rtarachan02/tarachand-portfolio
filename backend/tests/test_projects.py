def test_list_projects_returns_200(client) -> None:
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_unknown_project_returns_404(client) -> None:
    response = client.get("/api/v1/projects/does-not-exist")
    assert response.status_code == 404
