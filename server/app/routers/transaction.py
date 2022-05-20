from fastapi import FastAPI, HTTPException, Depends, status, APIRouter
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas, oauth2, database


router = APIRouter(prefix='/transactions', tags=['Transactions'])


@router.get('/{id}')
def get_transactions(id: int, db: Session=Depends(database.get_db)):
    transactions = db.query(models.Transaction).filter_by(account_id=id).all()
    
    return transactions


@router.post('/')
def create_transaction(request: schemas.TransactionCreate, db: Session=Depends(database.get_db), current_user: int=Depends(oauth2.get_current_user)):
    new_transaction = models.Transaction(user_id=current_user.id, **request.dict())
    
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    
    return new_transaction


@router.post('/{id}')
def create_recipient_transaction(id: int, request: schemas.TransactionCreate, db: Session=Depends(database.get_db)):
    print(id)
    new_transaction = models.Transaction(user_id=id, **request.dict())

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    
    return new_transaction