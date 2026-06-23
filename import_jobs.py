import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from supabase import create_client

SUPABASE_URL = "https://ybcnkemtzrzzmexafcik.supabase.co"
SUPABASE_KEY = "sb_publishable_8vak3DQ0LdH8aKpPiHJUfg_dO1DRF7x"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

REMOTIVE_URL = (
    "https://remotive.com/api/remote-jobs"
    "?category=software-dev"
)

retry_strategy = Retry(
    total=5,
    connect=5,
    read=5,
    backoff_factor=2,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET"],
)

session = requests.Session()
session.mount(
    "https://",
    HTTPAdapter(max_retries=retry_strategy),
)

headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json",
}

try:
    print("Fetching jobs from Remotive...")

    response = session.get(
        REMOTIVE_URL,
        headers=headers,
        timeout=60,
    )

    response.raise_for_status()

    response_data = response.json()
    jobs = response_data.get("jobs", [])

    print(f"Found {len(jobs)} jobs.")

except requests.exceptions.RequestException as error:
    print(f"Failed to fetch jobs from Remotive: {error}")
    raise SystemExit(1)

except ValueError as error:
    print(f"Remotive returned invalid JSON: {error}")
    raise SystemExit(1)


imported_count = 0
failed_count = 0

for job in jobs:
    try:
        job_id = job.get("id")

        if job_id is None:
            failed_count += 1
            print("Skipped job because it has no ID.")
            continue

        data = {
            "id": str(job_id),
            "title": job.get("title") or "Untitled job",
            "company": (
                job.get("company_name")
                or "Unknown company"
            ),
            "location": (
                job.get("candidate_required_location")
                or "Not specified"
            ),
            "salary": (
                job.get("salary")
                or "Not specified"
            ),
            "type": (
                job.get("job_type")
                or "Full-time"
            ),

            # نبقيها كما كانت حتى لا نغيّر منطق المشروع.
            "experience": "Junior",

            "description": (
                job.get("description")
                or ""
            ),
            "requirements": (
                job.get("description")
                or ""
            ),
            "url": job.get("url") or "",
            "source": "Remotive",
            "posted_date": (
                job.get("publication_date")
                or None
            ),
        }

        supabase.table("jobs").upsert(data).execute()

        imported_count += 1
        print(
            f"Imported {imported_count}: "
            f"{data['title']}"
        )

    except Exception as error:
        failed_count += 1
        print(
            "Failed to import: "
            f"{job.get('title', 'Unknown job')} "
            f"- {error}"
        )

print("")
print("Import finished.")
print(f"Successfully imported: {imported_count}")
print(f"Failed or skipped: {failed_count}")