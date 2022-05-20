from fastapi import FastAPI, HTTPException, Depends, status, APIRouter
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas, oauth2, database
import random


router = APIRouter(prefix='/accounts', tags=['Accounts'])


@router.post('/transfer/recipient/{id}')
def update_recipient(id: int, request: schemas.AccountCreate, db: Session=Depends(database.get_db)):
    account = db.query(models.Account).filter(models.Account.id == id)
    account.update(request.dict())
    db.commit()
    return account.first()


@router.post('/transfer/{id}')
def update(id: int, request: schemas.AccountCreate, db: Session=Depends(database.get_db), current_user: int=Depends(oauth2.get_current_user)):
    account = db.query(models.Account).filter(models.Account.id == id)
    account.update(request.dict())
    db.commit()
    return account.first()


@router.get('/recipient/{id}')
def get_recipient_account(id: int, db: Session=Depends(database.get_db)):
    account = db.query(models.Account).filter(models.Account.owner_id == id).first()
    
    return account


@router.get('/{id}')
def get_account(id: int, db: Session=Depends(database.get_db), current_user: int = Depends(oauth2.get_current_user)):
    account = db.query(models.Account).filter(models.Account.id == id).first()
    
    return account


@router.get('/all/{id}', response_model=List[schemas.AccountOut])
def get_accounts(id: int, db: Session=Depends(database.get_db), current_user: int=Depends(oauth2.get_current_user)):
    accounts = db.query(models.Account).filter_by(owner_id=id).all()
    
    return accounts


@router.post('/', status_code=status.HTTP_201_CREATED, response_model=schemas.AccountOut)
def create_account(account: schemas.AccountCreate, db: Session=Depends(database.get_db), current_user: int=Depends(oauth2.get_current_user)):
    account_number = str(current_user.id)
    account_number = account_number + str(random.randint(0,10000))
    account_number = int(account_number)
    
    new_account = models.Account(owner_id=current_user.id, account_number=account_number, **account.dict())
    
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    
    return new_account

