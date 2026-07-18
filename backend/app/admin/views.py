from sqladmin import ModelView
import wtforms
from wtforms.validators import DataRequired
from starlette.requests import Request
from app.models.news import News
from app.models.merch import Merch
from app.models.education import Education
from app.models.job_vacancy import JobVacancy
from app.models.user import User, UserRole


class BaseAdminView(ModelView):

    def _is_super(self, request: Request) -> bool:
        # Use new session key "admin_is_superuser"
        val = request.session.get("admin_is_superuser", False)
        if isinstance(val, bool):
            return val
        return str(val).lower() in ["true", "1", "t", "yes"]

    def is_accessible(self, request: Request) -> bool:
        # Check new session key "admin_authenticated"
        if not request.session.get("admin_authenticated"):
            return False
        if self._is_super(request):
            return True
        role = str(request.session.get("admin_role", "")).lower()
        return role == "admin"

    def _has_full_crud(self, request: Request) -> bool:
        if self._is_super(request):
            return True
        role = str(request.session.get("admin_role", "")).lower()
        if role == "admin":
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
        return True


class NewsAdmin(BaseAdminView, model=News):
    name = "News"
    name_plural = "News Articles"
    icon = "fa-solid fa-newspaper"
    column_list = [News.id, News.title, News.category, News.author, News.views_count, News.created_at]
    column_searchable_list = [News.title, News.content, News.snippet]
    column_sortable_list = [News.id, News.title, News.views_count, News.created_at]
    column_default_sort = [(News.created_at, True)]
    column_filters = [News.category, News.author_id]
    form_columns = ["title", "slug", "snippet", "content", "image_url", "category"]
    column_labels = {
        "title": "Title", "slug": "Slug", "snippet": "Snippet",
        "content": "Content", "image_url": "Image URL", "category": "Category"
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
    column_list = [Merch.id, Merch.name, Merch.brand, Merch.category, Merch.price, Merch.stock, Merch.is_available, Merch.owner, Merch.created_at]
    column_searchable_list = [Merch.name, Merch.description, Merch.brand]
    column_sortable_list = [Merch.id, Merch.name, Merch.price, Merch.stock, Merch.created_at]
    column_default_sort = [(Merch.created_at, True)]
    column_filters = [Merch.category, Merch.is_available, Merch.owner_id]
    form_columns = [Merch.name, Merch.brand, Merch.description, Merch.price, Merch.stock,
                    Merch.image_url, Merch.category, Merch.is_available,
                    Merch.discount_percent, Merch.is_new, Merch.owner_id]
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
    column_list = [Education.id, Education.name, Education.region, Education.address, Education.created_at]
    column_searchable_list = [Education.name, Education.description, Education.address]
    column_sortable_list = [Education.id, Education.name, Education.created_at]
    column_filters = [Education.region, Education.type]
    form_overrides = {
        "type": wtforms.SelectField,
    }
    form_columns = [Education.name, Education.description, Education.region, Education.address,
                    Education.type, Education.working_hours, Education.image_url]
    form_args = {
        "type": {
            "choices": [
                ("academy", "Akademiya"),
                ("federation", "Federatsiya"),
                ("school", "Maktab"),
                ("club", "Club"),
            ],
            "validators": [DataRequired(message="Educational institution type is required.")]
        }
    }
    column_formatters = {
        Education.description: lambda m, a: (m.description[:100] + "...") if m.description and len(m.description) > 100 else m.description,
    }
    async def on_model_change(self, data: dict, model, is_created: bool, request) -> None:
        education_type = data.get("type")
        if education_type is not None:
            normalized_type = str(education_type).strip().lower()
            if normalized_type:
                data["type"] = normalized_type
                model.type = normalized_type

    page_size = 20
    page_size_options = [10, 20, 50, 100]
    can_export = True
    allow_admin_delete = True


class JobVacancyAdmin(BaseAdminView, model=JobVacancy):
    name = "Job Vacancy"
    name_plural = "Job Vacancies"
    icon = "fa-solid fa-briefcase"
    column_list = [JobVacancy.id, JobVacancy.title, JobVacancy.company, JobVacancy.region,
                   JobVacancy.employment_type, JobVacancy.sport_type, JobVacancy.location,
                   JobVacancy.is_active, JobVacancy.created_at]
    column_searchable_list = [JobVacancy.title, JobVacancy.description, JobVacancy.company]
    column_sortable_list = [JobVacancy.id, JobVacancy.title, JobVacancy.created_at]
    column_default_sort = [(JobVacancy.created_at, True)]
    column_filters = [JobVacancy.is_active, JobVacancy.location, JobVacancy.region,
                       JobVacancy.employment_type, JobVacancy.sport_type]
    # region/employment_type/sport_type are proper SQLAlchemy Enum columns, so sqladmin
    # generates their dropdowns automatically — no form_overrides/form_args needed here,
    # unlike Education.type (which is a plain string column with manual choices).
    form_columns = [JobVacancy.title, JobVacancy.description, JobVacancy.company, JobVacancy.image_url,
                    JobVacancy.location, JobVacancy.region, JobVacancy.employment_type,
                    JobVacancy.sport_type, JobVacancy.salary_range, JobVacancy.contact,
                    JobVacancy.is_active]
    column_formatters = {
        JobVacancy.description: lambda m, a: m.description[:100] + "..." if len(m.description) > 100 else m.description,
        JobVacancy.image_url: lambda m, a: (m.image_url[:40] + "...") if m.image_url and len(m.image_url) > 40 else (m.image_url or "No image"),
    }
    page_size = 20
    page_size_options = [10, 20, 50, 100]
    can_export = True
    allow_admin_delete = True


class UserAdmin(BaseAdminView, model=User):
    name = "User"
    name_plural = "Users"
    icon = "fa-solid fa-users"
    column_list = [User.id, User.email, User.full_name, User.role, User.is_active, User.is_superuser, User.created_at]
    column_searchable_list = [User.email, User.full_name]
    column_sortable_list = [User.id, User.email, User.role, User.created_at]
    column_filters = [User.role, User.is_active, User.is_superuser]
    form_excluded_columns = ["hashed_password", "news_articles", "merches",
                              "ai_chats", "favorites", "cart_items", "transactions",
                              "uploaded_courses"]
    form_extra_fields = {
        "password": wtforms.PasswordField("Password")
    }

    async def on_model_change(self, data: dict, model, is_created: bool, request) -> None:
        password = data.pop("password", None)

        if is_created:
            if not password:
                raise ValueError("Password is required when creating a user.")
            model.hashed_password = get_password_hash(password)
        elif password:
            model.hashed_password = get_password_hash(password)

    page_size = 20
    can_export = True
    allow_admin_delete = False


__all__ = ["NewsAdmin", "MerchAdmin", "EducationAdmin", "JobVacancyAdmin", "UserAdmin"]