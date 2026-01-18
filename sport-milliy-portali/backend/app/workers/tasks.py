from app.workers.celery_app import celery_app

@celery_app.task
def send_email_task(email: str, subject: str, body: str):
    """Send email asynchronously"""
    print(f"Sending email to {email}: {subject}")
    return True

@celery_app.task
def process_payment_task(transaction_id: int):
    """Process payment asynchronously"""
    print(f"Processing payment for transaction {transaction_id}")
    return True
