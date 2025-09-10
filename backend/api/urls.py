from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreateView.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDeleteView.as_view(), name="delete-note"),
    path("session/token/", views.CustomTokenObtainPairView.as_view(), name="get_cookie_token"),
    path("session/refresh/", views.SessionRefreshView.as_view(), name="refresh_cookie_token"),
]