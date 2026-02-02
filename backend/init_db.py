import models
from database import engine, SessionLocal
from auth import get_password_hash

def init_db():
    print("Initializing SQLite Database...")
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    # Check if admin/test users exist, if not create them
    test_users = [
        {"email": "industry@example.com", "password": "password123", "role": "INDUSTRY_USER"},
        {"email": "student@example.com", "password": "password123", "role": "STUDENT_USER"}
    ]
    
    for user_data in test_users:
        existing = db.query(models.User).filter(models.User.email == user_data["email"]).first()
        if not existing:
            print(f"Creating test user: {user_data['email']} ({user_data['role']})")
            new_user = models.User(
                email=user_data["email"],
                hashed_password=get_password_hash(user_data["password"]),
                role=user_data["role"]
            )
            db.add(new_user)
    
    db.commit()
    db.close()
    print("Database initialized successfully.")

if __name__ == "__main__":
    init_db()
