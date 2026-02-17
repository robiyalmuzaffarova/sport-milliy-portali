from sqladmin import ModelView
from starlette.requests import Request
from app.models.news import News
from app.models.merch import Merch
from app.models.education import Education
from app.models.job_vacancy import JobVacancy


class BaseAdminView(ModelView):
    def _has_full_crud(self, request: Request) -> bool:
        # 1. Superusers ALWAYS get full CRUD
        if request.session.get("is_superuser", False):
            return True

        # 2. Admin Logic
        role = str(request.session.get("role", "")).upper()
        if role == "ADMIN":
            # Only these classes allow Create/Edit/Delete for Admins
            allowed = ["NewsAdmin", "MerchAdmin", "EducationAdmin", "JobVacancyAdmin"]
            return self.__class__.__name__ in allowed

        return False

    def can_create(self, request: Request) -> bool:
        return self._has_full_crud(request)

    def can_edit(self, request: Request) -> bool:
        return self._has_full_crud(request)

    def can_delete(self, request: Request) -> bool:
        return self._has_full_crud(request)

    def can_view_details(self, request: Request) -> bool:
        # Eye icon visible for both Superuser and Admin
        return True


class NewsAdmin(BaseAdminView, model=News):
    name = "News"
    name_plural = "News Articles"
    icon = "fa-solid fa-newspaper"

    column_list = [
        News.id,
        News.title,
        News.category,
        News.author,
        News.views_count,
        News.created_at
    ]

    column_searchable_list = [News.title, News.content, News.snippet]
    column_sortable_list = [News.id, News.title, News.views_count, News.created_at]
    column_default_sort = [(News.created_at, True)]
    column_filters = [News.category, News.author_id]

    form_columns = [
        "title",
        "slug",
        "snippet",
        "content",
        "image_url",
        "category"
    ]

    column_labels = {
        "title": "Title",
        "slug": "Slug",
        "snippet": "Snippet",
        "content": "Content",
        "image_url": "Image URL",
        "category": "Category"
    }

    column_formatters = {
        News.title: lambda m, a: m.title[:50] + "..." if len(m.title) > 50 else m.title,
        News.content: lambda m, a: m.content[:100] + "..." if len(m.content) > 100 else m.content,
    }

    page_size = 20
    page_size_options = [10, 20, 50, 100]
    can_export = True
    allow_admin_delete = True


class MerchAdmin(BaseAdminView, model=Merch):
    name = "Merchandise"
    name_plural = "Merchandise"
    icon = "fa-solid fa-shirt"

    column_list = [
        Merch.id,
        Merch.name,
        Merch.brand,
        Merch.category,
        Merch.price,
        Merch.stock,
        Merch.is_available,
        Merch.owner,
        Merch.created_at
    ]

    column_searchable_list = [Merch.name, Merch.description, Merch.brand]
    column_sortable_list = [Merch.id, Merch.name, Merch.price, Merch.stock, Merch.created_at]
    column_default_sort = [(Merch.created_at, True)]
    column_filters = [Merch.category, Merch.is_available, Merch.owner_id]

    form_columns = [
        Merch.name,
        Merch.brand,
        Merch.description,
        Merch.price,
        Merch.stock,
        Merch.image_url,
        Merch.category,
        Merch.is_available,
        Merch.owner_id
    ]

    column_formatters = {
        Merch.price: lambda m, a: f"{m.price:,} UZS",
        Merch.description: lambda m, a: (m.description[:50] + "...") if m.description and len(m.description) > 50 else m.description,
    }

    page_size = 20
    page_size_options = [10, 20, 50, 100]
    can_export = True
    allow_admin_delete = True


class EducationAdmin(BaseAdminView, model=Education):
    name = "Educational Institution"
    name_plural = "Educational Institutions"
    icon = "fa-solid fa-school"

    column_list = [
        Education.id,
        Education.name,
        Education.region,
        Education.address,
        Education.created_at
    ]

    column_searchable_list = [Education.name, Education.description, Education.address]
    column_sortable_list = [Education.id, Education.name, Education.created_at]
    column_filters = [Education.region]

    form_columns = [
        Education.name,
        Education.description,
        Education.region,
        Education.address,
        Education.working_hours,
        Education.image_url
    ]

    column_formatters = {
        Education.description: lambda m, a: (m.description[:100] + "...") if m.description and len(m.description) > 100 else m.description,
    }

    page_size = 20
    page_size_options = [10, 20, 50, 100]
    can_export = True
    allow_admin_delete = True


class JobVacancyAdmin(BaseAdminView, model=JobVacancy):
    name = "Job Vacancy"
    name_plural = "Job Vacancies"
    icon = "fa-solid fa-briefcase"

    column_list = [
        JobVacancy.id,
        JobVacancy.title,
        JobVacancy.company,
        JobVacancy.image_url,
        JobVacancy.location,
        JobVacancy.is_active,
        JobVacancy.created_at
    ]

    column_searchable_list = [JobVacancy.title, JobVacancy.description, JobVacancy.company]
    column_sortable_list = [JobVacancy.id, JobVacancy.title, JobVacancy.created_at]
    column_default_sort = [(JobVacancy.created_at, True)]
    column_filters = [JobVacancy.is_active, JobVacancy.location]

    form_columns = [
        JobVacancy.title,
        JobVacancy.description,
        JobVacancy.company,
        JobVacancy.image_url,
        JobVacancy.location,
        JobVacancy.salary_range,
        JobVacancy.contact,
        JobVacancy.is_active
    ]

    column_formatters = {
        JobVacancy.description: lambda m, a: m.description[:100] + "..." if len(m.description) > 100 else m.description,
        JobVacancy.image_url: lambda m, a: (m.image_url[:40] + "...") if m.image_url and len(m.image_url) > 40 else (m.image_url or "No image"),
    }

    page_size = 20
    page_size_options = [10, 20, 50, 100]
    can_export = True
    allow_admin_delete = True


__all__ = [
    "NewsAdmin",
    "MerchAdmin",
    "EducationAdmin",
    "JobVacancyAdmin",
]