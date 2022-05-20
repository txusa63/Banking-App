from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import database, models
from app.routers import auth, user, account, transaction
models.Base.metadata.create_all(bind=database.engine)


app = FastAPI()


origins = ['*']


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(account.router)
app.include_router(transaction.router)

@app.get('/')
async def root():
    return {'message': 'Welcome!'}